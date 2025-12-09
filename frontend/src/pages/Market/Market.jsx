import imgImageWithFallback from "../../assets/297ce7b757354b7f938a0f42102fbc187f5e70c4.png";
import { useAuth } from "../../wooyoung_login/auth/AuthContext";

import { useProducts } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  Package,
  Bell,
  Cpu,
  Video,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function Market() {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const { addToCart, totalItems } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(
      `${product.name}이(가) 장바구니에 추가되었습니다`,
      {
        action: {
          label: "장바구니 보기",
          onClick: () => navigate("/cart"),
        },
      }
    );
  };

  const handleAddTimelapse = (
    farmId,
    farmName
  ) => {
    const timelapseService = {
      id: `timelapse-${farmId}`,
      category: "service",
      name: "타임랩스 촬영 서비스",
      farmName: farmName,
      systemType: "프리미엄 서비스",
      price: 25000,
      unit: "1개월",
      image: imgImageWithFallback,
      description:
        "재배 과정을 타임랩스 영상으로 제공",
    };

    addToCart(timelapseService);
    toast.success(
      "타임랩스 서비스가 장바구니에 추가되었습니다",
      {
        action: {
          label: "장바구니 보기",
          onClick: () => navigate("/cart"),
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-[#1d293d] border-b border-[#314158] z-50">
        <div className="max-w-[1536px] mx-auto px-[192px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <h1 className="text-white text-[24px]">
              스마트팜 마켓
            </h1>
            <Badge className="bg-[#05df72] text-white border-0">
              일반 사용자
            </Badge>
          </div>
          <nav className="flex items-center gap-[24px]">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="size-[20px] mr-2" />
              장바구니
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-[#155dfc] to-[#9810fa] border-0 size-[20px] flex items-center justify-center p-0">
                  {totalItems}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => navigate("/orders")}
            >
              <Package className="size-[20px] mr-2" />
              주문내역
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
            >
              <Bell className="size-[20px] mr-2" />
              알림
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="size-[20px] mr-2" />
              로그아웃
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-[208px] px-[192px] pb-[80px]">
        <div className="grid grid-cols-2 gap-[24px]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddTimelapse={
                product.category === "crop"
                  ? handleAddTimelapse
                  : undefined
              }
            />
          ))}

          {/* Add New Farm Card */}
          <div className="bg-[rgba(29,41,61,0.5)] rounded-[16px] border-2 border-[#45556c] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] h-[374px] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] flex items-center justify-center mb-[16px]">
                <svg
                  className="size-[40px]"
                  fill="none"
                  viewBox="0 0 40 40"
                >
                  <path
                    d="M8.33333 20H31.6667"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.33333"
                  />
                  <path
                    d="M20 8.33333V31.6667"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.33333"
                  />
                </svg>
              </div>
              <p className="text-[#90a1b9] text-[16px] mb-[4px]">
                새로운 팜 추가
              </p>
              <p className="text-[#62748e] text-[14px]">
                클릭하여 팜을 생성하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard(props) {
  const { product, onAddToCart, onAddTimelapse } =
    props;

  if (product.category === "device") {
    return (
      <DeviceCard
        product={product}
        onAddToCart={onAddToCart}
      />
    );
  }

  return (
    <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="h-[160px] relative overflow-clip">
        <img
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          src={product.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,43,0.6)] to-[rgba(0,0,0,0)]" />

        {onAddTimelapse && (
          <button
            className="absolute right-[20px] bottom-[20px] bg-gradient-to-r from-[#155dfc] to-[#9810fa] px-[16px] py-[8px] rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] flex items-center gap-[8px] hover:opacity-90 transition-opacity"
            onClick={() =>
              onAddTimelapse(
                product.id,
                product.farmName
              )
            }
          >
            <Video className="size-[16px] text-white" />
            <span className="text-white text-[14px]">
              타임랩스
            </span>
          </button>
        )}
      </div>

      <div className="p-[20px]">
        <div className="mb-[16px]">
          <h3 className="text-white text-[16px] mb-[4px]">
            {product.farmName}
          </h3>
          <p className="text-[#90a1b9] text-[14px]">
            {product.systemType}
          </p>
        </div>

        <div className="flex gap-[12px] mb-[16px]">
          <div className="flex-1 bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[10px] p-[13px]">
            <p className="text-[#62748e] text-[12px] mb-[4px]">
              식물
            </p>
            <p className="text-[#05df72] text-[14px]">
              {product.plant}
            </p>
          </div>
          <div className="flex-1 bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[10px] p-[13px]">
            <p className="text-[#62748e] text-[12px] mb-[4px]">
              단계
            </p>
            <p className="text-[#51a2ff] text-[14px]">
              {product.stage}
            </p>
          </div>
          <div className="flex-1 bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[10px] p-[13px]">
            <p className="text-[#62748e] text-[12px] mb-[4px]">
              재배일
            </p>
            <p className="text-[#c27aff] text-[14px]">
              {product.days}일
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-[20px]">
              {product.price.toLocaleString()}원
            </p>
            <p className="text-[#90a1b9] text-[12px]">
              {product.unit} 기준
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="size-[16px] mr-2" />
            장바구니 담기
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeviceCard(props) {
  const { product, onAddToCart } = props;

  return (
    <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="h-[160px] relative overflow-clip">
        <img
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          src={product.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,43,0.6)] to-[rgba(0,0,0,0)]" />

        <div className="absolute top-[20px] left-[20px]">
          <Badge className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white border-0">
            <Cpu className="size-[14px] mr-1" />
            Nova 기기
          </Badge>
        </div>
      </div>

      <div className="p-[20px]">
        <div className="mb-[16px]">
          <h3 className="text-white text-[16px] mb-[4px]">
            {product.name}
          </h3>
          <p className="text-[#90a1b9] text-[14px]">
            {product.farmName}
          </p>
        </div>

        {product.description && (
          <p className="text-[#62748e] text-[13px] mb-[12px] leading-relaxed">
            {product.description}
          </p>
        )}

        {product.specs && (
          <div className="grid grid-cols-2 gap-[8px] mb-[16px]">
            {product.specs.map((spec, index) => (
              <div
                key={index}
                className="bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[8px] px-[10px] py-[6px] flex items-center gap-[6px]"
              >
                <div className="size-[4px] rounded-full bg-[#51a2ff]" />
                <p className="text-[#90a1b9] text-[12px]">
                  {spec}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-[20px]">
              {product.price.toLocaleString()}원
            </p>
            <p className="text-[#90a1b9] text-[12px]">
              {product.unit}
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 rounded-[10px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="size-[16px] mr-2" />
            장바구니 담기
          </Button>
        </div>
      </div>
    </div>
  );
}
