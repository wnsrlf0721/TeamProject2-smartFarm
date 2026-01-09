package com.nova.backend.market.controller;

import com.nova.backend.market.dto.CartItemCreateRequestDTO;
import com.nova.backend.market.dto.CartItemResponseDTO;
import com.nova.backend.market.service.CartItemServiceImpl;
import com.nova.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemServiceImpl cartItemServiceImpl;


    @GetMapping("/items")
    public List<CartItemResponseDTO> getCartItems(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemServiceImpl.getCartItems(userDetails.getUser());
    }


    @PostMapping("/items")
    public CartItemResponseDTO addCartItem(
            @RequestBody CartItemCreateRequestDTO request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemServiceImpl.addCartItem(request, userDetails.getUser());
    }


    @PutMapping("/items/{cartItemId}")
    public CartItemResponseDTO updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return cartItemServiceImpl.updateQuantity(
                cartItemId,
                quantity,
                userDetails.getUser()
        );
    }


    @DeleteMapping("/items/{cartItemId}")
    public void deleteCartItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        cartItemServiceImpl.deleteCartItem(
                cartItemId,
                userDetails.getUser()
        );
    }


    @DeleteMapping("/clear")
    public void clearCart(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        cartItemServiceImpl.clearCart(userDetails.getUser());
    }
}