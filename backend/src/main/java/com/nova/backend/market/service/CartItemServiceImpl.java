
package com.nova.backend.market.service;

import com.nova.backend.market.dto.CartItemCreateRequestDTO;
import com.nova.backend.market.dto.CartItemResponseDTO;
import com.nova.backend.market.entity.CartItemEntity;
import com.nova.backend.market.repository.CartItemRepository;
import com.nova.backend.market.entity.ProductEntity;
import com.nova.backend.market.repository.ProductRepository;
import com.nova.backend.user.entity.UsersEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CartItemServiceImpl {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    /* =====================================================
   (도메인용) 장바구니 엔티티 조회
   ===================================================== */
    public List<CartItemEntity> getCartItemEntities(UsersEntity user) {
        return cartItemRepository.findByUser(user);
    }


    /* =====================================================
       (컨트롤러용) 장바구니 조회
       ===================================================== */
    public List<CartItemResponseDTO> getCartItems(UsersEntity user) {

        return cartItemRepository.findByUser(user)
                .stream()
                .map(CartItemResponseDTO::from)
                .toList();
    }

    /* =====================================================
       장바구니 상품 추가
       ===================================================== */
    @Transactional
    public CartItemResponseDTO addCartItem(
            CartItemCreateRequestDTO request,
            UsersEntity user
    ) {

        ProductEntity product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

        CartItemEntity cartItem =
                cartItemRepository.findByUserAndProduct(user, product)
                        .orElse(
                                CartItemEntity.builder()
                                        .user(user)
                                        .product(product)
                                        .productName(product.getName()) // Product에서 가져오기
                                        .category(product.getCategory()) // Product에서 가져오기
                                        .farmName(request.getFarmName())
                                        .systemType(request.getSystemType())
                                        .plant(request.getPlant())
                                        .stage(request.getStage())
                                        .days(request.getDays())
                                        .price(product.getPrice())
                                        .unit(product.getUnit())
                                        .imageUrl(product.getImageUrl())
                                        .description(product.getDescription())
                                        .specs(product.getSpecs())
                                        .stock(request.getStock())
                                        .quantity(0)
                                        .build()
                        );

        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());

        return CartItemResponseDTO.from(cartItemRepository.save(cartItem));
    }

    /* =====================================================
       수량 변경
       ===================================================== */
    public CartItemResponseDTO updateQuantity(
            Long cartItemId,
            int quantity,
            UsersEntity user
    ) {

        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템이 없습니다."));

        if (!cartItem.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("본인의 장바구니만 수정할 수 있습니다.");
        }

        cartItem.setQuantity(quantity);

        return CartItemResponseDTO.from(cartItemRepository.save(cartItem));
    }

    /* =====================================================
       상품 삭제
       ===================================================== */
    public void deleteCartItem(Long cartItemId, UsersEntity user) {

        CartItemEntity cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 아이템이 없습니다."));

        if (!cartItem.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("본인의 장바구니만 삭제할 수 있습니다.");
        }

        cartItemRepository.delete(cartItem);
    }

    /* =====================================================
       장바구니 비우기
       ===================================================== */
    public void clearCart(UsersEntity user) {
        cartItemRepository.deleteByUser(user);
    }
}
