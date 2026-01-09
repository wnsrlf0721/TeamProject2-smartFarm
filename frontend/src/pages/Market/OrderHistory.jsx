import { useEffect, useState } from "react";
import { useAuth } from "../../api/auth/AuthContext";
import { useReviews } from "../../api/market/ReviewContext";
import { useNavigate } from "react-router";
import { Button } from "../../components/market/ui/button";
import { Badge } from "../../components/market/ui/badge";
import { Textarea } from "../../components/market/ui/textarea";
import {
  getOrders,
  confirmOrder,
  cancelOrder,
} from "../../api/order/orderApi";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  Star,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import "./OrderHistory.css";

/* ================= 상태 매핑 ================= */

const statusConfig = {
  pending: {
    label: "결제완료",
    color: "status-pending",
    icon: Clock,
  },
  processing: {
    label: "상품 준비중",
    color: "status-processing",
    icon: Package,
  },
  shipping: {
    label: "배송중",
    color: "status-shipping",
    icon: Truck,
  },
  delivered: {
    label: "배송 완료",
    color: "status-delivered",
    icon: CheckCircle,
  },
  confirmed: {
    label: "주문 확정",
    color: "status-confirmed",
    icon: CheckCircle,
  },
  cancelled: {
    label: "주문 취소",
    color: "status-cancelled",
    icon: Clock,
  },
  refund_requested: {
    label: "환불 요청",
    color: "status-refund-requested",
    icon: RotateCcw,
  },
  refunded: {
    label: "환불 완료",
    color: "status-refunded",
    icon: RotateCcw,
  },
};

/* ================= 메인 ================= */

export default function OrderHistory() {
  const { user } = useAuth();
  const { canReview, addReview } = useReviews();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [refundModalOpen, setRefundModalOpen] =
    useState(false);
  const [refundReason, setRefundReason] =
    useState("");
  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  /* ===== 주문 목록 조회 ===== */
  useEffect(() => {
    (async () => {
      try {
        const data = await getOrders();

        setOrders(
          data.map((order) => ({
            ...order,
            id: order.orderUid,
            status: order.status.toLowerCase(),
            paymentStatus:
              order.paymentStatus?.toLowerCase(),
            createdAt: new Date(order.createdAt),
            estimatedDelivery:
              order.estimatedDelivery
                ? new Date(
                    order.estimatedDelivery
                  )
                : null,
          }))
        );
      } catch {
        toast.error(
          "주문 내역을 불러오지 못했습니다"
        );
      }
    })();
  }, []);

  /* ===== 주문 확정 ===== */
  const handleConfirmOrder = async (orderUid) => {
    try {
      await confirmOrder(orderUid);

      toast.success("주문이 확정되었습니다");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderUid
            ? { ...o, status: "confirmed" }
            : o
        )
      );
    } catch {
      toast.error("주문 확정에 실패했습니다");
    }
  };

  /* ===== 주문 취소 / 환불 요청 ===== */
  const handleCancelOrder = async () => {
    try {
      await cancelOrder(selectedOrderId);

      toast.success("환불 요청이 접수되었습니다");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId
            ? { ...o, status: "refund_requested" }
            : o
        )
      );

      setRefundModalOpen(false);
      setRefundReason("");
      setSelectedOrderId(null);
    } catch {
      toast.error("환불 요청에 실패했습니다");
    }
  };

  /* ================= 렌더 ================= */

  return (
    <div className="order-history-page">
      {/* Header */}
      <header className="order-header">
        <Button
          variant="ghost"
          className="order-back-btn"
          onClick={() => navigate("/market")}
        >
          <ArrowLeft size={18} /> 뒤로가기
        </Button>
        <h1>주문내역</h1>
      </header>

      {/* 주문 리스트 */}
      {orders.length === 0 ? (
        <div className="order-empty">
          <Package size={48} />
          <p>주문 내역이 없습니다</p>
          <Button
            onClick={() => navigate("/market")}
          >
            쇼핑하러 가기
          </Button>
        </div>
      ) : (
        orders.map((order) => {
          console.log(
            "order.status =",
            order.status
          );

          const status = statusConfig[
            order.status
          ] || {
            label: "결제 완료",
            color: "status-pending",
            icon: Clock,
          };
          const StatusIcon = status.icon;

          return (
            <div
              key={order.id}
              className="order-card"
            >
              <div className="order-card-header">
                <Badge className={status.color}>
                  <StatusIcon size={14} />
                  {status.label}
                </Badge>
                <span>주문번호: {order.id}</span>
              </div>

              {/* 아이템 */}
              <div className="order-item-grid">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="order-item"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-img"
                    />
                    <div>
                      <p>{item.name}</p>
                      <p>
                        {item.quantity}개{" "}
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 요약 */}
              <div className="order-summary">
                <p>
                  주문일시:{" "}
                  {order.createdAt.toLocaleString(
                    "ko-KR"
                  )}
                </p>
                <p className="order-total-price">
                  {order.totalPrice.toLocaleString()}
                  원
                </p>
              </div>

              {/* 액션 */}

                {/* 주문 상세보기는 항상 */}
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/tracking/${order.id}`)
                  }
                >
                  배송현황
                </Button>

              {order.status === "delivered" && (

                <div className="order-actions">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/tracking/${order.id}`)
                    }
                  >
                    주문 상세보기
                  </Button>

                  {order.status === "delivered" && (
                    <>
                      <Button
                        onClick={() =>
                          handleConfirmOrder(order.id)
                        }
                      >
                        <CheckCircle size={16} />
                        주문 확정
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setRefundModalOpen(true);
                        }}
                      >
                        <RotateCcw size={16} />
                        환불 요청
                      </Button>
                    </>
                  )}
                </div>

              )}
            </div>
          );
        })
      )}

      {/* 환불 모달 */}
      {refundModalOpen && (
        <div className="refund-modal-overlay">
          <div className="refund-modal">
            <h2>환불 요청</h2>

            <Textarea
              placeholder="환불 사유를 입력해주세요 (서버 전송되지 않음)"
              value={refundReason}
              onChange={(e) =>
                setRefundReason(e.target.value)
              }
            />

            <div className="refund-modal-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setRefundModalOpen(false);
                  setRefundReason("");
                  setSelectedOrderId(null);
                }}
              >
                취소
              </Button>
              <Button onClick={handleCancelOrder}>
                환불 요청
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
