
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/market/ui/button";
import "./Checkout.css"; 

import {
  ArrowLeft,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

const SuccessPayment = ({ orderSummary }) => {
  const navigate = useNavigate();

  return (
    <div className="cart-page-container">
      <header className="cart-header">
        <div className="cart-header-inner">
          <button
            className="cart-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            뒤로가기
          </button>
          <h1 className="cart-title">결제취소</h1>
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout">
          {/* 취소 메시지 카드 */}
          <div className="checkout-card" style={{ textAlign: "center" }}>
            <h2 style={{ color: "#4caf50" }}>결제가 취소되었습니다</h2>
            <p>주문이 정상적으로 취소되었습니다.</p>
          </div>

          {/* 주문 요약 카드 */}
          {orderSummary && (
            <div className="checkout-card">
              <h2 className="checkout-card-title">주문 요약</h2>
              <div className="cart-items">
                {orderSummary.items.map((item) => (
                  <div className="cart-card" key={item.productId}>
                    <img src={item.image} alt={item.productName} className="cart-card-img" />
                    <div className="cart-card-info">
                      <h3 className="cart-card-title">{item.productName}</h3>
                      <p className="cart-card-unit">{item.price.toLocaleString()}원</p>
                      <p className="cart-card-price">{(item.price * item.quantity).toLocaleString()}원</p>
                      <p className="cart-card-qty">수량: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-price-box">
                <div className="summary-line">
                  <span>상품 금액</span>
                  <span>{orderSummary.totalPrice.toLocaleString()}원</span>
                </div>
                <div className="summary-line">
                  <span>배송비</span>
                  <span className="free">무료</span>
                </div>
                <div className="summary-total">
                  <span>최종 결제금액</span>
                  <span>{orderSummary.totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}


          {/* ================= ACTION ================= */}
          <button
            className="cart-order-btn"
            onClick={() => navigate("/market")}
          >
            쇼핑 계속하기
          </button>

          <button
            className="cart-order-btn"
            onClick={() => navigate("/checkout")}
          >
            다시 결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
