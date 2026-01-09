package com.nova.backend.market.dto;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "장바구니 상품 응답")
public class CartItemResponseDTO {

    private Long cartItemId;
    private Long productId;
    private String productName;
    private ProductCategory category;
    private BigDecimal price;
    private Integer quantity;
    private String unit;
    private String imageUrl;
    private String specs;
    private LocalDateTime createdAt;

    public static CartItemResponseDTO from(CartItemEntity entity) {
        return CartItemResponseDTO.builder()
                .cartItemId(entity.getCartItemId())
                .productId(entity.getProduct().getProductId())
                .productName(entity.getProductName())
                .category(entity.getProduct().getCategory())
                .price(entity.getProduct().getPrice())
                .quantity(entity.getQuantity())
                .unit(entity.getUnit())
                .imageUrl(entity.getImageUrl())
                .specs(entity.getSpecs())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}


//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@Schema(description = "장바구니 상품 응답")
//public class CartItemResponse {
//
//    private Long cartItemId;
//    private Long productId;
//    private String productName;
//    private ProductCategory category;
//    private BigDecimal price;
//    private Integer quantity;
//    private String unit;
//    private String image;
//    private List<String> specs;
//    private LocalDateTime createdAt;
//
//    public CartItemResponse(CartItemEntity entity) {
//        this.cartItemId = entity.getCartItemId();
//        this.productId = entity.getProduct().getProductId();
//        this.productName = entity.getProduct().getName();
//        this.quantity = entity.getQuantity();
//        this.price = BigDecimal.valueOf(entity.getProduct().getPrice());
//    }
//
//    public static CartItemResponse from(CartItemEntity entity) {
//        return CartItemResponse.builder()
//                .cartItemId(entity.getCartItemId())
//                .productId(entity.getProduct().getProductId())
//                .productName(entity.getProductName())
//                .price(entity.getPrice())
//                .quantity(entity.getQuantity())
//                .unit(entity.getUnit())
//                .image(entity.getImage())
//                .build();
//    }
//}
