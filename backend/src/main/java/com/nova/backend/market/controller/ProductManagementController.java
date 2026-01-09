package com.nova.backend.market.controller;

import com.nova.backend.market.dto.ProductCreateRequestDTO;
import com.nova.backend.market.dto.ProductUpdateRequestDTO;
import com.nova.backend.market.dto.ProductReadResponseDTO;
import com.nova.backend.market.service.ProductManagementServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProductManagementController {

    private final ProductManagementServiceImpl adminProductService;

    /**
     * 관리자 상품 등록
     */
    @PostMapping
    public ResponseEntity<ProductReadResponseDTO> createProduct(
            @RequestBody ProductCreateRequestDTO request
    ) {
        return ResponseEntity.ok(
                adminProductService.createProduct(request)
        );
    }

    /**
     * 관리자 상품 전체 조회
     */
    @GetMapping
    public ResponseEntity<List<ProductReadResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(
                adminProductService.getAllProducts()
        );
    }

    /**
     * 관리자 상품 단건 조회
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductReadResponseDTO> getProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                adminProductService.getProductById(productId)
        );
    }

    /**
     * 관리자 상품 수정
     */
    @PutMapping("/{productId}")
    public ResponseEntity<ProductReadResponseDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductUpdateRequestDTO request
    ) {
        return ResponseEntity.ok(
                adminProductService.updateProduct(productId, request)
        );
    }

    /**
     * 관리자 상품 삭제
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId
    ) {
        adminProductService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
