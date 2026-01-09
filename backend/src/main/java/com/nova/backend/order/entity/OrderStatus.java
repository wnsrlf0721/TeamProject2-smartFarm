package com.nova.backend.order.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderStatus {

    /**
     * 1. 주문 초기 단계
     */
    PENDING("pending"),             // 주문/결제 완료
    /**
     * 2. 물류 단계
     */
    PROCESSING("processing"),       // 상품 준비 중 (판매자가 주문을 확인한 상태)
    SHIPPING("shipping"),           // 배송 중
    DELIVERED("delivered"),         // 배송 완료
    /**
     * 3. 최종 완료 단계
     */
    PURCHASE_CONFIRMED("confirmed"), // 구매 확정

    /**
     * 4. 취소 및 반품 단계
     */
    CANCELLED("cancelled");           // 환불 완료

    @JsonValue
    private final String value;

    OrderStatus(String value) {
        this.value = value;
    }
}
