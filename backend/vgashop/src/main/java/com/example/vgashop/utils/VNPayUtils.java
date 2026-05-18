package com.example.vgashop.utils;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.example.vgashop.entity.Order;

public class VNPayUtils {

    public static String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) sb.append('0');
                sb.append(hex);
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC-SHA512", e);
        }
    }

    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl,
                                          String clientIp, String tmnCode, String hashSecret, String vnpayUrl) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version",   "2.1.0");
        params.put("vnp_Command",   "pay");
        params.put("vnp_TmnCode",   tmnCode);
        params.put("vnp_Amount",    order.getTotalAmount().multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        params.put("vnp_CurrCode",  "VND");
        params.put("vnp_TxnRef",    transactionCode);
        params.put("vnp_OrderInfo", "Payment for order " + order.getOrderCode());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale",    "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr",    (clientIp != null && !clientIp.isBlank()) ? clientIp : "127.0.0.1");

        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query    = new StringBuilder();

        for (int i = 0; i < keys.size(); i++) {
            String k = keys.get(i);
            String v = params.get(k);
            if (v != null && !v.isEmpty()) {
                hashData.append(k).append('=').append(v);
                query.append(URLEncoder.encode(k, StandardCharsets.UTF_8))
                     .append('=')
                     .append(URLEncoder.encode(v, StandardCharsets.UTF_8));
                if (i < keys.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        query.append("&vnp_SecureHash=").append(hmacSHA512(hashSecret, hashData.toString()));
        return vnpayUrl + "?" + query;
    }

    public static boolean verifySignature(Map<String, String> params, String hashSecret) {
        try {
            String receivedHash = params.get("vnp_SecureHash");
            if (receivedHash == null || receivedHash.isEmpty()) return false;

            Map<String, String> filtered = new HashMap<>(params);
            filtered.remove("vnp_SecureHash");
            filtered.remove("vnp_SecureHashType");

            List<String> keys = new ArrayList<>(filtered.keySet());
            Collections.sort(keys);

            StringBuilder hashData = new StringBuilder();
            for (int i = 0; i < keys.size(); i++) {
                String k = keys.get(i);
                String v = filtered.get(k);
                if (v != null && !v.isEmpty()) {
                    hashData.append(k).append('=').append(v);
                    if (i < keys.size() - 1) hashData.append('&');
                }
            }

            return hmacSHA512(hashSecret, hashData.toString()).equalsIgnoreCase(receivedHash);
        } catch (Exception e) {
            return false;
        }
    }
}
