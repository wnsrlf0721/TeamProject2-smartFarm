import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useOrders } from "../../contexts/OrderContext";
import { useReviews } from "../../contexts/ReviewContext";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ReviewModal } from "../../components/ReviewModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
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

/**
 * @typedef {Object} ProductInfo
 * @property {string} id
 * @property {string} name
 * @property {string} orderId
 */

const statusConfig = {
  pending: {
    label: "주문 대기",
    color: "bg-[#90a1b9]",
    icon: Clock,
  },
  processing: {
    label: "상품 준비중",
    color: "bg-[#51a2ff]",
    icon: Package,
  },
  shipping: {
    label: "배송중",
    color: "bg-[#c27aff]",
    icon: Truck,
  },
  delivered: {
    label: "배송 완료",
    color: "bg-[#05df72]",
    icon: CheckCircle,
  },
  confirmed: {
    label: "주문 확정",
    color: "bg-[#16a34a]",
    icon: CheckCircle,
  },
  cancelled: {
    label: "주문 취소",
    color: "bg-[#ff5555]",
    icon: Clock,
  },
  refund_requested: {
    label: "환불 요청",
    color: "bg-[#ffa500]",
    icon: RotateCcw,
  },
  refunded: {
    label: "환불 완료",
    color: "bg-[#62748e]",
    icon: RotateCcw,
  },
};

export default function OrderHistory() {
  const { user } = useAuth();
  const { orders, requestRefund, confirmOrder } =
    useOrders();
  const { canReview, addReview } = useReviews();
  const navigate = useNavigate();

  /** @type {[boolean, Function]} */
  const [reviewModalOpen, setReviewModalOpen] =
    useState(false);

  /** @type {[boolean, Function]} */
  const [refundModalOpen, setRefundModalOpen] =
    useState(false);

  /** @type {[ProductInfo|null, Function]} */
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /** @type {[string|null, Function]} */
  const [
    selectedOrderForRefund,
    setSelectedOrderForRefund,
  ] = useState(null);

  /** @type {[string, Function]} */
  const [refundReason, setRefundReason] =
    useState("");

  /**
   * @param {number} rating
   * @param {string} comment
   */
  const handleReviewSubmit = (
    rating,
    comment
  ) => {
    if (!selectedProduct || !user) return;

    addReview({
      productId: selectedProduct.id,
      userId: user.id,
      userName: user.name,
      orderId: selectedProduct.orderId,
      rating,
      comment,
    });

    toast.success("리뷰가 등록되었습니다");
    setSelectedProduct(null);
  };

  const handleRefundRequest = () => {
    if (
      !selectedOrderForRefund ||
      !refundReason.trim()
    ) {
      toast.error("환불 사유를 입력해주세요");
      return;
    }

    requestRefund(
      selectedOrderForRefund,
      refundReason
    );
    toast.success("환불 요청이 접수되었습니다");
    setRefundModalOpen(false);
    setSelectedOrderForRefund(null);
    setRefundReason("");
  };

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1200px] mx-auto px-[24px] h-[80px] flex items-center">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10 mr-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            홈으로
          </Button>
          <h1 className="text-white text-[24px]">
            주문 내역
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        {orders.length === 0 ? (
          <div className="text-center py-[120px]">
            <Package className="size-[64px] text-[#314158] mx-auto mb-[24px]" />
            <p className="text-[#90a1b9] text-[20px] mb-[8px]">
              주문 내역이 없습니다
            </p>
            <p className="text-[#62748e] text-[14px] mb-[24px]">
              스마트팜 신선 작물을 주문해보세요
            </p>
            <Button
              className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
              onClick={() => navigate("/")}
            >
              쇼핑하러 가기
            </Button>
          </div>
        ) : (
          <div className="space-y-[24px]">
            {orders.map((order) => {
              const status =
                statusConfig[order.status];
              const StatusIcon = status.icon;

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
                        <StatusIcon className="size-[14px] mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      className="border-[#314158] text-white hover:text-white hover:bg-white/10"
                      onClick={() =>
                        navigate(
                          `/tracking/${order.id}`
                        )
                      }
                    >
                      배송 추적
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-[16px] mb-[20px]">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-[12px]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[80px] h-[80px] object-cover rounded-[8px]"
                        />
                        <div className="flex-1">
                          <p className="text-white text-[14px] mb-[4px]">
                            {item.category ===
                            "device"
                              ? item.name
                              : item.category ===
                                "service"
                              ? "타임랩스"
                              : item.plant}
                          </p>
                          <p className="text-[#90a1b9] text-[12px] mb-[4px]">
                            {item.quantity}개
                          </p>
                          <p className="text-white text-[14px]">
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

                  <div className="border-t border-[#314158] pt-[16px]">
                    <div className="flex justify-between items-center mb-[16px]">
                      <div className="text-[#90a1b9] text-[14px]">
                        <p>
                          주문일시:{" "}
                          {order.createdAt.toLocaleString(
                            "ko-KR"
                          )}
                        </p>
                        {order.estimatedDelivery && (
                          <p>
                            도착 예정:{" "}
                            {order.estimatedDelivery.toLocaleDateString(
                              "ko-KR"
                            )}
                          </p>
                        )}
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

                    {/* Action Buttons */}
                    {order.status ===
                      "delivered" && (
                      <div className="flex gap-[12px] flex-wrap">
                        <Button
                          className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534]"
                          onClick={() => {
                            confirmOrder(
                              order.id
                            );
                            toast.success(
                              "주문이 확정되었습니다"
                            );
                          }}
                        >
                          <CheckCircle className="size-[16px] mr-2" />
                          주문 확정
                        </Button>

                        {order.items.map(
                          (item) => {
                            const canWriteReview =
                              user &&
                              canReview(
                                user.id,
                                item.id,
                                order.id
                              );

                            return canWriteReview ? (
                              <Button
                                key={item.id}
                                variant="outline"
                                className="border-[#314158] text-white hover:text-white hover:bg-white/10"
                                onClick={() => {
                                  setSelectedProduct(
                                    {
                                      id: item.id,
                                      name:
                                        item.category ===
                                        "device"
                                          ? item.name
                                          : item.plant ||
                                            item.name,
                                      orderId:
                                        order.id,
                                    }
                                  );
                                  setReviewModalOpen(
                                    true
                                  );
                                }}
                              >
                                <Star className="size-[16px] mr-2" />
                                {item.category ===
                                "device"
                                  ? item.name
                                  : item.plant}{" "}
                                리뷰 작성
                              </Button>
                            ) : null;
                          }
                        )}

                        {order.paymentStatus !==
                          "refunded" &&
                          !order.refundReason && (
                            <Button
                              variant="outline"
                              className="border-[#ff5555] text-[#ff5555] hover:text-[#ff5555] hover:bg-[#ff5555]/10"
                              onClick={() => {
                                setSelectedOrderForRefund(
                                  order.id
                                );
                                setRefundModalOpen(
                                  true
                                );
                              }}
                            >
                              <RotateCcw className="size-[16px] mr-2" />
                              환불 요청
                            </Button>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {selectedProduct && (
          <ReviewModal
            isOpen={reviewModalOpen}
            onClose={() => {
              setReviewModalOpen(false);
              setSelectedProduct(null);
            }}
            productName={selectedProduct.name}
            onSubmit={handleReviewSubmit}
          />
        )}

        {/* Refund Modal */}
        <Dialog
          open={refundModalOpen}
          onOpenChange={setRefundModalOpen}
        >
          <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-white text-[20px]">
                환불 요청
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-[20px] mt-[24px]">
              <div className="p-[16px] bg-[rgba(255,85,85,0.1)] border border-[#ff5555] rounded-[8px]">
                <p className="text-[#ff5555] text-[14px]">
                  ⚠️ 환불 안내
                </p>
                <p className="text-[#90a1b9] text-[13px] mt-[8px]">
                  환불 요청 후 관리자 승인이
                  필요합니다. 승인 후 3-5 영업일
                  내 환불이 완료됩니다.
                </p>
              </div>

              <div>
                <p className="text-[#90a1b9] text-[14px] mb-[8px]">
                  환불 사유
                </p>
                <Textarea
                  className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white min-h-[100px]"
                  placeholder="환불 사유를 상세히 입력해주세요"
                  value={refundReason}
                  onChange={(e) =>
                    setRefundReason(
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
                    setRefundModalOpen(false);
                    setSelectedOrderForRefund(
                      null
                    );
                    setRefundReason("");
                  }}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-[#ff5555] text-white hover:bg-[#ff5555]/90"
                  onClick={handleRefundRequest}
                >
                  환불 요청
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
