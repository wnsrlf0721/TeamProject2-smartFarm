package com.nova.backend.payment.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
//@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class PaymentRequestDTO {
    private String orderUid;
    private String itemName;
    private String buyerName;
    private BigDecimal paymentPrice;
    private String buyerEmail;
    private String buyerAddress;

    @Builder
    public PaymentRequestDTO(String orderUid, String itemName, String buyerName, BigDecimal paymentPrice, String buyerEmail, String buyerAddress) {
        this.orderUid = orderUid;
        this.itemName = itemName;
        this.buyerName = buyerName;
        this.paymentPrice = paymentPrice;
        this.buyerEmail = buyerEmail;
        this.buyerAddress = buyerAddress;
    }
}
