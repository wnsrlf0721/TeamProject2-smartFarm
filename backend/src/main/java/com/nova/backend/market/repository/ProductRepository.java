package com.nova.backend.market.repository;

import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.entity.ProductCategory;
import jakarta.persistence.LockModeType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    Page<ProductEntity> findByCategory(ProductCategory category, Pageable pageable);

    Page<ProductEntity> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    Page<ProductEntity> findByCategoryAndNameContainingIgnoreCase(
            ProductCategory category, String keyword, Pageable pageable
    );

    //주문시 제고감소용 함수
    // 🔒 기본 findById에 PESSIMISTIC_WRITE 락 적용
    @NotNull
    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<ProductEntity> findById(@NotNull Long productId);



}


