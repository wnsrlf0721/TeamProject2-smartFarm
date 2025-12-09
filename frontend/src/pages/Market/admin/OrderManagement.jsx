import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useOrders } from "../../../contexts/OrderContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  ArrowLeft,
  LogOut,
  Package,
  Truck,
  CheckCircle,
  FileText,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} StatusConfigItem
 * @property {string} label
 * @property {string} color
 * @property {string|null} nextStatus
 * @property {string} nextLabel
 */

/** @type {Record<string, StatusConfigItem>} */
const statusConfig = {
  pending: {
    label: "주문 대기",
    color: "bg-[#90a1b9]",
    nextStatus: "processing",
    nextLabel: "상품 준비",
  },
  processing: {
    label: "상품 준비중",
    color: "bg-[#51a2ff]",
    nextStatus: "shipping",
    nextLabel: "배송 시작",
  },
  shipping: {
    label: "배송중",
    color: "bg-[#c27aff]",
    nextStatus: null,
    nextLabel: "",
  },
  delivered: {
    label: "배송 완료",
    color: "bg-[#05df72]",
    nextStatus: null,
    nextLabel: "",
  },
  confirmed: {
    label: "주문 확정",
    color: "bg-[#16a34a]",
    nextStatus: null,
    nextLabel: "",
  },
  cancelled: {
    label: "주문 취소",
    color: "bg-[#ff5555]",
    nextStatus: null,
    nextLabel: "",
  },
  refund_requested: {
    label: "환불 요청",
    color: "bg-[#ffa500]",
    nextStatus: null,
    nextLabel: "",
  },
  refunded: {
    label: "환불 완료",
    color: "bg-[#62748e]",
    nextStatus: null,
    nextLabel: "",
  },
};

export default function OrderManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    orders,
    updateOrderStatus,
    updateTrackingNumber,
    approveRefund,
  } = useOrders();

  /** @type {[boolean, Function]} */
  const [
    trackingModalOpen,
    setTrackingModalOpen,
  ] = useState(false);

  /** @type {[string|null, Function]} */
  const [selectedOrderId, setSelectedOrderId] =
    useState(null);

  /** @type {[string, Function]} */
  const [trackingNumber, setTrackingNumber] =
    useState("");

  /**
   * @param {string} orderId
   * @param {string} newStatus
   * @param {string} orderNumber
   */
  const handleStatusUpdate = (
    orderId,
    newStatus,
    orderNumber
  ) => {
    if (newStatus === "shipping") {
      setSelectedOrderId(orderId);
      setTrackingModalOpen(true);
      return;
    }

    updateOrderStatus(orderId, newStatus);
    toast.success(
      `주문 ${orderNumber}의 상태가 업데이트되었습니다`
    );
  };

  const handleTrackingSubmit = () => {
    if (
      !selectedOrderId ||
      !trackingNumber.trim()
    ) {
      toast.error("송장번호를 입력해주세요");
      return;
    }

    updateTrackingNumber(
      selectedOrderId,
      trackingNumber
    );
    updateOrderStatus(
      selectedOrderId,
      "shipping"
    );
    toast.success("배송이 시작되었습니다");

    setTrackingModalOpen(false);
    setSelectedOrderId(null);
    setTrackingNumber("");
  };

  const handleRefundApprove = (orderId) => {
    if (
      window.confirm("환불을 승인하시겠습니까?")
    ) {
      approveRefund(orderId);
      toast.success("환불이 승인되었습니다");
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime()
  );

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1400px] mx-auto px-[24px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="size-[20px] mr-2" />
              대시보드
            </Button>
            <h1 className="text-white text-[24px]">
              주문 관리
            </h1>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="size-[20px]" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-[24px] py-[48px]">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-[120px]">
            <Package className="size-[64px] text-[#314158] mx-auto mb-[24px]" />
            <p className="text-[#90a1b9] text-[20px]">
              주문이 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-[24px]">
            {sortedOrders.map((order) => {
              const status =
                statusConfig[order.status];

              return (
                <div
                  key={order.id}
                  className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]"
                >
                  <div className="flex items-center justify-between mb-[20px]">
                    <div className="flex items-center gap-[12px]">
                      <h3 className="text-white text-[18px]">
                        주문번호: {order.id}
                      </h3>
                      <Badge
                        className={`${status.color} text-white border-0`}
                      >
                        {status.label}
                      </Badge>
                      {order.paymentMethod && (
                        <Badge className="bg-[rgba(15,23,43,0.5)] border border-[#314158] text-[#90a1b9]">
                          {order.paymentMethod ===
                          "kakaopay"
                            ? "💬 카카오페이"
                            : "toss 토스페이"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-[12px]">
                      {order.status ===
                        "refund_requested" && (
                        <Button
                          className="bg-[#ffa500] text-white hover:bg-[#ffa500]/90"
                          onClick={() =>
                            handleRefundApprove(
                              order.id
                            )
                          }
                        >
                          <RotateCcw className="size-[16px] mr-2" />
                          환불 승인
                        </Button>
                      )}

                      {status.nextStatus && (
                        <Button
                          className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
                          onClick={() =>
                            handleStatusUpdate(
                              order.id,
                              status.nextStatus,
                              order.id
                            )
                          }
                        >
                          {status.nextStatus ===
                            "processing" && (
                            <Package className="size-[16px] mr-2" />
                          )}
                          {status.nextStatus ===
                            "shipping" && (
                            <Truck className="size-[16px] mr-2" />
                          )}
                          {status.nextStatus ===
                            "delivered" && (
                            <CheckCircle className="size-[16px] mr-2" />
                          )}
                          {status.nextLabel}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[24px] mb-[20px]">
                    <div>
                      <h4 className="text-[#90a1b9] text-[14px] mb-[8px]">
                        주문 상품
                      </h4>
                      <div className="space-y-[8px]">
                        {order.items.map(
                          (item) => (
                            <div
                              key={item.id}
                              className="flex gap-[12px]"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-[60px] h-[60px] object-cover rounded-[8px]"
                              />
                              <div className="flex-1">
                                <p className="text-white text-[14px]">
                                  {item.category ===
                                  "device"
                                    ? item.name
                                    : item.category ===
                                      "service"
                                    ? "타임랩스"
                                    : item.plant}
                                </p>
                                <p className="text-[#90a1b9] text-[12px]">
                                  {item.quantity}
                                  개 ×{" "}
                                  {item.price.toLocaleString()}
                                  원
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[#90a1b9] text-[14px] mb-[8px]">
                        배송 정보
                      </h4>
                      <div className="space-y-[4px]">
                        <p className="text-white text-[14px]">
                          {order.deliveryAddress}
                        </p>
                        <p className="text-[#90a1b9] text-[14px]">
                          연락처:{" "}
                          {order.phoneNumber}
                        </p>

                        {order.trackingNumber && (
                          <div className="mt-[8px] p-[8px] bg-[rgba(194,122,255,0.1)] border border-[#c27aff] rounded-[8px]">
                            <p className="text-[#c27aff] text-[12px] mb-[4px]">
                              송장번호
                            </p>
                            <code className="text-white text-[14px] font-mono">
                              {
                                order.trackingNumber
                              }
                            </code>
                          </div>
                        )}

                        <p className="text-[#62748e] text-[12px] mt-[8px]">
                          주문일시:{" "}
                          {order.createdAt.toLocaleString(
                            "ko-KR"
                          )}
                        </p>

                        {order.estimatedDelivery && (
                          <p className="text-[#62748e] text-[12px]">
                            도착 예정:{" "}
                            {order.estimatedDelivery.toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}

                        {order.refundReason && (
                          <div className="mt-[8px] p-[8px] bg-[rgba(255,85,85,0.1)] border border-[#ff5555] rounded-[8px]">
                            <p className="text-[#ff5555] text-[12px] mb-[4px]">
                              환불 사유
                            </p>
                            <p className="text-white text-[14px]">
                              {order.refundReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#314158] pt-[16px] flex justify-between items-center">
                    <div className="flex gap-[16px]">
                      <Badge className="bg-[rgba(15,23,43,0.5)] border border-[#314158] text-[#90a1b9]">
                        결제:{" "}
                        {order.paymentStatus ===
                        "paid"
                          ? "완료"
                          : "대기"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-[#90a1b9] text-[14px]">
                        총 결제금액
                      </p>
                      <p className="text-white text-[24px]">
                        {order.totalPrice.toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tracking Number Modal */}
        <Dialog
          open={trackingModalOpen}
          onOpenChange={setTrackingModalOpen}
        >
          <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-white text-[20px]">
                송장번호 등록
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-[20px] mt-[24px]">
              <div className="p-[16px] bg-[rgba(81,162,255,0.1)] border border-[#51a2ff] rounded-[8px]">
                <p className="text-[#51a2ff] text-[14px] mb-[4px]">
                  💡 안내
                </p>
                <p className="text-[#90a1b9] text-[13px]">
                  송장번호 등록 후 배송 상태가
                  '배송중'으로 변경됩니다.
                </p>
              </div>

              <div>
                <p className="text-[#90a1b9] text-[14px] mb-[8px]">
                  송장번호
                </p>
                <Input
                  className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white"
                  placeholder="예: 1234-5678-9012"
                  value={trackingNumber}
                  onChange={(e) =>
                    setTrackingNumber(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex gap-[12px]">
                <Button
                  variant="outline"
                  className="flex-1 border-[#314158] text-white hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setTrackingModalOpen(false);
                    setSelectedOrderId(null);
                    setTrackingNumber("");
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
                  onClick={handleTrackingSubmit}
                >
                  <FileText className="size-[16px] mr-2" />
                  등록 및 배송 시작
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
