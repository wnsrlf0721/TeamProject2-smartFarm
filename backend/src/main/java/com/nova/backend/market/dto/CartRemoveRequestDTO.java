package com.nova.backend.market.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRemoveRequestDTO {
    private Long userId;
    private Long productId;
}

