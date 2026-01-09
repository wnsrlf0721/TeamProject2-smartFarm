package com.nova.backend.market.service;

import com.nova.backend.market.dto.ProductDetailResponseDTO;
import com.nova.backend.market.dto.ProductListResponseDTO;
import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductCategory;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService{

    private final ProductRepository productRepository;

    /**
     * =========================================================
     * 상품 조회 (리스트)
     * =========================================================
     */
    public Page<ProductListResponseDTO> getProducts(
            ProductCategory category,
            String keyword,
            Pageable pageable
    ) {
        Page<ProductEntity> products;

        if (category != null && keyword != null) {
            products = productRepository.findByCategoryAndNameContainingIgnoreCase(category, keyword, pageable);
        } else if (category != null) {
            products = productRepository.findByCategory(category, pageable);
        } else if (keyword != null) {
            products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(this::toListDto);
    }

    /**
     * =========================================================
     * 상품 조회 (상세)
     * =========================================================
     */
    public ProductDetailResponseDTO getProduct(Long productId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품 없음"));

        return toDetailDto(product);
    }

    private ProductListResponseDTO toListDto(ProductEntity p) {
        return new ProductListResponseDTO(
                p.getProductId(),
                p.getCategory(),
                p.getName(),
                p.getPrice(),
                p.getUnit(),
                p.getImageUrl(),
                p.getStock()
        );
    }

    private ProductDetailResponseDTO toDetailDto(ProductEntity p) {
        return new ProductDetailResponseDTO(
                p.getProductId(),
                p.getName(),
                p.getCategory(),
                p.getFarmName(),
                p.getSystemType(),
                p.getPlant(),
                p.getStage(),
                p.getDays(),
                p.getPrice(),
                p.getUnit(),
                p.getImageUrl(),
                p.getStock(),
                p.getDescription(),
                p.getSpecs()
        );
    }


    /**
     * =========================================================
     * 재고 확인만, 차감 없음
     * =========================================================
     */
    @Transactional(readOnly = true)
    public void validateStock(List<CartItemEntity> cartItems) {
        for (CartItemEntity item : cartItems) {
            ProductEntity product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalStateException("재고 부족: " + product.getName());
            }
        }
    }





}


