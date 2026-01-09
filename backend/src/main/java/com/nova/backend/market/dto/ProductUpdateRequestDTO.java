package com.nova.backend.market.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProductUpdateRequestDTO {
    private String name;
    private BigDecimal price;
    private int stock;
    private String description;
    private List<String> specs;
}