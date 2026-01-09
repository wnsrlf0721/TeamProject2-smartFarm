package com.nova.backend.market.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartAddRequestDTO {
    private Long userId;
    private Long productId;
    private int quantity;
}
