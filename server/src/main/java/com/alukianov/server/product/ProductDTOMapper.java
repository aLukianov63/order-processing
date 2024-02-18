package com.alukianov.server.product;

import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class ProductDTOMapper implements Function<Product, ProductDTO> {
    /**
     * Applies this function to the given argument.
     *
     * @param product the function argument
     * @return the function result
     */
    @Override
    public ProductDTO apply(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .image(product.getImageUrl())
                .price(product.getPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .inventoryId(product.getInventory().getId())
                .quantity(product.getInventory().getQuantity())
                .build();
    }
}
