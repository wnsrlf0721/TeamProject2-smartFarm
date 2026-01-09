import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "../../components/market/ui/button";
import { useCart } from "../../api/market/CartContext";
import { Badge } from "../../components/market/ui/badge";

import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Package,
  Clock,
  Truck,
  CheckCircle,
  Star,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";

import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  /* =========================
     CartContext 사용
  ========================= */
  const {
    cartItems,
    removeItem,
    changeQuantity,
    clearAll,
  } = useCart();

  /* =========================
     총 결제 금액
  ========================= */
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  /* =========================
     수량 증가
  ========================= */
  const handleIncrease = (item) => {
    changeQuantity(
      item.cartItemId,
      item.quantity + 1
    );
  };

  /* =========================
     수량 감소 (1개 이하 방지)
  ========================= */
  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      toast.error("최소 수량은 1개입니다.");
      return;
    }
    changeQuantity(
      item.cartItemId,
      item.quantity - 1
    );
    toast.success("수량이 감소했습니다.");
  };

  /* =========================
     개별 삭제
  ========================= */
  const handleRemove = (item) => {
    removeItem(item.productId);
    toast.success("상품이 삭제되었습니다.");
  };

  /* =========================
     전체 삭제
  ========================= */
  const handleClearAll = () => {
    if (cartItems.length === 0) return;
    clearAll();
    toast.success("장바구니를 비웠습니다.");
  };

  /* =========================
     페이지 렌더링
  ========================= */
  return (
    <div className="cart-page-container">
      {/* HEADER */}
      <header className="cart-header">
        <div className="cart-header-inner">
          <button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>

          <h1 className="cart-title">장바구니</h1>

          {/* 전체 삭제 버튼 */}
          {cartItems.length > 0 && (
            <button
              className="clear-btn"
              onClick={handleClearAll}
            >
              <Trash2 size={16} />
              전체 삭제
            </button>
          )}
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* ================= ITEMS ================= */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="cart-empty-box">
                <ShoppingCart className="order-empty-icon" />

                <p className="cart-empty-text">
                  장바구니가 비어 있습니다.
                </p>
                <p className="order-empty-desc">
                  스마트팜 신선 작물을
                  주문해보세요
                </p>
                <Button
                  className="order-empty-btn"
                  onClick={() =>
                    navigate("/market")
                  }
                >
                  쇼핑하러 가기
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  className="cart-card"
                  key={item.productId}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="cart-card-img"
                  />

                  <div className="cart-card-info">
                    <h3 className="cart-card-title">
                      {item.productName}
                    </h3>

                    <p className="cart-card-unit">
                      {item.price.toLocaleString()}
                      원
                    </p>

                    <div className="cart-qty-row">
                      <div className="cart-qty-box">
                        <button
                          onClick={() =>
                            handleDecrease(item)
                          }
                        >
                          <Minus size={16} />
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrease(item)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="cart-card-price">
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() =>
                      handleRemove(item)
                    }
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ================= SUMMARY ================= */}
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2>주문 요약</h2>

              <div className="cart-summary-list">
                <div>
                  <span>총 상품 종류</span>
                  <span>
                    {cartItems.length}개
                  </span>
                </div>

                <div>
                  <span>총 상품 금액</span>
                  <span>
                    {totalPrice.toLocaleString()}
                    원
                  </span>
                </div>

                <div>
                  <span>배송비</span>
                  <span className="free">
                    무료
                  </span>
                </div>

                <hr />

                <div className="cart-summary-total">
                  <span>총 결제금액</span>
                  <span>
                    {totalPrice.toLocaleString()}
                    원
                  </span>
                </div>
              </div>

              <button
                className="cart-order-btn"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      directBuyItems: cartItems,
                    },
                  })
                }
              >
                주문하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
