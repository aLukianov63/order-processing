package com.alukianov.server;

import com.alukianov.server.order.OrderController;
import com.alukianov.server.order.OrderService;
import com.alukianov.server.payment.YooKassaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertTrue;

class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @Mock
    private YooKassaService yooKassaService;

    @InjectMocks
    private OrderController orderController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveOrder() {
        assertTrue(true);
    }

    @Test
    void testFindAllOrders() {
        assertTrue(true);
    }

    @Test
    void testFindOrderById() {
        assertTrue(true);
    }

    @Test
    void testUpdateOrderById() {
        assertTrue(true);
    }

    @Test
    void testUpdateOrderByIdCancel() {
        assertTrue(true);
    }

    @Test
    void testProcessOrderById() {
        assertTrue(true);
    }
}
