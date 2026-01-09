package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderItemEntity;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class OrderItemResponseDTO {

    private Long id;          // productId → 프론트 id
    private String name;
    private BigDecimal price;
    private int quantity;
    private String image;
    private String category;
    private String description;

    public static OrderItemResponseDTO from(OrderItemEntity entity) {
        return OrderItemResponseDTO.builder()
                .id(entity.getProductId())
                .name(entity.getName())
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .image(entity.getImageUrl())
                .category(entity.getCategory() != null ? entity.getCategory().name() : null)
                .description(entity.getDescription())
                //.specs(entity.getSpecs()) // 필요하면 추가
                .build();
    }

}

