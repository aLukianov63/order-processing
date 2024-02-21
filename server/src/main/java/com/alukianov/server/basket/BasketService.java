package com.alukianov.server.basket;

import com.alukianov.server.basket.basketItem.BasketItem;
import com.alukianov.server.basket.basketItem.BasketItemRepository;
import com.alukianov.server.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BasketService {
    private final BasketRepository basketRepository;
    private final BasketItemRepository basketItemRepository;
    private final BasketDTOMapper basketDTOMapper;

    public BasketDTO findBasketByUser(User user) {
        return basketDTOMapper.apply(basketRepository.findByOwner(user).get());
    }

    public void clear(Basket basket) {
        List<BasketItem> basketItems = basketItemRepository.findAllByBasket(basket);

        for (BasketItem item : basketItems) {
            basketItemRepository.deleteById(item.getId());
        }
    }

}
