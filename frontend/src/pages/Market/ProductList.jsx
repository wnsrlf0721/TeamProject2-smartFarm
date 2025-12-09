import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  Package,
  Bell,
  LogOut,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

/**
 * @typedef {import("../contexts/CartContext").Product} Product
 */

export default function ProductList() {
  const { user, logout, isAuthenticated } =
    useAuth();
  const { products } = useProducts();
  const { addToCart, totalItems } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  /** @type {[string, Function]} */
  const [searchQuery, setSearchQuery] =
    useState("");

  /**
   * @typedef {'all' | 'crop' | 'device' | 'service'} CategoryType
   * @type {[CategoryType, Function]}
   */
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  /**
   * @param {Product} product
   */
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다", {
        action: {
          label: "로그인",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

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

  const filteredProducts = products.filter(
    (product) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.farmName
          .toLowerCase()
          .includes(q) ||
        (product.plant &&
          product.plant
            .toLowerCase()
            .includes(q));

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  const categories = [
    {
      id: "all",
      label: "전체",
      count: products.length,
    },
    {
      id: "crop",
      label: "작물",
      count: products.filter(
        (p) => p.category === "crop"
      ).length,
    },
    {
      id: "device",
      label: "기기",
      count: products.filter(
        (p) => p.category === "device"
      ).length,
    },
    {
      id: "service",
      label: "서비스",
      count: products.filter(
        (p) => p.category === "service"
      ).length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a1f0a]">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-[#0f2e0f] border-b border-[#1a4d1a] z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-[1536px] mx-auto px-[48px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <h1
              className="text-[#4ade80] text-[24px] font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              🌱 스마트팜 마켓
            </h1>

            {isAuthenticated &&
              user?.role === "user" && (
                <Badge className="bg-[#16a34a] text-white border-0 hover:bg-[#15803d] transition-colors">
                  일반 사용자
                </Badge>
              )}

            {isAuthenticated &&
              user?.role === "admin" && (
                <Badge className="bg-[#fbbf24] text-[#0a1f0a] border-0 hover:bg-[#f59e0b] transition-colors">
                  관리자
                </Badge>
              )}
          </div>

          <nav className="flex items-center gap-[24px]">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Button
                    variant="ghost"
                    className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20 transition-all"
                    onClick={() =>
                      navigate("/admin")
                    }
                  >
                    <Package className="size-[20px] mr-2" />
                    관리자
                  </Button>
                )}

                {user?.role === "user" && (
                  <>
                    <Button
                      variant="ghost"
                      className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20 transition-all relative"
                      onClick={() =>
                        navigate("/cart")
                      }
                    >
                      <ShoppingCart className="size-[20px] mr-2" />
                      장바구니
                      {totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-[#16a34a] text-white border-0 size-[20px] flex items-center justify-center p-0">
                          {totalItems}
                        </Badge>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20 transition-all"
                      onClick={() =>
                        navigate("/orders")
                      }
                    >
                      <Package className="size-[20px] mr-2" />
                      주문내역
                    </Button>

                    <Button
                      variant="ghost"
                      className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20 transition-all relative"
                      onClick={() =>
                        navigate("/notifications")
                      }
                    >
                      <Bell className="size-[20px] mr-2" />
                      알림
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-[#16a34a] text-white border-0 size-[20px] flex items-center justify-center p-0">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  className="text-[#4ade80] hover:text-[#22c55e] hover:bg-[#16a34a]/20 transition-all"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="size-[20px] mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <Button
                className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] transition-all"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <div className="pt-[128px] px-[48px] pb-[80px]">
        <div className="max-w-[1536px] mx-auto">
          {/* SEARCH */}
          <div className="mb-[48px]">
            <div className="flex gap-[24px] items-center mb-[24px]">
              <div className="flex-1 relative group">
                <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 size-[20px] text-[#4ade80]" />
                <Input
                  className="bg-[#0f2e0f] border-[#1a4d1a] text-white pl-[48px] h-[48px] focus:border-[#16a34a]"
                  placeholder="상품명, 팜 이름, 식물 이름으로 검색..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-[8px] text-[#4ade80]">
                <Filter className="size-[20px]" />
                <span className="text-[14px]">
                  카테고리
                </span>
              </div>
            </div>

            {/* CATEGORY FILTERS */}
            <div className="flex gap-[12px]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(cat.id)
                  }
                  className={`px-[24px] py-[12px] rounded-[12px] transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-[#16a34a]/50 scale-105"
                      : "bg-[#0f2e0f] border border-[#1a4d1a] text-[#4ade80] hover:border-[#22c55e] hover:shadow-lg hover:shadow-[#16a34a]/30 hover:scale-105"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-3 gap-[32px]">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetail={() =>
                  navigate(
                    `/product/${product.id}`
                  )
                }
                isAuthenticated={isAuthenticated}
                userRole={user?.role}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-[120px]">
              <p className="text-[#4ade80] text-[24px] mb-[16px]">
                검색 결과가 없습니다
              </p>
              <p className="text-[#16a34a] text-[16px]">
                다른 키워드로 검색해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {Object} ProductCardProps
 * @property {Product} product
 * @property {(product: Product) => void} onAddToCart
 * @property {() => void} onViewDetail
 * @property {boolean} isAuthenticated
 * @property {'user' | 'admin'=} userRole
 */

/**
 * @param {ProductCardProps} props
 */
function ProductCard({
  product,
  onAddToCart,
  onViewDetail,
  isAuthenticated,
  userRole,
}) {
  const showStock =
    product.stock !== undefined &&
    (userRole === "admin" ||
      (userRole === "user" &&
        product.stock <= 10));

  return (
    <div
      className="bg-[#0f2e0f] rounded-[20px] border border-[#1a4d1a] overflow-hidden group hover:shadow-2xl hover:shadow-[#16a34a]/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative"
      onClick={onViewDetail}
    >
      {/* IMAGE */}
      <div className="h-[200px] relative overflow-hidden">
        <img
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={product.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0a]/80 to-transparent" />

        {/* CATEGORY BADGE */}
        <Badge
          className={`absolute top-[16px] left-[16px] border-0 ${
            product.category === "crop"
              ? "bg-[#16a34a]"
              : product.category === "device"
              ? "bg-[#fbbf24]"
              : "bg-[#8b5cf6]"
          } text-white`}
        >
          {product.category === "crop"
            ? "🌱 작물"
            : product.category === "device"
            ? "⚙️ 기기"
            : "📹 서비스"}
        </Badge>
      </div>

      {/* CONTENT */}
      <div className="p-[24px]">
        <h3 className="text-[#4ade80] text-[18px] mb-[8px] group-hover:text-[#22c55e] transition-colors">
          {product.category === "device"
            ? product.name
            : product.farmName}
        </h3>

        <p className="text-[#16a34a] text-[14px] mb-[16px]">
          {product.category === "device"
            ? product.farmName
            : product.plant}
        </p>

        <div className="mb-[16px]">
          <p className="text-white text-[24px] font-bold">
            {product.price.toLocaleString()}원
          </p>
          <p className="text-[#16a34a] text-[12px]">
            {product.unit} 기준
          </p>
        </div>

        {showStock && (
          <p className="text-[#fbbf24] text-[14px] font-bold mb-[16px]">
            재고: {product.stock}개
          </p>
        )}

        <div
          className="flex gap-[12px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            className="flex-1 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail();
            }}
          >
            상세보기
          </Button>

          {isAuthenticated && (
            <Button
              variant="outline"
              className="border-[#16a34a] text-[#4ade80] hover:bg-[#16a34a] hover:text-white transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="size-[16px]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
