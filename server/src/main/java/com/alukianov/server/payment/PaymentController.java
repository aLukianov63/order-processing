package com.alukianov.server.payment;

import com.alukianov.server.order.OrdersRequest;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    @Autowired
    private YooKassaService yooKassaService;

    @PostMapping("/create")
    public Map<String, Object> createPayment(@RequestBody PaymentRequest request) {
        return yooKassaService.createPayment(request.getAmount(), request.getCurrency(),
                request.getDescription(), OrdersRequest.builder().userId(request.getUserId()).build());
    }


    @Data
    static public class PaymentRequest {
        private Long userId;
        private BigDecimal amount;
        private String currency;
        private String description;
    }
}



