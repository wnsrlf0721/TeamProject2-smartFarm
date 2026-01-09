package com.nova.backend.order.entity;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductCategory;
import com.nova.backend.market.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private OrderEntity order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = true)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @Column(nullable = true)
    private String description;

    @Column(columnDefinition = "json")
    private String specs;

    /* ===== 연관관계 보호 ===== */
    protected void setOrder(OrderEntity order) {
        this.order = order;
    }


    /* ===== 가격 계산 ===== */
    public BigDecimal calculatePrice() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    /* ===== CartItem → OrderItem 변환 ===== */
    public static OrderItemEntity fromCartItem(CartItemEntity cartItem) {
        ProductEntity product = cartItem.getProduct();
        return OrderItemEntity.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .description(product.getDescription())
                .specs(product.getSpecs())
                .build();
    }

    public static OrderItemEntity create(OrderEntity order, CartItemEntity cartItem) {
        if (cartItem.getQuantity() <= 0) {
            throw new IllegalStateException("주문 수량 오류");
        }

        ProductEntity product = cartItem.getProduct();

        return OrderItemEntity.builder()
                .order(order)  // 연관관계
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .imageUrl(product.getImageUrl())
                .category(product.getCategory())
                .description(product.getDescription())
                .specs(product.getSpecs())  // JSON 스펙 복사
                .build();
    }


    // 총 주문 금액 (calculatePrice() 재사용)
    public BigDecimal getTotalPrice() {
        return calculatePrice();
    }
}

