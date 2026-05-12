package org.example.orderservice.service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.orderservice.config.VNPayConfig;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    /**
     * Tạo URL thanh toán VNPay thông thường (ATM/QR chung)
     */
    public String createOrder(long amount, String orderInfo, String baseUrl, String orderId, HttpServletRequest request) {
        return buildPaymentUrl(amount, orderInfo, baseUrl, null, orderId, request);
    }

    /**
     * Tạo URL thanh toán bằng ví VNPay (vnp_BankCode = VNPAYQR)
     */
    public String createOrderWithWallet(long amount, String orderInfo, String baseUrl, String orderId, HttpServletRequest request) {
        return buildPaymentUrl(amount, orderInfo, baseUrl, "VNPAYQR", orderId, request);
    }

    /**
     * Build URL thanh toán VNPay với bankCode tuỳ chọn
     */
    private String buildPaymentUrl(long amount, String orderInfo, String baseUrl, String bankCode, String orderId, HttpServletRequest request) {
        String vnp_Version  = "2.1.0";
        String vnp_Command  = "pay";
        String vnp_TxnRef   = orderId + "_" + VNPayConfig.getRandomNumber(6); // Thêm suffix ngẫu nhiên để tránh trùng nếu thanh toán lại
        String vnp_IpAddr   = VNPayConfig.getIpAddress(request);
        String vnp_TmnCode  = VNPayConfig.vnp_TmnCode;
        String orderType    = "other";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version",   vnp_Version);
        vnp_Params.put("vnp_Command",   vnp_Command);
        vnp_Params.put("vnp_TmnCode",   vnp_TmnCode);
        vnp_Params.put("vnp_Amount",    String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode",  "VND");
        vnp_Params.put("vnp_TxnRef",    vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", orderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale",    "vn");
        vnp_Params.put("vnp_IpAddr",    vnp_IpAddr);

        // Nếu bankCode được chỉ định (VD: VNPAYQR cho ví VNPay)
        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }

        String returnUrl = VNPayConfig.vnp_ReturnUrl;
        if (!returnUrl.startsWith("http")) {
            returnUrl = baseUrl + returnUrl;
        }
        vnp_Params.put("vnp_ReturnUrl", returnUrl);

        // Thời gian tạo & hết hạn
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Sort & Build hash + query
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query    = new StringBuilder();
        Iterator<String> itr   = fieldNames.iterator();

        while (itr.hasNext()) {
            String fieldName  = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                try {
                    // Build hash data (GIÁ TRỊ RAW)
                    hashData.append(fieldName).append('=').append(fieldValue);
                    
                    // Build query string (GIÁ TRỊ ĐÃ ENCODE)
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                         .append('=')
                         .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        String queryUrl = query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;
        return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
    }

    /**
     * Xác thực callback từ VNPay và trả về kết quả
     * @return 1 = thành công, 0 = thất bại/hủy, -1 = sai chữ ký
     */
    public int orderReturn(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
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
