package com.nova.backend.order.service;

import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.entity.OrderStatus;
import com.nova.backend.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderManagementServiceImpl implements OrderManagementService{

    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderResponseDTO::from)
                .toList();
    }





    @Override
    public void updateTrackingNumber(String orderUid, String trackingNumber) {
        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));

        order.setTrackingNumber(trackingNumber);
    }

    @Override
    public void updateOrderStatus(String orderUid, OrderStatus status) {

        OrderEntity order = orderRepository.findByOrderUid(orderUid)
                .orElseThrow(() -> new IllegalArgumentException("주문 없음"));

        order.setStatus(status);
    }

    @Override
    public void approveRefund(String orderUid) {
        //오더 스테이터스를 주문취소로 변경하고 또 뭐지
        //실제 무누내역은 남기고 취소만

    }
}
