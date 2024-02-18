package com.alukianov.server.product;

import lombok.Builder;

@Builder
public record ProductDTO(
        Long id,
        String title,
        String description,
        String image,
        Double price,
        Long categoryId,
        String categoryName,
        Long inventoryId,
        Integer quantity
) {
}
