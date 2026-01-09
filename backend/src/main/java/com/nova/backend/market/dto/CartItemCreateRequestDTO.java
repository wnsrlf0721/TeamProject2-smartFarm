package com.nova.backend.market.dto;

import com.nova.backend.market.entity.CartItemCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "장바구니 상품 추가 요청")
public class CartItemCreateRequestDTO {

    @Schema(example = "1")
    private Long productId;

    @Schema(example = "Nova X100")
    private String productName;

    @Schema(example = "DEVICE")
    private CartItemCategory category;

    @Schema(example = "Nova Farm A")
    private String farmName;

    @Schema(example = "Hydroponic")
    private String systemType;

    @Schema(example = "Lettuce")
    private String plant;

    @Schema(example = "Seedling")
    private String stage;

    @Schema(example = "30")
    private Integer days;

    @Schema(example = "1990000")
    private BigDecimal price;

    @Schema(example = "EA")
    private String unit;

    @Schema(example = "https://image.url")
    private String image;

    @Schema(example = "Nova 스마트 디바이스")
    private String description;

    private List<String> specs;

    @Schema(example = "10")
    private Integer stock;

    @Schema(example = "1")
    private Integer quantity;
}

