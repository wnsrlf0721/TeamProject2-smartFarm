import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#90a1b9] text-[24px] mb-[24px]">
            장바구니가 비어있습니다
          </p>
          <Button
            className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-[16px] mr-2" />
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }

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
            쇼핑 계속하기
          </Button>
          <h1 className="text-white text-[24px]">
            장바구니
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        <div className="grid grid-cols-3 gap-[24px]">
          {/* Cart Items */}
          <div className="col-span-2 space-y-[16px]">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[20px] flex gap-[20px]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[120px] h-[120px] object-cover rounded-[8px]"
                />
                <div className="flex-1">
                  <h3 className="text-white text-[18px] mb-[4px]">
                    {item.category === "device"
                      ? item.name
                      : item.farmName}
                  </h3>
                  <p className="text-[#90a1b9] text-[14px] mb-[8px]">
                    {item.category === "service"
                      ? "타임랩스 촬영 서비스"
                      : item.category === "device"
                      ? item.farmName
                      : item.plant}
                  </p>
                  <p className="text-[#62748e] text-[12px] mb-[16px]">
                    {item.unit}{" "}
                    {item.category === "service"
                      ? "구독"
                      : "기준"}
                  </p>

                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center gap-[8px] bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[8px] p-[4px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/10 h-[32px] w-[32px] p-0"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        <Minus className="size-[16px]" />
                      </Button>
                      <span className="text-white text-[16px] w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/10 h-[32px] w-[32px] p-0"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus className="size-[16px]" />
                      </Button>
                    </div>
                    <p className="text-white text-[20px]">
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                      원
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#ff5555] hover:text-[#ff5555] hover:bg-white/10 self-start"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  <Trash2 className="size-[20px]" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-span-1">
            <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px] sticky top-[24px]">
              <h2 className="text-white text-[20px] mb-[24px]">
                주문 요약
              </h2>

              <div className="space-y-[12px] mb-[24px]">
                <div className="flex justify-between text-[#90a1b9]">
                  <span>상품 수량</span>
                  <span>{totalItems}개</span>
                </div>
                <div className="flex justify-between text-[#90a1b9]">
                  <span>상품 금액</span>
                  <span>
                    {totalPrice.toLocaleString()}
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
                    <span>총 결제금액</span>
                    <span>
                      {totalPrice.toLocaleString()}
                      원
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 h-[48px] text-[16px]"
                onClick={() =>
                  navigate("/checkout")
                }
              >
                주문하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
