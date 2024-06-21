package com.alukianov.server.payment;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentCallbackController {

    @PostMapping("/api/v1/payment/confirm")
    public void handlePaymentCallback(@RequestBody String payload) {
        System.out.println("Received payment callback: " + payload);
    }
}
