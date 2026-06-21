package org.example.orderservice.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.orderservice.dto.AdminSettlementRowDTO;
import org.example.orderservice.dto.AdminSettlementStatsDTO;
import org.example.orderservice.dto.ApiResponse;
import org.example.orderservice.service.SettlementAdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/settlements")
@RequiredArgsConstructor
public class AdminSettlementController {

    private final SettlementAdminService settlementAdminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminSettlementStatsDTO>> getStats(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) {
        AdminSettlementStatsDTO stats = settlementAdminService.getStats(parseFrom(from), parseTo(to));
        return ResponseEntity.ok(ApiResponse.success(stats, "Lấy thống kê thành công"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminSettlementRowDTO>>> getSettlements(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AdminSettlementRowDTO> result = settlementAdminService
                .getSettlements(parseFrom(from), parseTo(to), pageable);

        return ResponseEntity.ok(ApiResponse.<List<AdminSettlementRowDTO>>builder()
                .success(true)
                .data(result.getContent())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to
    ) throws IOException {
        List<AdminSettlementRowDTO> rows = settlementAdminService
                .getAllSettlements(parseFrom(from), parseTo(to));

        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("Doanh thu");

            CellStyle headerStyle = wb.createCellStyle();
            Font headerFont = wb.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] cols = {"Mã đơn hàng", "Ngày hoàn thành", "Tổng giá trị đơn (VNĐ)", "Phí sàn (%)", "Tiền phí thu về (VNĐ)"};
            Row header = sheet.createRow(0);
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            int rIdx = 1;
            for (AdminSettlementRowDTO r : rows) {
                Row row = sheet.createRow(rIdx++);
                row.createCell(0).setCellValue("#" + r.getOrderId());
                row.createCell(1).setCellValue(r.getCompletedAt());
                row.createCell(2).setCellValue(r.getGrossAmount());
                row.createCell(3).setCellValue(r.getCommissionRate());
                row.createCell(4).setCellValue(r.getCommissionFee());
            }
            for (int i = 0; i < cols.length; i++) sheet.autoSizeColumn(i);

            wb.write(out);
            byte[] bytes = out.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "doanh-thu-san.xlsx");

            return ResponseEntity.ok().headers(headers).body(bytes);
        }
    }

    private LocalDateTime parseFrom(String from) {
        if (from == null || from.isBlank()) return LocalDateTime.now().minusMonths(1).toLocalDate().atStartOfDay();
        return LocalDate.parse(from).atStartOfDay();
    }

    private LocalDateTime parseTo(String to) {
        if (to == null || to.isBlank()) return LocalDateTime.now();
        return LocalDate.parse(to).atTime(23, 59, 59);
    }
}