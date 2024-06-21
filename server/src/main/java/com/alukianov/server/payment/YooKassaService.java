package com.alukianov.server.payment;

import com.alukianov.server.order.OrderService;
import com.alukianov.server.order.OrdersRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Service
public class YooKassaService {

    private final RestTemplate restTemplate;
    private final String shopId;
    private final String secretKey;
    private final OrderService orderService;

    public YooKassaService(RestTemplate restTemplate,
                           @Value("${yookassa.shopId}") String shopId,
                           @Value("${yookassa.secretKey}") String secretKey,
                           OrderService service) {
        this.restTemplate = restTemplate;
        this.shopId = shopId;
        this.secretKey = secretKey;
        orderService = service;
    }

    public Map<String, Object> createPayment(BigDecimal amount, String currency, String description, OrdersRequest order) {
        String url = "https://api.yookassa.ru/v3/payments";
        String auth = shopId + ":" + secretKey;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        headers.set("Idempotence-Key", java.util.UUID.randomUUID().toString());
        headers.set("Content-Type", "application/json");

        Map<String, Object> paymentData = new HashMap<>();
        Map<String, String> amountData = new HashMap<>();
        amountData.put("value", amount.toString());
        amountData.put("currency", currency);
        paymentData.put("amount", amountData);
        paymentData.put("description", description);

        Map<String, String> confirmationData = new HashMap<>();
        confirmationData.put("type", "redirect");
        confirmationData.put("return_url", "http://localhost:5173/users/me");
        paymentData.put("confirmation", confirmationData);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(paymentData, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        String paymentId = (String) response.getBody().get("id");
        order.setPayId(paymentId);

        // Запустить проверку статуса платежа в отдельном потоке
        CompletableFuture.runAsync(() -> checkPaymentStatus(paymentId, order));

        return response.getBody();

    }

    @Async
    public void checkPaymentStatus(String paymentId, OrdersRequest ordersRequest) {
        try {
            while (true) {
                TimeUnit.SECONDS.sleep(30);

                String url = "https://api.yookassa.ru/v3/payments/" + paymentId;
                HttpHeaders headers = createAuthHeaders();
                HttpEntity<String> request = new HttpEntity<>(headers);
                ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);
                String status = (String) response.getBody().get("status");
                if ("waiting_for_capture".equals(status)) {
                    confirmPayment(paymentId);
                } else if ("succeeded".equals(status)) {
                    orderService.save(ordersRequest);
                    break;
                } else if ("canceled".equals(status)) {
                    break;
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void confirmPayment(String paymentId) {
        try {
            String url = "https://api.yookassa.ru/v3/payments/" + paymentId + "/capture";
            HttpHeaders headers = createAuthHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("Idempotence-Key", UUID.randomUUID().toString());

            Map<String, Object> captureData = new HashMap<>();
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(captureData, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            if ("succeeded".equals(response.getBody().get("status"))) {
                System.out.println("Payment with ID " + paymentId + " has been confirmed and captured.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public Map<String, Object> refundPayment(String paymentId, BigDecimal amount, String currency) {
        try {
            String url = "https://api.yookassa.ru/v3/refunds";
            HttpHeaders headers = createAuthHeaders();
            headers.set("Content-Type", "application/json");
            headers.set("Idempotence-Key", UUID.randomUUID().toString());

            Map<String, Object> refundData = new HashMap<>();
            refundData.put("payment_id", paymentId);

            Map<String, String> amountData = new HashMap<>();
            amountData.put("value", amount.toString());
            amountData.put("currency", currency);
            refundData.put("amount", amountData);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(refundData, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private HttpHeaders createAuthHeaders() {
        String auth = shopId + ":" + secretKey;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encodedAuth);
        return headers;
    }

}

