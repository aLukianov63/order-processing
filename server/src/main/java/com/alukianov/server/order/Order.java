package com.alukianov.server.order;

import com.alukianov.server.order.orderDetails.OrderDetails;
import com.alukianov.server.order.orderLine.OrderLine;
import com.alukianov.server.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@Table(name = "_orders")
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    private String payId;

    private Boolean isProcessed;

    @OneToOne
    @JoinColumn(name = "details_id")
    private OrderDetails details;

    @OneToMany
    @JoinColumn(name = "lines_id")
    private List<OrderLine> lines;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private Double totalPrice;

    @Column(name = "created_at")
    private LocalDateTime createAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}