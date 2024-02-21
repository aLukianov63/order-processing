package com.alukianov.server.basket.basketItem;

import lombok.Builder;

@Builder
public record BasketItemRequest(
        Long productId,

        Long basketId,
        Integer quantity
) {
}
