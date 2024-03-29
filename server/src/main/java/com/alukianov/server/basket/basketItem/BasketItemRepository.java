package com.alukianov.server.basket.basketItem;

import com.alukianov.server.basket.Basket;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@ResponseBody
public interface BasketItemRepository extends JpaRepository<BasketItem, Long> {
    List<BasketItem> findAllByBasket(Basket basket);

    @Transactional
    List<BasketItem> removeByBasket(Basket basket);
}
