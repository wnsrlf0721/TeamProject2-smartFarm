import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import "./SuccessPayment.css";

import { getOrderDetail } from "../../api/order/orderApi";

const DEFAULT_VISIBLE_COUNT = 3;

export default function SuccessPayment() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);

  const [searchParams] = useSearchParams();
  const orderUid = searchParams.get("orderUid");

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const data = await getOrderDetail(orderUid);
        setOrder(data);
      } catch (error) {
        console.error("최근 주문 조회 실패", error);
        alert("주문 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (orderUid) fetchLatestOrder();
  }, [orderUid]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="cart-page-container" style={{ textAlign: "center", padding: 50 }}>
        <p>주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="cart-page-container" style={{ textAlign: "center", padding: 50 }}>
        <p>최근 주문 정보가 없습니다.</p>
      </div>
    );
  }

  const items = order.items || [];
  const visibleItems = showAllItems
    ? items
    : items.slice(0, DEFAULT_VISIBLE_COUNT);

  const hiddenCount = items.length - DEFAULT_VISIBLE_COUNT;

  return (
    <div className="cart-page-container">
      {/* ================= HEADER ================= */}
      <header className="cart-header">
        <div className="cart-header-inner">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> 뒤로가기
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={40} color="#4caf50" />
            <h1 className="cart-title">결제완료</h1>
          </div>

          <div style={{ width: 60 }} />
        </div>
      </header>

      <div className="cart-content">
        <div className="cart-layout" style={{ display: "flex", gap: 24 }}>

          {/* ================= LEFT : SUCCESS + SUMMARY ================= */}
          <div style={{ flex: 1 }}>
            <div className="cart-card" style={{ marginBottom: 20 }}>
              <div className="cart-summary">
                <h2>결제 요약</h2>

                <div className="cart-summary-list">
                  <div>
                    <span>주문번호</span>
                    <span>{order.orderUid}</span>
                  </div>
                  <div>
                    <span>결제 상태</span>
                    <span>{order.paymentStatus}</span>
                  </div>
                  <div>
                    <span>수령인</span>
                    <span>{order.recipientName}</span>
                  </div>
                  <div>
                    <span>배송 주소</span>
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div>
                    <span>연락처</span>
                    <span>{order.phoneNumber}</span>
                  </div>

                  <hr />

                  <div>
                    <span>주문 금액</span>
                    <span>{order.totalPrice?.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span>배송비</span>
                    <span className="free">무료</span>
                  </div>

                  <hr />

                  <div className="cart-summary-total">
                    <span>최종 결제금액</span>
                    <span>{order.totalPrice?.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="cart-buttons-container">
                  <button className="cart-order-btn" onClick={() => navigate("/market")}>
                    쇼핑 계속하기
                  </button>
                  <button className="cart-order-btn" onClick={() => navigate("/orders")}>
                    주문내역 보기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT : ORDER ITEMS ================= */}
          <div style={{ width: 360 }}>
            {visibleItems.map((item) => (
              <div className="cart-card" key={item.id} style={{ marginBottom: 16 }}>
                <img src={item.image} alt={item.name} className="cart-card-img" />
                <div className="cart-card-info">
                  <h3 className="cart-card-title">{item.name}</h3>
                  <p className="cart-card-unit">
                    {item.price.toLocaleString()}원
                  </p>
                  <p style={{ fontSize: 14, color: "#777" }}>
                    수량 {item.quantity}개
                  </p>
                </div>
              </div>
            ))}

            {/* ================= TOGGLE BUTTON ================= */}
            {items.length > DEFAULT_VISIBLE_COUNT && (
              <button
                className={`checkout-toggle-btn ${showAllItems ? "open" : ""}`}
                onClick={() => setShowAllItems(prev => !prev)}
              >
                {showAllItems ? (
                  <>
                    접기 <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    외 {hiddenCount}건 더보기 <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
