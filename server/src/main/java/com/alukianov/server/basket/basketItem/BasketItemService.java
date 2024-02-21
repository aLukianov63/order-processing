package com.alukianov.server.basket.basketItem;

import com.alukianov.server.basket.BasketRepository;
import com.alukianov.server.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BasketItemService {

    private final BasketItemRepository basketItemRepository;
    private final BasketRepository basketRepository;
    private final ProductRepository productRepository;

    public BasketItem save(BasketItemRequest basketItemRequest) {

        if (basketRepository.findById(basketItemRequest.basketId()).isEmpty() ||
                productRepository.findById(basketItemRequest.productId()).isEmpty()) {
            throw new RuntimeException("Not found");
        }

        BasketItem basketItem = BasketItem.builder()
                .product(productRepository.findById(basketItemRequest.productId()).get())
                .basket(basketRepository.findById(basketItemRequest.basketId()).get())
                .quantity(basketItemRequest.quantity())
                .createAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return basketItemRepository.save(basketItem);
    }

    public void deleteById(Long id) {
        basketItemRepository.deleteById(id);
    }
}
