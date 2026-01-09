package com.nova.backend.order.controller;

import com.nova.backend.order.dto.*;
import com.nova.backend.order.entity.OrderEntity;
import com.nova.backend.order.service.OrderService;
import com.nova.backend.payment.service.PaymentService;
import com.nova.backend.security.CustomUserDetails;
import com.nova.backend.user.entity.UsersEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    /**
     * =========================================================
     * 주문 생성
     * =========================================================
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid OrderRequestDTO request
    ) {
        UsersEntity user = userDetails.getUser();
        OrderEntity order = orderService.createOrder(user, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(OrderResponseDTO.from(order, "주문 성공"));
    }

    /**
     * =========================================================
     * 내 주문 목록 조회
     * =========================================================
     */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        UsersEntity user = userDetails.getUser();
        return ResponseEntity.ok(orderService.getOrders(user));
    }

    /**
     * =========================================================
     * 주문 단건 조회
     * =========================================================
     */
    @GetMapping("/{orderUid}")
    public ResponseEntity<OrderResponseDTO> findOrder(
            @PathVariable String orderUid
    ) {
        OrderResponseDTO dto = orderService.findOrder(orderUid);
        return dto == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(dto);
    }

    /**
     * =========================================================
     * 주문 확정 (사용자)
     * =========================================================
     */
    @PostMapping("/{orderUid}/confirm")
    public ResponseEntity<Void> confirmOrder(
            @PathVariable String orderUid,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        UsersEntity user = userDetails.getUser();
        orderService.confirmOrder(user, orderUid);
        return ResponseEntity.ok().build();
    }

    /**
     * =========================================================
     * 주문 취소 (사용자)
     * =========================================================
     */
    @PostMapping("/{orderUid}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable String orderUid,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        UsersEntity user = userDetails.getUser();
        orderService.cancelOrder(user, orderUid);
        return ResponseEntity.ok().build();
    }
}



