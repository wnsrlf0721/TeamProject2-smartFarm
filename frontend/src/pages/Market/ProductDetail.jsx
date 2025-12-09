import { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductContext";
import { useReviews } from "../../contexts/ReviewContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Package,
  Truck,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {string} image
 * @property {number} price
 * @property {string} category
 * @property {string} [farmName]
 * @property {string} [plant]
 * @property {number} quantity
 */

export default function ProductDetail() {
  /** @type {{ productId?: string }} */
  const params = useParams();
  const { productId } = params;

  const { getProductById } = useProducts();
  const { getReviewsByProductId } = useReviews();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  /** @type {[number, Function]} */
  const [quantity, setQuantity] = useState(1);

  const product = productId
    ? getProductById(productId)
    : undefined;
  const reviews = productId
    ? getReviewsByProductId(productId)
    : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#4ade80] text-[24px] mb-[24px]">
            상품을 찾을 수 없습니다
          </p>
          <Button
            className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  const showStock =
    product.stock !== undefined &&
    (user?.role === "admin" ||
      (user?.role === "user" &&
        product.stock <= 10));

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다", {
        action: {
          label: "로그인",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    addToCart(product, quantity);
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다", {
        action: {
          label: "로그인",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    /** @type {CartItem} */
    const tempCartItem = {
      ...product,
      quantity,
    };

    navigate("/checkout", {
      state: { directBuyItem: tempCartItem },
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-[#0a1f0a]">
      {/* Header */}
      <header className="bg-[#0f2e0f] border-b border-[#1a4d1a]">
        <div className="max-w-[1200px] mx-auto px-[24px] h-[80px] flex items-center">
          <Button
            variant="ghost"
            className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-[20px] mr-2" />
            목록으로
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        <div className="grid grid-cols-2 gap-[48px] mb-[48px]">
          {/* Image */}
          <div className="rounded-[20px] overflow-hidden border border-[#1a4d1a] group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Info */}
          <div>
            <div className="mb-[24px]">
              <Badge
                className={`mb-[16px] ${
                  product.category === "crop"
                    ? "bg-[#16a34a]"
                    : product.category ===
                      "device"
                    ? "bg-[#fbbf24]"
                    : "bg-[#8b5cf6]"
                } text-white border-0`}
              >
                {product.category === "crop"
                  ? "🌱 작물"
                  : product.category === "device"
                  ? "⚙️ 기기"
                  : "📹 서비스"}
              </Badge>

              <h1 className="text-[#4ade80] text-[36px] mb-[8px]">
                {product.category === "device"
                  ? product.name
                  : product.farmName}
              </h1>

              <p className="text-[#16a34a] text-[20px]">
                {product.category === "device"
                  ? product.farmName
                  : product.plant}
              </p>
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-[8px] mb-[24px]">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-[20px] ${
                        star <= averageRating
                          ? "fill-[#fbbf24] text-[#fbbf24]"
                          : "text-[#1a4d1a]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#4ade80] text-[16px]">
                  {averageRating.toFixed(1)} (
                  {reviews.length}개 리뷰)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-[32px] p-[24px] bg-[#0f2e0f] border border-[#1a4d1a] rounded-[16px]">
              <p className="text-white text-[40px] font-bold">
                {product.price.toLocaleString()}원
              </p>
              <p className="text-[#16a34a] text-[14px]">
                {product.unit} 기준
              </p>

              {showStock &&
                product.stock !== undefined && (
                  <div
                    className={`mt-[12px] flex items-center gap-[8px] p-[8px] rounded-[8px] ${
                      product.stock <= 3
                        ? "bg-[rgba(255,85,85,0.1)] border border-[#ff5555]"
                        : product.stock <= 10
                        ? "bg-[rgba(251,191,36,0.1)] border border-[#fbbf24]"
                        : "bg-[rgba(74,222,128,0.1)] border border-[#4ade80]"
                    }`}
                  >
                    <AlertCircle
                      className={`size-[16px] ${
                        product.stock <= 3
                          ? "text-[#ff5555]"
                          : product.stock <= 10
                          ? "text-[#fbbf24]"
                          : "text-[#4ade80]"
                      }`}
                    />
                    <p
                      className={`text-[14px] ${
                        product.stock <= 3
                          ? "text-[#ff5555]"
                          : product.stock <= 10
                          ? "text-[#fbbf24]"
                          : "text-[#4ade80]"
                      }`}
                    >
                      재고: {product.stock}개
                    </p>
                  </div>
                )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-[32px]">
                <h3 className="text-[#4ade80] text-[18px] mb-[12px]">
                  상품 설명
                </h3>
                <p className="text-[#16a34a] text-[16px] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specs */}
            {product.specs && (
              <div className="mb-[32px]">
                <h3 className="text-[#4ade80] text-[18px] mb-[12px]">
                  제품 사양
                </h3>
                <div className="grid grid-cols-2 gap-[12px]">
                  {product.specs.map(
                    (spec, index) => (
                      <div
                        key={index}
                        className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] px-[16px] py-[12px] flex items-center gap-[8px] hover:border-[#22c55e] transition-all"
                      >
                        <div className="size-[6px] rounded-full bg-[#16a34a]" />
                        <p className="text-[#4ade80] text-[14px]">
                          {spec}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Crop Info */}
            {product.category === "crop" && (
              <div className="mb-[32px]">
                <h3 className="text-[#4ade80] text-[18px] mb-[12px]">
                  재배 정보
                </h3>
                <div className="grid grid-cols-3 gap-[12px]">
                  <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px]">
                    <p className="text-[#16a34a] text-[12px] mb-[4px]">
                      식물
                    </p>
                    <p className="text-[#4ade80] text-[16px]">
                      {product.plant}
                    </p>
                  </div>
                  <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px]">
                    <p className="text-[#16a34a] text-[12px] mb-[4px]">
                      단계
                    </p>
                    <p className="text-[#4ade80] text-[16px]">
                      {product.stage}
                    </p>
                  </div>
                  <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px]">
                    <p className="text-[#16a34a] text-[12px] mb-[4px]">
                      재배일
                    </p>
                    <p className="text-[#4ade80] text-[16px]">
                      {product.days}일
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            {isAuthenticated && (
              <div className="flex gap-[16px] items-center mb-[24px]">
                <div className="flex items-center gap-[12px] bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] px-[16px] py-[12px]">
                  <button
                    className="text-[#4ade80] hover:text-[#22c55e] transition-colors"
                    onClick={() =>
                      setQuantity(
                        Math.max(1, quantity - 1)
                      )
                    }
                  >
                    -
                  </button>
                  <span className="text-white text-[18px] w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    className="text-[#4ade80] hover:text-[#22c55e] transition-colors"
                    onClick={() =>
                      setQuantity(quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <Button
                  className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] h-[48px] text-[16px]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="size-[20px] mr-2" />
                  장바구니 담기
                </Button>

                <Button
                  className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] h-[48px] text-[16px]"
                  onClick={handleBuyNow}
                >
                  <ShoppingCart className="size-[20px] mr-2" />
                  바로 구매
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-[12px]">
              <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px] text-center hover:border-[#22c55e] transition-all">
                <Package className="size-[24px] text-[#16a34a] mx-auto mb-[8px]" />
                <p className="text-[#4ade80] text-[12px]">
                  빠른 배송
                </p>
              </div>
              <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px] text-center hover:border-[#22c55e] transition-all">
                <Truck className="size-[24px] text-[#16a34a] mx-auto mb-[8px]" />
                <p className="text-[#4ade80] text-[12px]">
                  무료 배송
                </p>
              </div>
              <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px] text-center hover:border-[#22c55e] transition-all">
                <Shield className="size-[24px] text-[#16a34a] mx-auto mb-[8px]" />
                <p className="text-[#4ade80] text-[12px]">
                  품질 보증
                </p>
              </div>
              <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[12px] p-[16px] text-center hover:border-[#22c55e] transition-all">
                <Zap className="size-[24px] text-[#16a34a] mx-auto mb-[8px]" />
                <p className="text-[#4ade80] text-[12px]">
                  고속 충전
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-[#0f2e0f] border border-[#1a4d1a] rounded-[20px] p-[32px]">
            <h2 className="text-[#4ade80] text-[24px] mb-[24px]">
              상품 리뷰 ({reviews.length})
            </h2>

            <div className="space-y-[24px]">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-[#1a4d1a] pb-[24px] last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-[12px]">
                    <div>
                      <p className="text-white text-[16px]">
                        {review.userName}
                      </p>
                      <div className="flex mt-[4px]">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              className={`size-[16px] ${
                                star <=
                                review.rating
                                  ? "fill-[#fbbf24] text-[#fbbf24]"
                                  : "text-[#1a4d1a]"
                              }`}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <p className="text-[#16a34a] text-[14px]">
                      {review.createdAt.toLocaleDateString(
                        "ko-KR"
                      )}
                    </p>
                  </div>

                  <p className="text-[#4ade80] text-[15px] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
