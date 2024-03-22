package com.alukianov.server.order;

import lombok.Builder;

@Builder
public record UpdateOrder(
        String message,
        String status,
        String deliveryDate
) {
}
