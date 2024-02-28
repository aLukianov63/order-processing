package com.alukianov.server.order;

import com.alukianov.server.basket.Basket;
import com.alukianov.server.basket.BasketRepository;
import com.alukianov.server.basket.basketItem.BasketItemRepository;
import com.alukianov.server.order.orderDetails.OrderDetails;
import com.alukianov.server.order.orderDetails.OrderDetailsRepository;
import com.alukianov.server.order.orderLine.OrderLine;
import com.alukianov.server.order.orderLine.OrderLineRepository;
import com.alukianov.server.product.inventory.Inventory;
import com.alukianov.server.product.inventory.InventoryRepository;
import com.alukianov.server.user.User;
import com.alukianov.server.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BasketRepository basketRepository;
    private final BasketItemRepository basketItemRepository;
    private final OrderLineRepository orderLineRepository;
    private final OrderDetailsRepository orderDetailsRepository;
    private final InventoryRepository inventoryRepository;

    public Order save(OrdersRequest ordersRequest) {
        Optional<User> temp = userRepository.findById(ordersRequest.userId());

        if (temp.isEmpty()) {
            throw new RuntimeException("User with id " + ordersRequest.userId() + " not found");
        }

        User user = temp.get();
        Basket basket = basketRepository.findByOwner(user).get();

        if (basketItemRepository.findAllByBasket(basket).isEmpty()) {
            throw new RuntimeException("User basket us empty");
        }

        OrderDetails orderDetails = OrderDetails.builder()
                .contactPerson(ordersRequest.person())
                .deliveryAddress(ordersRequest.address())
                .email(ordersRequest.email())
                .mobilePhone(ordersRequest.phoneNumber())
                .build();
        List<OrderLine> lines = basketItemRepository.findAllByBasket(basket).stream().map(item ->
                orderLineRepository.save(OrderLine.builder()
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .updatedAt(LocalDateTime.now())
                        .createAt(LocalDateTime.now())
                        .build())).toList();

        orderDetailsRepository.save(orderDetails);

        Order order = orderRepository.save(Order.builder()
                .owner(user)
                .details(orderDetails)
                .lines(lines)
                .createAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .orderStatus(OrderStatus.IN_PROCESSING)
                .build());

        basketItemRepository.removeByBasket(basket);
        updateInventory(lines);

        return order;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    private void updateInventory(List<OrderLine> lines) {
        for (OrderLine line : lines) {
            Inventory temp = line.getProduct().getInventory();
            Inventory update = Inventory.builder()
                    .id(temp.getId())
                    .createdAt(temp.getCreatedAt())
                    .updatedAt(LocalDateTime.now())
                    .quantity(temp.getQuantity() - line.getQuantity())
                    .build();
            inventoryRepository.save(update);
        }
    }

}
