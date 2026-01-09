package com.nova.backend.order.controller;

import com.nova.backend.order.dto.OrderResponseDTO;
import com.nova.backend.order.dto.OrderStatusRequest;
import com.nova.backend.order.dto.RefundApproveRequest;
import com.nova.backend.order.dto.TrackingNumberRequest;
import com.nova.backend.order.entity.OrderStatus;
import com.nova.backend.order.service.OrderManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class OrderManagementController {

    private final OrderManagementService orderManagementService;


    /**
     * =========================================================
     * 관리자 - 모든 유저의 전체 주문 목록 조회
     * =========================================================
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        // 서비스에서 List<OrderResponseDTO>를 반환하고
        List<OrderResponseDTO> orders = orderManagementService.getAllOrders();
        // ResponseEntity.ok()로 감싸서 반환
        return ResponseEntity.ok(orders);
    }



    /* =========================================================
     * 주문 상태 배송완료로 변경 (관리자용)
     * =========================================================
     */
    @PostMapping("/{orderUid}/status")
    public void updateOrderStatus(
            @PathVariable String orderUid,
            @RequestBody OrderStatusRequest request
    ) {
        orderManagementService.updateOrderStatus(orderUid, request.getStatus());
    }



    /**
     * =========================================================
     * 운송장 번호 등록 / 수정 (관리자)
     * =========================================================
     */
    @PostMapping("/{orderUid}/tracking")
    public void updateTrackingNumber(
            @PathVariable String orderUid,
            @RequestBody TrackingNumberRequest request
    ) {
        orderManagementService.updateTrackingNumber(orderUid, request.getTrackingNumber());
    }


    /**
     * =========================================================
     * 환불 승인 (관리자)
     * =========================================================
     */
    @PostMapping("/{orderUid}/refund/approve")
    public void approveRefund(
            @PathVariable String orderUid,
            @RequestBody(required = false) RefundApproveRequest request
    ) {
        orderManagementService.approveRefund(orderUid);
    }





}