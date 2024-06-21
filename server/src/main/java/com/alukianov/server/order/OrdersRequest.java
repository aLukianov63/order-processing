package com.alukianov.server.order;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrdersRequest  {
        Long userId;
        String person;
        String address;
        String phoneNumber;
        String email;
        String payId;
}
