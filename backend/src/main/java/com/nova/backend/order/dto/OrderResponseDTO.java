package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
public class OrderResponseDTO {


    private String orderUid;

    private Long id;
    private List<OrderItemResponseDTO> items;

    private String itemName;

    private BigDecimal totalPrice;

    private String status;
    private String paymentStatus;
    private String paymentMethod;

    private String trackingNumber;

    private String deliveryAddress;
    private String recipientName;
    private String phoneNumber;
    private String message;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime estimatedDelivery;

    private String refundReason;
    private LocalDateTime refundRequestedAt;

    public static OrderResponseDTO from(OrderEntity entity) {
        return OrderResponseDTO.builder()
                .id(entity.getOrderId())
                .orderUid(entity.getOrderUid())
                .itemName(entity.getItemName())
                .items(
                        entity.getItems().stream()
                                .map(OrderItemResponseDTO::from)
                                .toList()
                )
                .totalPrice(entity.getOrderTotalPrice())
                .status(entity.getStatus().getValue())
                .paymentStatus(entity.getPaymentStatus().getValue())
                .paymentMethod(
                        entity.getPaymentMethod() != null
                                ? entity.getPaymentMethod().getValue()
                                : null
                )
                .trackingNumber(entity.getTrackingNumber())
                .deliveryAddress(entity.getDeliveryAddress())
                .recipientName(entity.getRecipientName())
                .phoneNumber(entity.getPhoneNumber())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static OrderResponseDTO from(OrderEntity entity, String message) {
        return OrderResponseDTO.builder()
                .orderUid(entity.getOrderUid())
                .itemName(entity.getItemName())
                .id(entity.getOrderId())
                .items(
                        entity.getItems().stream()
                                .map(OrderItemResponseDTO::from)
                                .toList()
                )
                .totalPrice(entity.getOrderTotalPrice())
                .status(entity.getStatus().getValue())
                .paymentStatus(entity.getPaymentStatus().getValue())
                .paymentMethod(
                        entity.getPaymentMethod() != null
                                ? entity.getPaymentMethod().getValue()
                                : null
                )
                .trackingNumber(entity.getTrackingNumber())
                .deliveryAddress(entity.getDeliveryAddress())
                .recipientName(entity.getRecipientName())
                .phoneNumber(entity.getPhoneNumber())
                .message(message)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }


}
