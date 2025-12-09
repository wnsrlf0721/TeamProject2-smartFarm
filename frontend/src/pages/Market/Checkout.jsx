import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useOrders } from "../../contexts/OrderContext";
import { useNotifications } from "../../contexts/NotificationContext";
import {
  useNavigate,
  useLocation,
} from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PaymentModal } from "../../components/PaymentModal";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } =
    useCart();
  const { createOrder } = useOrders();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  // JSDoc으로 directBuyItem 타입 의미 유지
  /** @type {any | undefined} */
  const directBuyItem =
    location.state?.directBuyItem;

  const checkoutItems = directBuyItem
    ? [directBuyItem]
    : items;
  const checkoutTotalPrice = directBuyItem
    ? directBuyItem.price * directBuyItem.quantity
    : totalPrice;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    detailAddress: user?.detailAddress || "",
    message: "",
  });

  // TypeScript union 삭제 → JS 문자열 상태 관리
  const [paymentMethod, setPaymentMethod] =
    useState("kakaopay");
  const [
    isPaymentModalOpen,
    setIsPaymentModalOpen,
  ] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error(
        "필수 정보를 모두 입력해주세요"
      );
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    const fullAddress =
      `${formData.address} ${formData.detailAddress}`.trim();
    const order = createOrder(
      checkoutItems,
      checkoutTotalPrice,
      fullAddress,
      formData.phone,
      paymentMethod
    );

    clearCart();
    setIsPaymentModalOpen(false);

    toast.success("주문이 완료되었습니다!", {
      description: `주문번호: ${order.id}`,
    });

    setTimeout(() => {
      toast.info("결제가 완료되었습니다", {
        description: `${checkoutTotalPrice.toLocaleString()}원이 결제되었습니다`,
      });
    }, 500);

    navigate(`/tracking/${order.id}`);
  };

  if (checkoutItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1200px] mx-auto px-[24px] h-[80px] flex items-center">
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10 mr-4"
            onClick={() => navigate("/cart")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            장바구니로 돌아가기
          </Button>
          <h1 className="text-white text-[24px]">
            주문/결제
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        <div className="grid grid-cols-3 gap-[24px]">
          {/* Checkout Form */}
          <form
            className="col-span-2 space-y-[24px]"
            onSubmit={handleSubmit}
          >
            {/* Delivery Info */}
            <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
              <h2 className="text-white text-[20px] mb-[24px]">
                배송 정보
              </h2>

              <div className="space-y-[16px]">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-[#90a1b9]"
                  >
                    받는 분
                  </Label>
                  <Input
                    id="name"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-[#90a1b9]"
                  >
                    연락처
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="address"
                    className="text-[#90a1b9]"
                  >
                    주소
                  </Label>
                  <Input
                    id="address"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="detailAddress"
                    className="text-[#90a1b9]"
                  >
                    상세 주소
                  </Label>
                  <Input
                    id="detailAddress"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={formData.detailAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        detailAddress:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label
                    htmlFor="message"
                    className="text-[#90a1b9]"
                  >
                    배송 메시지
                  </Label>
                  <Input
                    id="message"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    placeholder="문 앞에 놓아주세요"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
              <h2 className="text-white text-[20px] mb-[24px]">
                결제 수단
              </h2>
              <div className="space-y-[12px]">
                <div
                  className={`flex items-center gap-[12px] p-[16px] rounded-[8px] cursor-pointer transition-colors ${
                    paymentMethod === "kakaopay"
                      ? "bg-[rgba(254,229,0,0.2)] border-2 border-[#FEE500]"
                      : "bg-[rgba(15,23,43,0.5)] border border-[#314158]"
                  }`}
                  onClick={() =>
                    setPaymentMethod("kakaopay")
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    id="kakaopay"
                    checked={
                      paymentMethod === "kakaopay"
                    }
                    onChange={() =>
                      setPaymentMethod("kakaopay")
                    }
                    className="accent-[#FEE500]"
                  />
                  <Label
                    htmlFor="kakaopay"
                    className="text-white cursor-pointer flex-1 flex items-center gap-[8px]"
                  >
                    <span className="text-[20px]">
                      💬
                    </span>
                    카카오페이
                  </Label>
                </div>

                <div
                  className={`flex items-center gap-[12px] p-[16px] rounded-[8px] cursor-pointer transition-colors ${
                    paymentMethod === "tosspay"
                      ? "bg-[rgba(0,100,255,0.2)] border-2 border-[#0064FF]"
                      : "bg-[rgba(15,23,43,0.5)] border border-[#314158]"
                  }`}
                  onClick={() =>
                    setPaymentMethod("tosspay")
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    id="tosspay"
                    checked={
                      paymentMethod === "tosspay"
                    }
                    onChange={() =>
                      setPaymentMethod("tosspay")
                    }
                    className="accent-[#0064FF]"
                  />
                  <Label
                    htmlFor="tosspay"
                    className="text-white cursor-pointer flex-1 flex items-center gap-[8px]"
                  >
                    <span className="text-[#0064FF] text-[16px] font-bold">
                      toss
                    </span>
                    토스페이
                  </Label>
                </div>
              </div>
            </div>
          </form>

          {/* Payment Modal */}
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() =>
              setIsPaymentModalOpen(false)
            }
            amount={checkoutTotalPrice}
            paymentMethod={paymentMethod}
            onSuccess={handlePaymentSuccess}
          />

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px] sticky top-[24px]">
              <h2 className="text-white text-[20px] mb-[24px]">
                주문 상품
              </h2>

              <div className="space-y-[12px] mb-[24px] max-h-[300px] overflow-y-auto">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-[12px] pb-[12px] border-b border-[#314158]"
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
                          ? "타임랩스 서비스"
                          : item.plant}
                      </p>
                      <p className="text-[#90a1b9] text-[12px]">
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

              <div className="space-y-[12px] mb-[24px]">
                <div className="flex justify-between text-[#90a1b9]">
                  <span>상품 금액</span>
                  <span>
                    {checkoutTotalPrice.toLocaleString()}
                    원
                  </span>
                </div>

                <div className="flex justify-between text-[#90a1b9]">
                  <span>배송비</span>
                  <span className="text-[#05df72]">
                    무료
                  </span>
                </div>

                <div className="border-t border-[#314158] pt-[12px] mt-[12px]">
                  <div className="flex justify-between text-white text-[20px]">
                    <span>최종 결제금액</span>
                    <span>
                      {checkoutTotalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 h-[48px] text-[16px]"
                onClick={handleSubmit}
              >
                {checkoutTotalPrice.toLocaleString()}
                원 결제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
