package com.nova.backend.market.dto;

import com.nova.backend.market.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductListResponseDTO {
    private Long productId;
    private ProductCategory category;
    private String name;
    private BigDecimal price;
    private String unit;
    private String imageUrl;
    private int stock;
}
