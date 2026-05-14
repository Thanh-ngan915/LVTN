package org.example.orderservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.orderservice.config.VNPayConfig;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    public String createOrder(long amount, String orderInfo, String baseUrl, String orderId,
            HttpServletRequest request) {
        return buildPaymentUrl(amount, orderInfo, baseUrl, null, orderId, request);
    }

    public String createOrderWithWallet(long amount, String orderInfo, String baseUrl, String orderId,
            HttpServletRequest request) {
        return buildPaymentUrl(amount, orderInfo, baseUrl, "VNPAYQR", orderId, request);
    }

    /**
     * Build URL thanh toán - Theo đúng code demo chính thức VNPay Java
     */
    private String buildPaymentUrl(long amount, String orderInfo, String baseUrl, String bankCode, String orderId,
            HttpServletRequest request) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = orderId + VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
        String orderType = "other";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        String returnUrl = VNPayConfig.vnp_ReturnUrl;
        if (!returnUrl.startsWith("http")) {
            returnUrl = baseUrl + returnUrl;
        }
        vnp_Params.put("vnp_ReturnUrl", returnUrl);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // === Phần quan trọng: Build hash data và query string ===
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                if (query.length() > 0) {
                    query.append('&');
                    hashData.append('&');
                }
                // Build hash data: fieldName RAW + "=" + URLEncode(fieldValue)
                // Giữ nguyên dấu + theo đúng hành vi mặc định của URLEncoder và gợi ý fix
                String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(encodedValue);

                // Build query: URLEncode(fieldName) + "=" + URLEncode(fieldValue)
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                query.append('=');
                query.append(encodedValue);
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());

        System.out.println("=== VNPAY DEBUG ===");
        System.out.println("HashData: " + hashData.toString());
        System.out.println("SecureHash: " + vnp_SecureHash);
        System.out.println("===================");

        return VNPayConfig.vnp_PayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    /**
     * Xác thực callback từ VNPay
     * 
     * @return 1 = thành công, 0 = thất bại/hủy, -1 = sai chữ ký
     */
    public int orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty() && fieldName.startsWith("vnp_")) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        String signValue = VNPayConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            return "00".equals(request.getParameter("vnp_TransactionStatus")) ? 1 : 0;
        }
        return -1;
    }

}
