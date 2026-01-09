package com.nova.backend.market.repository;

import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.user.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository
        extends JpaRepository<CartItemEntity, Long> {

    /* =====================================================
       사용자 장바구니 전체 조회
       ===================================================== */
    List<CartItemEntity> findByUser(UsersEntity user);

    /* =====================================================
       같은 상품이 이미 담겨있는지 확인
       - 장바구니 중복 방지용
       ===================================================== */
    Optional<CartItemEntity> findByUserAndProduct(
            UsersEntity user,
            ProductEntity product
    );

    /* =====================================================
       사용자 장바구니 전체 삭제
       - 로그아웃 / 주문 완료 후 사용
       ===================================================== */
    void deleteByUser(UsersEntity user);

    /* =====================================================
       특정 상품만 장바구니에서 제거
       ===================================================== */
    void deleteByUserAndProduct(
            UsersEntity user,
            ProductEntity product
    );
}
