package com.nova.backend.market.dto;

import com.nova.backend.market.entity.ProductCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.math.BigDecimal;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
public class ProductCreateRequestDTO {
    private String name;
    private ProductCategory category;
    private String farmName;
    private String systemType;
    private String plant;
    private String stage;
    private Integer days;
    private BigDecimal price;
    private String unit;
    private String imageUrl;
    private int stock;
    private String description;
    private List<String> specs;
}