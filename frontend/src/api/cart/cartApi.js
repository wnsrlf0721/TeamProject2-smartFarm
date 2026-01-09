import backendServer from "../backendServer";
import requests from "../request";


/* =========================
   CART API
========================= */

// 장바구니 조회
export const fetchCartItems = () =>
  backendServer.get(requests.cartItems);

// 장바구니 상품 추가
export const addCartItem = (data) =>
  backendServer.post(requests.addCartItem, data);

// 장바구니 수량 수정
export const updateCartItemQuantity = (cartItemId, quantity) =>
  backendServer.put(requests.updateCartItemQuantity(cartItemId), null, { params: { quantity } });

// 장바구니 상품 삭제
export const deleteCartItem = (cartItemId) =>
  backendServer.delete(requests.deleteCartItem(cartItemId));


// 장바구니 비우기
export const clearCart = () => {
  return backendServer.delete(requests.cartClear);
};

