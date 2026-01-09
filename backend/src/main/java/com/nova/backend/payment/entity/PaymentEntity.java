package com.nova.backend.payment.entity;

import com.nova.backend.order.entity.OrderEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Table(name = "payments")
@Entity
@Getter
@NoArgsConstructor
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String paymentUid; // 결제 고유 번호

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Builder
    public PaymentEntity(BigDecimal price, PaymentStatus status, OrderEntity order) {
        this.price = price;
        this.status = status;
        this.order = order;
    }

    public void changePaymentBySuccess(PaymentStatus status, String paymentUid) {
        this.status = status;
        this.paymentUid = paymentUid;
    }
}


