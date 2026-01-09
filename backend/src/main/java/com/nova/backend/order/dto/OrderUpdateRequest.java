package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderStatus;
import lombok.Getter;

@Getter
public class OrderUpdateRequest {
    private OrderStatus status;
    private String trackingNumber;
}
