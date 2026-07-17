package org.example.orderservice.controller;

import org.example.orderservice.dto.VoucherDTO;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders/admin/vouchers")
@CrossOrigin(origins = "*") // Đảm bảo frontend gọi được
public class AdminVoucherController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getPlatformVouchers() {
        try {
            List<VoucherDTO> vouchers = orderService.getAllPlatformVouchers();
            return ResponseEntity.ok(ApiResponse.success(vouchers, "Lấy danh sách voucher sàn thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi lấy danh sách: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VoucherDTO>> createPlatformVoucher(@RequestBody VoucherDTO dto) {
        try {
            VoucherDTO created = orderService.createPlatformVoucher(dto);
            return ResponseEntity.ok(ApiResponse.success(created, "Thêm voucher sàn thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi thêm voucher: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherDTO>> updatePlatformVoucher(@PathVariable Integer id, @RequestBody VoucherDTO dto) {
        try {
            VoucherDTO updated = orderService.updatePlatformVoucher(id, dto);
            return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật voucher sàn thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi cập nhật voucher: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlatformVoucher(@PathVariable Integer id) {
        try {
            orderService.deletePlatformVoucher(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Xóa (ẩn) voucher sàn thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Lỗi xóa voucher: " + e.getMessage()));
        }
    }
}
