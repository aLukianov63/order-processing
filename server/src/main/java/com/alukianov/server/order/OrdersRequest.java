package com.alukianov.server.order;

public record OrdersRequest(
        Long userId,
        String person,
        String address,
        String phoneNumber,
        String email
) {
}
