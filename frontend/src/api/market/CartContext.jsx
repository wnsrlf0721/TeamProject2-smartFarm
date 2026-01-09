import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
} from "../../api/cart/cartApi";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /* =========================
     장바구니 조회
  ========================= */
  const loadCartItems = async () => {
    try {
      const res = await fetchCartItems(); // token 제거
      setCartItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  /* =========================
     상품 추가
  ========================= */
  const addItem = async (payload, quantity = 1) => {
    try {
      const productId = typeof payload === "object" ? payload.productId : payload;
      const qty = typeof payload === "object" ? payload.quantity ?? 1 : quantity;

      await addCartItem({ productId, quantity: qty }); // token 제거
      await loadCartItems();
      //toast.success("장바구니에 추가되었습니다.");
    } catch (e) {
      toast.error("장바구니 추가 실패");
    }
  };

  /* =========================
     수량 변경
  ========================= */
  const changeQuantity = async (cartItemId, quantity) => {
    try {
      await updateCartItemQuantity(cartItemId, quantity); // token 제거
      await loadCartItems();
    } catch (e) {
      toast.error("수량 변경 실패");
    }
  };

  /* =========================
     개별 상품 삭제
  ========================= */
  const removeItem = async (productId) => {
    try {
      const target = cartItems.find((item) => item.productId === productId);
      if (!target) return;

      await deleteCartItem(target.cartItemId); // token 제거
      await loadCartItems();
    } catch (e) {
      toast.error("상품 삭제 실패");
    }
  };

  /* =========================
     장바구니 전체 비우기
  ========================= */
  const clearAll = async () => {
  try {
    console.log("장바구니 비우기 요청 시작");
    await clearCart();  // 서버 전체 삭제
    console.log("서버에서 장바구니 비우기 성공");
    await loadCartItems();  // 서버 상태 다시 동기화
    console.log("장바구니 상태 로드 후:", cartItems);
    toast.success("장바구니를 비웠습니다.");
  } catch (e) {
    console.error("장바구니 비우기 실패:", e);  // 오류 로그를 통해 문제 추적
    toast.error("장바구니 비우기 실패");
  }
};

// const clearAll = async () => {
//   try {
//     await clearCart();      // 서버 전체 삭제
//     await loadCartItems();  // 🔥 서버 상태 다시 동기화
//     toast.success("장바구니를 비웠습니다.");
//   } catch (e) {
//     toast.error("장바구니 비우기 실패");
//   }
// };


  /* 🔥 초기 로딩 */
  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        changeQuantity,
        clearAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
