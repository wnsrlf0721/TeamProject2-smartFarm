package com.nova.backend.order.entity;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.payment.entity.PaymentEntity;
import com.nova.backend.payment.entity.PaymentMethod;
import com.nova.backend.payment.entity.PaymentStatus;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<OrderItemEntity> items = new ArrayList<>();

    @OneToOne(mappedBy = "order", fetch = FetchType.LAZY)
    private PaymentEntity payment;

    private String itemName;
    private String orderUid;

    private String deliveryAddress;
    private String phoneNumber;
    private String recipientName;
    private String message;
    private String trackingNumber;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal orderTotalPrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String refundReason;
    private String failReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime refundRequestedAt;
    private LocalDateTime paidAt;
    private LocalDateTime cancelledAt;
    private LocalDateTime refundedAt;

    private LocalDateTime estimatedDelivery;

    /* =========================
       엔티티 기본값
       ========================= */
    @PrePersist
    protected void prePersist() {
        if (status == null) status = OrderStatus.PENDING;
        if (paymentStatus == null) paymentStatus = PaymentStatus.READY;
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /* ===== 각 아이템 가격 계산 ===== */
    public BigDecimal calculatePrice(OrderItemEntity item) {
        // price와 quantity를 BigDecimal로 안전하게 계산
        return item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    /* ===== 주문 전체 가격 계산 ===== */
    public void calculateTotalPrice() {
        orderTotalPrice = items.stream()
                .map(this::calculatePrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(0, RoundingMode.HALF_UP); // 원 단위로 반올림
    }

    /* =========================
       아이템 관리
       ========================= */
    public void addItem(OrderItemEntity item) {
        if (item != null) {
            items.add(item);
            item.setOrder(this);
            calculateTotalPrice();
        }
    }

    public void addItemFromCart(CartItemEntity cartItem) {
        if (cartItem != null) {
            OrderItemEntity item = OrderItemEntity.create(this, cartItem);
            items.add(item);
            calculateTotalPrice();
        }
    }

    public List<OrderItemEntity> getItems() {
        return Collections.unmodifiableList(items);
    }

    // 직접 OrderItem 추가 시 양방향 연관 설정
    public void addOrderItem(OrderItemEntity orderItem) {
        if (orderItem != null && !items.contains(orderItem)) {
            items.add(orderItem);
            orderItem.setOrder(this);
            calculateTotalPrice();
        }
    }

    public OrderItemEntity[] getOrderItems() {
        return items.toArray(new OrderItemEntity[0]);
    }

    public void confirm() {
        if (status == OrderStatus.CANCELLED) {
            throw new IllegalStateException("취소된 주문은 확정할 수 없습니다.");
        }
        if (status == OrderStatus.PURCHASE_CONFIRMED) {
            return; // 이미 확정됨, 무시
        }
        // DELIVERED 상태에서도 확정 가능
        if (status != OrderStatus.PENDING && status != OrderStatus.DELIVERED) {
            throw new IllegalStateException("확정할 수 없는 주문 상태입니다: " + status);
        }
        this.status = OrderStatus.PURCHASE_CONFIRMED;
    }

    public void cancel() {
        if (status == OrderStatus.PURCHASE_CONFIRMED ) {
            throw new IllegalStateException("확정된 주문은 취소할 수 없습니다.");
        }
        if (status == OrderStatus.CANCELLED) {
            return; // 이미 취소됨
        }
        this.status = OrderStatus.CANCELLED;
    }


    /* =========================
       생성 팩토리
       ========================= */
    @Builder
    public OrderEntity(UsersEntity user, String deliveryAddress, String phoneNumber,String recipientName,String message, BigDecimal orderTotalPrice, String itemName, String orderUid) {
        this.user = user;
        this.deliveryAddress = deliveryAddress;
        this.phoneNumber = phoneNumber;
        this.recipientName=recipientName;
        this.message=message;
        this.status = OrderStatus.PENDING;
        this.paymentStatus = PaymentStatus.OK;
        this.orderTotalPrice = orderTotalPrice;
        this.itemName = itemName;
        this.orderUid = orderUid;
    }


}