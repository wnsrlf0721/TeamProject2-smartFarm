package com.nova.backend.order.service;

import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.entity.OrderStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

public interface OrderManagementService {
    void updateTrackingNumber(String orderUid, String trackingNumber);

    void updateOrderStatus(String orderUid, OrderStatus status);

    List<OrderResponseDTO> getAllOrders();

    void approveRefund(String orderUid);
}
