import {
  useParams,
  useNavigate,
} from "react-router";

import { Button } from "../../components/market/ui/button";
import { toast } from "sonner";
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
import "./OrderTracking.css";

import { useEffect, useState } from "react";
import { getOrderDetail } from "../../api/order/orderApi";

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
  const { orderId } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetail = async () => {
      try {
        const data = await getOrderDetail(
          orderId
        );
        // id를 항상 통일
        setOrder({
          ...data,
          id: data.orderUid, // orderUid → id로 통일
          createdAt: new Date(data.createdAt),
          estimatedDelivery:
            data.estimatedDelivery
              ? new Date(data.estimatedDelivery)
              : null,
        });
      } catch (error) {
        toast.error(
          "주문 정보를 불러오지 못했습니다"
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (!order) {
    return (
      <div className="order-tracking-page empty-state">
        <div className="empty-state-inner">
          <p className="empty-message">
            주문을 찾을 수 없습니다
          </p>
          <Button
            className="empty-return-btn"
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
    <div className="order-tracking-page">
      {/* Header */}
      <header className="order-tracking-header">
        <div className="order-tracking-header-inner">
          <Button
            variant="ghost"
            className="order-back-btn"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={20} />
            주문 내역으로
          </Button>

          <h1 className="order-tracking-title">
            배송 추적
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="content-container">
        <div className="content-stack">
          {/* Order Info */}
          <div className="feature-card">
            <div className="order-info-header">
              <div>
                <h2 className="order-info-id">
                  주문번호: {order.id}
                </h2>
                <p className="order-info-date">
                  주문일시:{" "}
                  {order.createdAt.toLocaleString(
                    "ko-KR"
                  )}
                </p>
              </div>

              {order.estimatedDelivery && (
                <div className="order-estimated">
                  <p className="order-info-date">
                    도착 예정
                  </p>
                  <p className="order-estimated-value">
                    {order.estimatedDelivery.toLocaleDateString(
                      "ko-KR"
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Tracking Steps */}
            <div className="tracking-steps-wrapper">
              <div className="tracking-line-background" />
              <div
                className="tracking-line-progress"
                style={{
                  width: `${
                    (currentStepIndex /
                      (trackingSteps.length -
                        1)) *
                    100
                  }%`,
                }}
              />

              <div className="tracking-steps-flex">
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
                        className="step-item"
                      >
                        <div
                          className={`step-icon hover-scale ${
                            isCompleted
                              ? "step-icon-active"
                              : "step-icon-inactive"
                          }`}
                        >
                          <StepIcon className="step-icon-svg" />
                        </div>

                        <p
                          className={`step-label ${
                            isCurrent
                              ? "step-label-current"
                              : ""
                          }`}
                        >
                          {step.label}
                        </p>

                        {isCurrent && (
                          <div className="step-current-dot" />
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
            <div className="section-card">
              <div className="invoice-wrapper">
                <div className="invoice-icon">
                  <FileText className="invoice-icon-svg" />
                </div>

                <div className="flex-1">
                  <h3 className="invoice-title">
                    송장번호
                  </h3>

                  <div className="invoice-row">
                    <code className="invoice-code">
                      {order.trackingNumber}
                    </code>

                    <Button
                      variant="outline"
                      size="sm"
                      className="invoice-copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          order.trackingNumber
                        );
                        toast.success(
                          "송장번호가 복사되었습니다"
                        );
                      }}
                    >
                      <Copy className="invoice-copy-icon" />
                    </Button>
                  </div>

                  <p className="invoice-help">
                    택배사 웹사이트에서 배송
                    조회가 가능합니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="section-card hover-scale">
            <div className="delivery-info-wrapper">
              <div className="delivery-icon">
                <MapPin className="delivery-icon-svg" />
              </div>

              <div className="flex-1">
                <h3 className="delivery-title">
                  배송지: {order.deliveryAddress}
                </h3>

                <h3 className="delivery-title">
                  연락처: {order.phoneNumber}
                </h3>

                <h3 className="delivery-title">
                  수령인: {order.recipientName}
                </h3>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="section-card hover-scale">
            <h3 className="order-items-title">
              주문 상품
            </h3>

            <div className="order-items-list">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="order-item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-image"
                  />

                  <div className="flex-1">
                    <p className="order-item-name">
                      {item.name} :{" "}
                      {item.quantity}개
                    </p>

                    <p className="order-item-desc">
                      {item.category}
                      {item.description}
                      {item.plant}
                    </p>
                  </div>

                  <div className="order-item-price">
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                    원
                  </div>
                </div>
              ))}
            </div>

            <div className="total-price-row">
              <p className="total-price-label">
                총 결제금액
              </p>
              <p className="total-price-value">
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
