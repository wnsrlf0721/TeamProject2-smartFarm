import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useProducts } from "../../../contexts/ProductContext";
import { useOrders } from "../../../contexts/OrderContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const { orders } = useOrders();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const cropCount = products.filter(
    (p) => p.category === "crop"
  ).length;
  const deviceCount = products.filter(
    (p) => p.category === "device"
  ).length;

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1400px] mx-auto px-[24px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <div className="size-[48px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] flex items-center justify-center">
              <Settings className="size-[24px] text-white" />
            </div>
            <div>
              <h1 className="text-white text-[20px]">
                관리자 대시보드
              </h1>
              <p className="text-[#90a1b9] text-[14px]">
                {user?.name}님 환영합니다
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="size-[20px] mr-2" />
            로그아웃
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-[24px] py-[48px]">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-[24px] mb-[48px]">
          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="size-[48px] rounded-full bg-[rgba(81,162,255,0.2)] flex items-center justify-center">
                <Package className="size-[24px] text-[#51a2ff]" />
              </div>
              <Badge className="bg-[#51a2ff] text-white border-0">
                신규 {pendingOrders}건
              </Badge>
            </div>
            <p className="text-[#90a1b9] text-[14px] mb-[4px]">
              총 주문
            </p>
            <p className="text-white text-[32px]">
              {orders.length}
            </p>
          </div>

          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="size-[48px] rounded-full bg-[rgba(5,223,114,0.2)] flex items-center justify-center">
                <TrendingUp className="size-[24px] text-[#05df72]" />
              </div>
            </div>
            <p className="text-[#90a1b9] text-[14px] mb-[4px]">
              총 매출
            </p>
            <p className="text-white text-[32px]">
              {(totalRevenue / 10000).toFixed(0)}
              만원
            </p>
          </div>

          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="size-[48px] rounded-full bg-[rgba(194,122,255,0.2)] flex items-center justify-center">
                <ShoppingBag className="size-[24px] text-[#c27aff]" />
              </div>
            </div>
            <p className="text-[#90a1b9] text-[14px] mb-[4px]">
              등록 상품
            </p>
            <p className="text-white text-[32px]">
              {products.length}
            </p>
            <p className="text-[#62748e] text-[12px] mt-[4px]">
              작물 {cropCount} / 기기{" "}
              {deviceCount}
            </p>
          </div>

          <div className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="size-[48px] rounded-full bg-[rgba(255,165,0,0.2)] flex items-center justify-center">
                <Users className="size-[24px] text-[#ffa500]" />
              </div>
              <Badge className="bg-[#ffa500] text-white border-0">
                처리중 {processingOrders}건
              </Badge>
            </div>
            <p className="text-[#90a1b9] text-[14px] mb-[4px]">
              배송 대기
            </p>
            <p className="text-white text-[32px]">
              {pendingOrders + processingOrders}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-[24px]">
          <button
            onClick={() =>
              navigate("/admin/products")
            }
            className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[32px] hover:border-[#51a2ff] transition-colors text-left"
          >
            <div className="size-[64px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] flex items-center justify-center mb-[16px]">
              <ShoppingBag className="size-[32px] text-white" />
            </div>
            <h3 className="text-white text-[24px] mb-[8px]">
              상품 관리
            </h3>
            <p className="text-[#90a1b9] text-[16px]">
              팜 추가, 상품 수정, 가격 변경
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
            className="bg-[#1d293d] rounded-[16px] border border-[#314158] p-[32px] hover:border-[#51a2ff] transition-colors text-left"
          >
            <div className="size-[64px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] flex items-center justify-center mb-[16px]">
              <Package className="size-[32px] text-white" />
            </div>
            <h3 className="text-white text-[24px] mb-[8px]">
              주문 관리
            </h3>
            <p className="text-[#90a1b9] text-[16px]">
              주문 확인, 배송 승인 및 관리
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
