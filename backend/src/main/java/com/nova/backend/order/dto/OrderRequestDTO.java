package com.nova.backend.order.dto;

import com.nova.backend.payment.entity.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @NotEmpty(message = "주문 항목은 비어 있을 수 없습니다.")
    private List<OrderItemRequestDTO> items;  // OrderItemRequest DTO 필요

    @NotNull(message = "배송 주소는 필수입니다.")
    private String deliveryAddress;

    @NotNull(message = "전화번호는 필수입니다.")
    private String phoneNumber;

    @NotNull(message = "결제 수단은 필수입니다.")
    private PaymentMethod paymentMethod;

    private String recipientName;

    private String message;

}
