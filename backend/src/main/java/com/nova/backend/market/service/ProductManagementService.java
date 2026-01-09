package com.nova.backend.market.service;

import com.nova.backend.market.dto.ProductCreateRequestDTO;
import com.nova.backend.market.dto.ProductUpdateRequestDTO;
import com.nova.backend.market.dto.ProductReadResponseDTO;

import java.util.List;

public interface ProductManagementService {

    ProductReadResponseDTO createProduct(ProductCreateRequestDTO request);

    List<ProductReadResponseDTO> getAllProducts();

    ProductReadResponseDTO getProductById(Long productId);

    ProductReadResponseDTO updateProduct(Long productId, ProductUpdateRequestDTO request);

    void deleteProduct(Long productId);
}

