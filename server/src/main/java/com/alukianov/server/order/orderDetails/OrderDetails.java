package com.alukianov.server.order.orderDetails;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@Table(name = "_order_details")
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contactPerson;

    private String deliveryAddress;

    private String mobilePhone;

    private String deliveryProviderUrl;

    private String message;

    private String deliveryDate;

}
