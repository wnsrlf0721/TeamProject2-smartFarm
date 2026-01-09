package com.nova.backend.market.service;

import com.nova.backend.market.dto.ProductCreateRequestDTO;
import com.nova.backend.market.dto.ProductUpdateRequestDTO;
import com.nova.backend.market.dto.ProductReadResponseDTO;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductManagementServiceImpl implements ProductManagementService {

    private final ProductRepository productRepository;

    /*** 관리자 상품 등록 ***/
    @Override
    public ProductReadResponseDTO createProduct(ProductCreateRequestDTO request) {
        ProductEntity entity = ProductEntity.create(request);
        ProductEntity saved = productRepository.save(entity);
        return toResponse(saved);
    }

    /*** 관리자 상품 전체 조회 ***/
    @Override
    @Transactional(readOnly = true)
    public List<ProductReadResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /*** 관리자 상품 단건 조회 ***/
    @Override
    @Transactional(readOnly = true)
    public ProductReadResponseDTO getProductById(Long productId) {
        ProductEntity entity = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));
        return toResponse(entity);
    }

    /*** 관리자 상품 수정 ***/
    @Override
    public ProductReadResponseDTO updateProduct(
            Long productId,
            ProductUpdateRequestDTO request
    ) {
        ProductEntity entity = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

        entity.update(request);
        return toResponse(entity);
    }

    /*** 관리자 상품 삭제 ***/
    @Override
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("상품이 존재하지 않습니다.");
        }
        productRepository.deleteById(productId);
    }

    /* =========================
       Entity → Response 변환
       ========================= */
    private ProductReadResponseDTO toResponse(ProductEntity entity) {
        return new ProductReadResponseDTO(
                entity.getProductId(),
                entity.getName(),
                entity.getCategory(),
                entity.getFarmName(),
                entity.getSystemType(),
                entity.getPlant(),
                entity.getStage(),
                entity.getDays(),
                entity.getPrice(),
                entity.getUnit(),
                entity.getImageUrl(),
                entity.getStock(),
                entity.getDescription(),
                entity.getSpecs() == null
                        ? List.of()
                        : List.of(entity.getSpecs().split(","))
        );
    }
}
