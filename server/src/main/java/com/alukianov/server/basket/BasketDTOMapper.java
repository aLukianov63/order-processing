package com.alukianov.server.basket;

import com.alukianov.server.basket.basketItem.BasketItemRepository;
import com.alukianov.server.basket.basketItem.BasketItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class BasketDTOMapper implements Function<Basket, BasketDTO> {

    private final BasketItemRepository basketItemRepository;
    /**
     * Applies this function to the given argument.
     *
     * @param basket the function argument
     * @return the function result
     */
    @Override
    public BasketDTO apply(Basket basket) {
        return  BasketDTO.builder()
                .id(basket.getId())
                .ownerId(basket.getOwner().getId())
                .basketItems(basketItemRepository.findAllByBasket(basket).stream().map(
                        basketItem -> BasketItemResponse.builder()
                                .id(basketItem.getId())
                                .product(basketItem.getProduct())
                                .quantity(basketItem.getQuantity())
                                .createdAt(basketItem.getCreateAt())
                                .build()
                ).toList())
                .createdAt(basket.getCreateAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .updatedAt(basket.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();
    }
}
