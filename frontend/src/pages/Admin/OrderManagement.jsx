import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/auth/AuthContext";

import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  approveRefundAdmin,
  updateTrackingNumberAdmin,
} from "../../api/admin/orderManagementApi";

import { Button } from "../../components/market/ui/button";
import { Badge } from "../../components/market/ui/badge";
import { Input } from "../../components/market/ui/input";

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

import "./OrderManagement.css";

/** Status Config */
const statusConfig = {
  pending: {
    label: "결제 완료",
    color: "status-pending",
    nextStatus: "processing",
    nextLabel: "상품 준비",
    icon: Clock,
  },
  processing: {
    label: "상품 준비중",
    color: "status-processing",
    nextStatus: "shipping",
    nextLabel: "배송 시작",
    icon: Package,
  },
  shipping: {
    label: "배송중",
    color: "status-shipping",
    nextStatus: "delivered",
    nextLabel: "배송 완료",
    icon: Truck,
  },
  delivered: {
    label: "배송 완료",
    color: "status-delivered",
    nextStatus: "confirmed",
    nextLabel: "주문 확정",
    icon: CheckCircle,
  },
  confirmed: {
    label: "주문 확정",
    color: "status-confirmed",
    nextStatus: null,
    nextLabel: "",
    icon: CheckCircle,
  },
  cancelled: {
    label: "주문 취소",
    color: "status-cancelled",
    nextStatus: null,
    nextLabel: "",
    icon: Clock,
  },
  refund_requested: {
    label: "환불 요청",
    color: "status-refund-requested",
    nextStatus: null,
    nextLabel: "",
    icon: RotateCcw,
  },
  refunded: {
    label: "환불 완료",
    color: "status-refunded",
    nextStatus: null,
    nextLabel: "",
    icon: RotateCcw,
  },
};

export default function OrderManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [
    trackingModalOpen,
    setTrackingModalOpen,
  ] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] =
    useState(false);

  const [selectedOrderUid, setSelectedOrderUid] =
    useState(null);
  const [trackingNumber, setTrackingNumber] =
    useState("");
  const [
    confirmTargetStatus,
    setConfirmTargetStatus,
  ] = useState("");

  /** 주문 데이터 가져오기 + 이미 processing이지만 tracking 없는 경우 modal 강제 오픈 */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrdersAdmin();
        const mapped = data.map((order) => ({
          id: order.id, // 내부 식별용
          status: order.status,
          order_uid: order.orderUid, // 백에 보내야 하는 uid
          item_name: order.itemName,
          recipient_name: order.recipientName,
          phone_number: order.phoneNumber,
          delivery_address: order.deliveryAddress,
          order_total_price: order.totalPrice,
          payment_status: order.paymentStatus,
          payment_method: order.paymentMethod,
          tracking_number: order.trackingNumber,
          created_at: order.createdAt,
          estimated_delivery:
            order.estimatedDelivery,
          paid_at: order.paidAt,
        }));

        setOrders(mapped);

        const processingWithoutTracking =
          mapped.find(
            (o) =>
              o.status === "processing" &&
              !o.tracking_number
          );
        if (processingWithoutTracking) {
          setSelectedOrderUid(
            processingWithoutTracking.order_uid
          );
          setTrackingModalOpen(true);
        }
      } catch (err) {
        toast.error(
          "주문 목록을 불러오는데 실패했습니다"
        );
      }
    };

    fetchOrders();
  }, []);

  /** 주문 상태 업데이트 */
  const handleStatusUpdate = async (
    orderUid,
    newStatus,
    orderNumber
  ) => {
    if (newStatus === "confirmed") {
      toast.error(
        "관리자는 주문 확정을 할 수 없습니다"
      );
      return;
    }

    if (newStatus === "shipping") {
      setSelectedOrderUid(orderUid);
      setTrackingModalOpen(true);
      return;
    }

    if (newStatus === "delivered") {
      setSelectedOrderUid(orderUid);
      setConfirmTargetStatus("delivered");
      setConfirmModalOpen(true);
      return;
    }

    try {
      await updateOrderStatusAdmin(
        orderUid,
        newStatus
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.order_uid === orderUid
            ? { ...o, status: newStatus }
            : o
        )
      );
      toast.success(
        `주문 ${orderNumber} 상태가 업데이트되었습니다`
      );
    } catch {
      toast.error("주문 상태 변경 실패");
    }
  };

  /** 송장번호 입력 후 상태 업데이트 */
  const handleTrackingSubmit = async () => {
    if (
      !selectedOrderUid ||
      !trackingNumber.trim()
    ) {
      toast.error("송장번호를 입력해주세요");
      return;
    }

    try {
      await updateTrackingNumberAdmin(
        selectedOrderUid,
        trackingNumber
      );
      await updateOrderStatusAdmin(
        selectedOrderUid,
        "shipping"
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.order_uid === selectedOrderUid
            ? {
                ...o,
                status: "shipping",
                tracking_number: trackingNumber,
              }
            : o
        )
      );

      setTrackingModalOpen(false);
      setSelectedOrderUid(null);
      setTrackingNumber("");
      toast.success("배송이 시작되었습니다");
    } catch {
      toast.error("송장 등록 실패");
    }
  };

  /** 배송 완료 modal 처리 */
  const handleConfirmSubmit = async () => {
    try {
      await updateOrderStatusAdmin(
        selectedOrderUid,
        confirmTargetStatus
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.order_uid === selectedOrderUid
            ? {
                ...o,
                status: confirmTargetStatus,
              }
            : o
        )
      );
      setConfirmModalOpen(false);
      setSelectedOrderUid(null);
      toast.success("배송 완료 처리되었습니다");
    } catch {
      toast.error("배송 완료 처리 실패");
    }
  };

  /** 환불 승인 */
  const handleRefundApprove = async (
    orderUid
  ) => {
    if (
      !window.confirm("환불을 승인하시겠습니까?")
    )
      return;

    try {
      await approveRefundAdmin(orderUid);
      setOrders((prev) =>
        prev.map((o) =>
          o.order_uid === orderUid
            ? { ...o, status: "refunded" }
            : o
        )
      );
      toast.success("환불이 승인되었습니다");
    } catch {
      toast.error("환불 승인 실패");
    }
  };

  return (
    <div className="om-page">
      {/* 주문 관리 헤더 */}
      <header className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-header-left">
            <button
              className="pm-btn"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft /> 대시보드
            </button>
            <h1 className="pm-title">
              주문 관리
            </h1>
          </div>
          <div className="pm-header-right"></div>
        </div>
      </header>

      <div className="om-content">
        {orders.map((order) => {
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
              className="om-card"
            >
              <div className="om-card-header">
                <h3>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                  주문번호: {order.order_uid}
                </h3>

                <div>
                  {order.status ===
                    "refund_requested" && (
                    <Button
                      className="pm-btn"
                      variant="outline"
                      onClick={() =>
                        handleRefundApprove(
                          order.order_uid
                        )
                      }
                    >
                      <RotateCcw /> 환불 승인
                    </Button>
                  )}

                  {status.nextStatus &&
                    status.nextStatus !==
                      "confirmed" && (
                      <Button
                        className="pm-btn"
                        variant="outline"
                        onClick={() =>
                          handleStatusUpdate(
                            order.order_uid,
                            status.nextStatus,
                            order.order_uid
                          )
                        }
                      >
                        {status.nextLabel}
                      </Button>
                    )}
                </div>
              </div>

              <div className="om-card-body">
                <p>
                  <strong>상품명:</strong>{" "}
                  {order.item_name}
                </p>
                <p>
                  <strong>수령인:</strong>{" "}
                  {order.recipient_name}
                </p>
                <p>
                  <strong>연락처:</strong>{" "}
                  {order.phone_number}
                </p>
                <p>
                  <strong>배송지:</strong>{" "}
                  {order.delivery_address}
                </p>
                <p>
                  <strong>결제금액:</strong>{" "}
                  {Number(
                    order.order_total_price || 0
                  ).toLocaleString()}
                  원
                </p>
                <p>
                  <strong>결제상태:</strong>{" "}
                  {order.payment_status}
                </p>
                <p>
                  <strong>송장번호:</strong>{" "}
                  {order.tracking_number || "-"}
                </p>
                <p>
                  <strong>주문일:</strong>{" "}
                  {order.created_at}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Modal */}
      <Modal
        open={trackingModalOpen}
        onClose={() =>
          setTrackingModalOpen(false)
        }
        onConfirm={handleTrackingSubmit}
      >
        <div className="tracking-modal">
          <h2 className="modal-title">
            송장번호 입력
          </h2>
          <Input
            value={trackingNumber}
            onChange={(e) =>
              setTrackingNumber(e.target.value)
            }
            placeholder="송장번호를 입력해주세요"
          />
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        className="confirm-modal"
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmit}
      >
        <h2>배송 완료 처리</h2>
        <p>정말 배송을 완료 처리하시겠습니까?</p>
      </Modal>
    </div>
  );
}
/* =========================
    Modal 컴포넌트
   ========================= */
function Modal({
  open,
  onClose,
  onConfirm,
  children,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}

        <div className="modal-wrapper-btns">
          <Button
            className="modal-btn confirm"
            onClick={onConfirm}
          >
            확인
          </Button>
          <Button
            className="modal-btn cancel"
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
