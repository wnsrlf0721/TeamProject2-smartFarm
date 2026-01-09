package com.nova.backend.market.controller;

import com.nova.backend.market.dto.ProductDetailResponseDTO;
import com.nova.backend.market.dto.ProductListResponseDTO;
import com.nova.backend.market.entity.ProductCategory;
import com.nova.backend.market.service.ProductServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    private final ProductServiceImpl productServiceImpl;

    /*** 로그인한 사용자든 로그인 안했든 상품목록 조회(GET) ***/
    @GetMapping
    public Page<ProductListResponseDTO> getProducts(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        return productServiceImpl.getProducts(category, keyword, pageable);
    }

    /*** 로그인한 사용자든 로그인 안했든 상품 상세정보 조회(GET) ***/
    @GetMapping("/{productId}")
    public ProductDetailResponseDTO getProduct(@PathVariable Long productId) {
        return productServiceImpl.getProduct(productId);
    }
}
