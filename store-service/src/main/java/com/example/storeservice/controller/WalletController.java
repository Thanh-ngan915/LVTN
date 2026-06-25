    package com.example.storeservice.controller;

    import com.example.storeservice.dto.WithdrawalRequestDTO;
    import com.example.storeservice.entity.Wallet;
    import com.example.storeservice.entity.WalletTransaction;
    import com.example.storeservice.entity.WithdrawalRequest;
    import com.example.storeservice.repository.WalletRepository;
    import com.example.storeservice.repository.WalletTransactionRepository;
    import com.example.storeservice.repository.WithdrawalRequestRepository;
    import com.example.storeservice.service.VNPayMockService;
    import com.example.storeservice.service.WalletService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.domain.Sort;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.time.LocalDateTime;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/wallet")
    @RequiredArgsConstructor
    public class WalletController {

        private final WalletService walletService;
        private final WalletRepository walletRepository;
        private final WalletTransactionRepository walletTransactionRepository;
        private final WithdrawalRequestRepository withdrawalRequestRepository;
        private final VNPayMockService vnPayMockService;

        // Order-service gọi vào khi đơn completed
        @PostMapping("/store/{storeId}/credit-pending")
        public ResponseEntity<Void> creditPending(
                @PathVariable String storeId,
                @RequestParam Double amount,
                @RequestParam String referenceId) {
            walletService.creditPendingBalance(storeId, amount, referenceId);
            return ResponseEntity.ok().build();
        }

        // Order-service gọi sau 3 ngày để release pending → available
        @PostMapping("/store/{storeId}/release-pending")
        public ResponseEntity<Void> releasePending(
                @PathVariable String storeId,
                @RequestParam Double amount,
                @RequestParam String referenceId) {
            walletService.releasePendingToAvailable(storeId, amount, referenceId);
            return ResponseEntity.ok().build();
        }

        // Seller xem số dư ví
        @GetMapping("/me")
        public ResponseEntity<Wallet> getMyWallet(
                @RequestHeader("X-Store-Id") String storeId) {
            Wallet wallet = walletRepository.findByStoreId(storeId)
                    .orElseThrow(() -> new RuntimeException("Ví chưa được khởi tạo"));
            return ResponseEntity.ok(wallet);
        }

        // Seller xem lịch sử giao dịch
        @GetMapping("/me/transactions")
        public ResponseEntity<Page<WalletTransaction>> getTransactions(
                @RequestHeader("X-Store-Id") String storeId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
            Wallet wallet = walletRepository.findByStoreId(storeId)
                    .orElseThrow(() -> new RuntimeException("Ví chưa được khởi tạo"));
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            return ResponseEntity.ok(
                    walletTransactionRepository.findByWalletId(wallet.getId(), pageable));
        }

        // Seller yêu cầu rút tiền
        @PostMapping("/me/withdraw")
        public ResponseEntity<WithdrawalRequest> requestWithdrawal(
                @RequestHeader("X-Store-Id") String storeId,
                @RequestBody WithdrawalRequestDTO dto) {
            Wallet wallet = walletRepository.findByStoreId(storeId)
                    .orElseThrow(() -> new RuntimeException("Ví chưa được khởi tạo"));

            // Build trước để có ID dùng làm referenceId
            WithdrawalRequest req = WithdrawalRequest.builder()
                    .storeId(storeId)
                    .walletId(wallet.getId())
                    .amount(dto.getAmount())
                    .bankAccountNumber(dto.getBankAccountNumber())
                    .bankName(dto.getBankName())
                    .accountHolderName(dto.getAccountHolderName())
                    .createdBy(storeId)
                    .build();
            req = withdrawalRequestRepository.save(req);

            // Giữ tiền lại (reserved), dùng req.getId() làm referenceId
            walletService.debitAvailableBalance(storeId, dto.getAmount(), req.getId());
            return ResponseEntity.ok(req);
        }

        // Admin xem danh sách yêu cầu rút tiền
        @GetMapping("/admin/withdrawals")
        public ResponseEntity<Page<WithdrawalRequest>> getAllWithdrawals(
                @RequestParam(required = false) String status,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<WithdrawalRequest> result = (status != null && !status.isBlank())
                    ? withdrawalRequestRepository.findByStatus(status, pageable)
                    : withdrawalRequestRepository.findAll(pageable);
            return ResponseEntity.ok(result);
        }

        // Admin duyệt rút tiền
        @PutMapping("/admin/withdrawals/{id}/approve")
        public ResponseEntity<Map<String, String>> approveWithdrawal(@PathVariable String id) {
            WithdrawalRequest req = withdrawalRequestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
            if (!"PENDING".equals(req.getStatus()))
                throw new RuntimeException("Yêu cầu này đã được xử lý rồi");

            // Gọi VNPay mock — blocking call (có delay 1-3s)
            VNPayMockService.DisburseResult result = vnPayMockService.disburse(
                    req.getStoreId(),
                    req.getAmount(),
                    req.getBankAccountNumber(),
                    req.getBankName()
            );

            if (result.success()) {
                req.setStatus("COMPLETED");
                req.setVnpayTransactionCode(result.transactionCode());
                req.setProcessedAt(LocalDateTime.now());
                req.setProcessedBy("admin");
                withdrawalRequestRepository.save(req);

                walletService.completeWithdrawal(id); // service lo ví + lịch sử

                return ResponseEntity.ok(Map.of(
                        "status", "SUCCESS",
                        "transactionCode", result.transactionCode()
                ));
            } else {
                req.setStatus("FAILED");
                req.setVnpayFailReason(result.failReason());
                req.setProcessedAt(LocalDateTime.now());
                req.setProcessedBy("admin");
                withdrawalRequestRepository.save(req);

                walletService.failWithdrawal(id, result.failReason()); // service lo ví + lịch sử

                return ResponseEntity.ok(Map.of(
                        "status", "FAILED",
                        "reason", result.failReason()
                ));
            }
        }

        // Admin từ chối rút tiền
        @PutMapping("/admin/withdrawals/{id}/reject")
        public ResponseEntity<Map<String, String>> rejectWithdrawal(
                @PathVariable String id,
                @RequestParam String reason) {
            WithdrawalRequest req = withdrawalRequestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
            if (!"PENDING".equals(req.getStatus()))
                throw new RuntimeException("Yêu cầu này đã được xử lý rồi");

            req.setStatus("REJECTED");
            req.setVnpayFailReason(reason);
            req.setProcessedAt(LocalDateTime.now());
            req.setProcessedBy("admin");
            withdrawalRequestRepository.save(req);

            walletService.rejectWithdrawal(id, reason);

            return ResponseEntity.ok(Map.of(
                    "status", "REJECTED",
                    "reason", reason
            ));
        }

        // Seller xem lịch sử rút tiền của mình
        @GetMapping("/me/withdrawals")
        public ResponseEntity<Page<WithdrawalRequest>> getMyWithdrawals(
                @RequestHeader("X-Store-Id") String storeId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "20") int size) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            return ResponseEntity.ok(withdrawalRequestRepository.findByStoreId(storeId, pageable));
        }

        // Order-service gọi khi approve complaint → hoàn tiền buyer
        @PostMapping("/user/{userId}/refund")
        public ResponseEntity<Void> refundToUser(
                @PathVariable String userId,
                @RequestParam Double amount,
                @RequestParam String referenceId) {
            walletService.refundToUser(userId, amount, referenceId);
            return ResponseEntity.ok().build();
        }

        // Order-service gọi khi approve complaint + lỗi shop → phạt tiền
        @PostMapping("/store/{storeId}/deduct")
        public ResponseEntity<Void> deductFromStore(
                @PathVariable String storeId,
                @RequestParam Double amount,
                @RequestParam String referenceId) {
            walletService.deductFromStore(storeId, amount, referenceId);
            return ResponseEntity.ok().build();
        }

        // Order-service gọi khi approve complaint để thu hồi tiền pending của đơn hàng bị hoàn tiền
        @PostMapping("/store/{storeId}/cancel-pending")
        public ResponseEntity<Void> cancelPending(
                @PathVariable String storeId,
                @RequestParam Double amount,
                @RequestParam String referenceId) {
            walletService.cancelPendingBalance(storeId, amount, referenceId);
            return ResponseEntity.ok().build();
        }

    }