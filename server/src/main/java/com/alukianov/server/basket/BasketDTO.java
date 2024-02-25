package com.alukianov.server.basket;

import com.alukianov.server.basket.basketItem.BasketItem;
import com.alukianov.server.basket.basketItem.BasketItemResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record BasketDTO(
        Long id,
        Long ownerId,
        List<BasketItemResponse> basketItems,
        Double totalPrice,
        String createdAt,
        String updatedAt
) {
}
