package com.example.vgashop.utils;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.example.vgashop.entity.Order;

public class MomoUtils {

    public static String hmacSHA256(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) sb.append('0');
                sb.append(hex);
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC-SHA256", e);
        }
    }

    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl,
                                          String partnerCode, String accessKey, String secretKey, String ipnUrl) {
        String amount    = order.getTotalAmount().toBigInteger().toString();
        String orderInfo = "Payment for order " + order.getOrderCode();
        String extraData = "";

        String rawSignature = "accessKey="    + accessKey
                + "&amount="      + amount
                + "&extraData="   + extraData
                + "&ipnUrl="      + ipnUrl
                + "&orderId="     + transactionCode
                + "&orderInfo="   + orderInfo
                + "&partnerCode=" + partnerCode
                + "&redirectUrl=" + returnUrl
                + "&requestId="   + transactionCode
                + "&requestType=captureWallet";

        String signature = hmacSHA256(secretKey, rawSignature);

        return "https://test-payment.momo.vn/v2/gateway/api/create?"
                + "partnerCode=" + partnerCode
                + "&orderId="    + transactionCode
                + "&amount="     + amount
                + "&signature="  + signature;
    }

    public static boolean verifySignature(Map<String, Object> params, String secretKey) {
        try {
            String receivedSignature = String.valueOf(params.get("signature"));
            if (receivedSignature == null || receivedSignature.isEmpty() || "null".equals(receivedSignature)) {
                return false;
            }

            String rawSignature = "accessKey="    + params.get("accessKey")
                    + "&amount="       + params.get("amount")
                    + "&extraData="    + params.get("extraData")
                    + "&message="      + params.get("message")
                    + "&orderId="      + params.get("orderId")
                    + "&orderInfo="    + params.get("orderInfo")
                    + "&orderType="    + params.get("orderType")
                    + "&partnerCode="  + params.get("partnerCode")
                    + "&payType="      + params.get("payType")
                    + "&requestId="    + params.get("requestId")
                    + "&responseTime=" + params.get("responseTime")
                    + "&resultCode="   + params.get("resultCode")
                    + "&transId="      + params.get("transId");

            return hmacSHA256(secretKey, rawSignature).equals(receivedSignature);
        } catch (Exception e) {
            return false;
        }
    }
}
