package com.alukianov.server.order;

import com.alukianov.server.utils.ServerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    private ResponseEntity<ServerResponse> saveOrder(@RequestBody OrdersRequest ordersRequest) {
        try {
            orderService.save(ordersRequest);
        } catch (RuntimeException exception) {
            return new ResponseEntity<>(ServerResponse.builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .message(exception.getMessage())
                    .build(),
                    HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("Order added!")
                .build());
    }

    @GetMapping
    private ResponseEntity<ServerResponse> findAllOrders() {
        return ResponseEntity.ok(ServerResponse.builder()
                .status(HttpStatus.OK.value())
                .message("All orders list")
                .payload(orderService.findAll())
                .build());

    }



}
