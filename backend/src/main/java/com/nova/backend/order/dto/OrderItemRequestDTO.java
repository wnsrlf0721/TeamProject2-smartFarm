package com.nova.backend.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequestDTO {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @Min(value = 1, message = "상품 수량은 최소 1개 이상이어야 합니다.")
    private int quantity;

    @Min(value = 0, message = "상품 가격은 0 이상이어야 합니다.")
    private BigDecimal price;

    @NotEmpty
    private String itemName;  // 추가

}

