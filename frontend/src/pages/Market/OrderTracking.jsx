import {
  useParams,
  useNavigate,
} from "react-router";
import { useOrders } from "../../contexts/OrderContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  MapPin,
  FileText,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} TrackingStep
 * @property {string} status
 * @property {string} label
 * @property {React.ElementType} icon
 */

/** @type {TrackingStep[]} */
const trackingSteps = [
  {
    status: "pending",
    label: "주문 접수",
    icon: Clock,
  },
  {
    status: "processing",
    label: "상품 준비중",
    icon: Package,
  },
  {
    status: "shipping",
    label: "배송중",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "배송 완료",
    icon: CheckCircle,
  },
];

export default function OrderTracking() {
  /** @type {{ orderId?: string }} */
  const { orderId } = useParams();

  const { getOrderById } = useOrders();
  const navigate = useNavigate();

  const order = orderId
    ? getOrderById(orderId)
    : undefined;

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#90a1b9] text-[24px] mb-[24px]">
            주문을 찾을 수 없습니다
          </p>
          <Button
            className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
            onClick={() => navigate("/orders")}
          >
            주문 내역으로 이동
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex =
    trackingSteps.findIndex(
      (step) => step.status === order.status
    );

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1200px] mx-auto px-[24px] h-[80px] flex items-center">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10 mr-4"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            주문 내역으로
          </Button>
          <h1 className="text-white text-[24px]">
            배송 추적
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        <div className="space-y-[24px]">
          {/* Order Info */}
          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex justify-between items-start mb-[24px]">
              <div>
                <h2 className="text-white text-[20px] mb-[8px]">
                  주문번호: {order.id}
                </h2>
                <p className="text-[#90a1b9] text-[14px]">
                  주문일시:{" "}
                  {order.createdAt.toLocaleString(
                    "ko-KR"
                  )}
                </p>
              </div>
              {order.estimatedDelivery && (
                <div className="text-right">
                  <p className="text-[#90a1b9] text-[14px]">
                    도착 예정
                  </p>
                  <p className="text-white text-[18px]">
                    {order.estimatedDelivery.toLocaleDateString(
                      "ko-KR"
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Tracking Steps */}
            <div className="relative">
              <div className="absolute top-[20px] left-0 right-0 h-[2px] bg-[#314158]" />
              <div
                className="absolute top-[20px] left-0 h-[2px] bg-gradient-to-r from-[#155dfc] to-[#9810fa] transition-all duration-500"
                style={{
                  width: `${
                    (currentStepIndex /
                      (trackingSteps.length -
                        1)) *
                    100
                  }%`,
                }}
              />

              <div className="relative flex justify-between">
                {trackingSteps.map(
                  (step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted =
                      index <= currentStepIndex;
                    const isCurrent =
                      index === currentStepIndex;

                    return (
                      <div
                        key={step.status}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`size-[40px] rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? "bg-gradient-to-r from-[#155dfc] to-[#9810fa] border-transparent"
                              : "bg-[#1d293d] border-[#314158]"
                          }`}
                        >
                          <StepIcon
                            className={`size-[20px] ${
                              isCompleted
                                ? "text-white"
                                : "text-[#62748e]"
                            }`}
                          />
                        </div>
                        <p
                          className={`mt-[12px] text-[14px] ${
                            isCurrent
                              ? "text-white"
                              : isCompleted
                              ? "text-[#90a1b9]"
                              : "text-[#62748e]"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <div className="mt-[4px] w-[6px] h-[6px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa]" />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
              <div className="flex items-start gap-[16px]">
                <div className="size-[48px] rounded-full bg-[rgba(194,122,255,0.2)] border border-[#c27aff] flex items-center justify-center shrink-0">
                  <FileText className="size-[24px] text-[#c27aff]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-[18px] mb-[8px]">
                    송장번호
                  </h3>
                  <div className="flex items-center gap-[12px]">
                    <code className="text-[#51a2ff] text-[20px] font-mono bg-[rgba(15,23,43,0.5)] px-[16px] py-[8px] rounded-[8px]">
                      {order.trackingNumber}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#314158] text-white hover:text-white hover:bg-white/10"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          order.trackingNumber
                        );
                        toast.success(
                          "송장번호가 복사되었습니다"
                        );
                      }}
                    >
                      <Copy className="size-[16px]" />
                    </Button>
                  </div>
                  <p className="text-[#62748e] text-[12px] mt-[8px]">
                    택배사 웹사이트에서 배송
                    조회가 가능합니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex items-start gap-[16px]">
              <div className="size-[48px] rounded-full bg-[rgba(15,23,43,0.5)] border border-[#314158] flex items-center justify-center shrink-0">
                <MapPin className="size-[24px] text-[#51a2ff]" />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-[18px] mb-[8px]">
                  배송지 정보
                </h3>
                <p className="text-[#90a1b9] text-[14px] mb-[4px]">
                  {order.deliveryAddress}
                </p>
                <p className="text-[#90a1b9] text-[14px]">
                  연락처: {order.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <h3 className="text-white text-[18px] mb-[16px]">
              주문 상품
            </h3>
            <div className="space-y-[16px]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-[16px] pb-[16px] border-b border-[#314158] last:border-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[80px] h-[80px] object-cover rounded-[8px]"
                  />
                  <div className="flex-1">
                    <p className="text-white text-[16px] mb-[4px]">
                      {item.category === "device"
                        ? item.name
                        : item.farmName}
                    </p>
                    <p className="text-[#90a1b9] text-[14px] mb-[4px]">
                      {item.category === "service"
                        ? "타임랩스 촬영 서비스"
                        : item.category ===
                          "device"
                        ? item.description
                        : item.plant}
                    </p>
                    <p className="text-[#62748e] text-[12px]">
                      {item.unit} ×{" "}
                      {item.quantity}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-[18px]">
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                      원
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#314158] mt-[16px] pt-[16px] flex justify-between items-center">
              <p className="text-[#90a1b9] text-[16px]">
                총 결제금액
              </p>
              <p className="text-white text-[24px]">
                {order.totalPrice.toLocaleString()}
                원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
