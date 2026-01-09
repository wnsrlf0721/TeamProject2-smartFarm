package com.nova.backend.order.dto;

import com.nova.backend.order.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusRequest {
    private OrderStatus status;
}
