package com.alukianov.server.order;

import com.alukianov.server.basket.Basket;
import com.alukianov.server.basket.BasketRepository;
import com.alukianov.server.basket.basketItem.BasketItemRepository;
import com.alukianov.server.exception.BasketEmptyException;
import com.alukianov.server.exception.OrderNotFoundException;
import com.alukianov.server.order.orderDetails.OrderDetails;
import com.alukianov.server.order.orderDetails.OrderDetailsRepository;
import com.alukianov.server.order.orderLine.OrderLine;
import com.alukianov.server.order.orderLine.OrderLineRepository;
import com.alukianov.server.product.inventory.Inventory;
import com.alukianov.server.product.inventory.InventoryRepository;
import com.alukianov.server.user.User;
import com.alukianov.server.user.UserRepository;
import com.alukianov.server.utils.EmailService;
import com.alukianov.server.utils.EmailServiceImpl;
import com.alukianov.server.utils.SimpleMessage;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

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
    private final EmailServiceImpl emailService;

    public Order save(OrdersRequest ordersRequest) {
        Optional<User> temp = userRepository.findById(ordersRequest.userId());

        if (temp.isEmpty()) {
            throw new EntityNotFoundException("User with id " + ordersRequest.userId() + " not found!");
        }

        User user = temp.get();
        Basket basket = basketRepository.findByOwner(user).get();

        if (basketItemRepository.findAllByBasket(basket).isEmpty()) {
            throw new BasketEmptyException("Basket is empty!");
        }

        OrderDetails orderDetails = OrderDetails.builder()
                .contactPerson(ordersRequest.person())
                .deliveryAddress(ordersRequest.address())
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

        Thread thread = new Thread(() -> {
            Context context = new Context();
            context.setVariable("orderId", order.getId());
            try {
                emailService.sendMimeMessage(SimpleMessage.builder()
                                .to(user.getEmail())
                                .subject("Покупка на shop-name!!")
                                .build(),
                        context
                );
            } catch (MessagingException exception) {
                exception.printStackTrace();
            }
        });
        thread.start();



        return order;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findAllOrdersByUser(User user) {
        return orderRepository.findAllByOwner(user);
    }

    public void updateOrderById(Long id, UpdateOrder model) {
        Optional<Order> temp = findById(id);

        if (temp.isEmpty()) {
            throw new OrderNotFoundException("Order with id " + id  + " not found!");
        }
        Order order = temp.get();

        order.setOrderStatus(OrderStatus.valueOf(model.status()));
        order.setUpdatedAt(LocalDateTime.now());
        order.getDetails().setMessage(model.message());
        order.getDetails().setDeliveryDate(model.deliveryDate());

        orderRepository.save(order);
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
