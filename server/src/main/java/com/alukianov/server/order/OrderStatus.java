package com.alukianov.server.order;

public enum OrderStatus {
    CANCELED, // заказ отменён
    CREATED, // заказ создан
    PROCESSED, // заказ обработан
    COLLECTED, // заказ собран
    SENT, // заказ отправлен
    RECEIVED // заказ получен
}
