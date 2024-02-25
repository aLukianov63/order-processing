package com.alukianov.server.basket;

import com.alukianov.server.basket.basketItem.BasketItem;
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
                                .totalPrice(calculateBasketItemTotalPrice(basketItem))
                                .createdAt(basketItem.getCreateAt())
                                .build()
                ).toList())
                .totalPrice(calculateBasketTotalPrice(basket))
                .createdAt(basket.getCreateAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .updatedAt(basket.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .build();
    }

    private Double calculateBasketItemTotalPrice(BasketItem basketItem) {
        return basketItem.getProduct().getPrice() * basketItem.getQuantity();
    }

    private Double calculateBasketTotalPrice(Basket basket) {
        double totalPrice = 0.0;
        for (BasketItem basketItem : basketItemRepository.findAllByBasket(basket)) {
            totalPrice += calculateBasketItemTotalPrice(basketItem);
        }
        return totalPrice;
    }


}
