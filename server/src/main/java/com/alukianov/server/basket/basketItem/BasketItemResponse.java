package com.alukianov.server.basket.basketItem;

import com.alukianov.server.product.Product;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record BasketItemResponse(
        Long id,
        Product product,
        Integer quantity,
        Double totalPrice,
        LocalDateTime createdAt
) {
}
