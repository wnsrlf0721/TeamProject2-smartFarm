import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/auth/AuthContext";
import { toast } from "sonner";

import {
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Settings,
} from "lucide-react";

import { getAllOrdersAdmin } from "../../api/admin/orderManagementApi";

import { fetchAdminProducts } from "../../api/admin/productManagementApi";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그아웃
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 주문 데이터
        const orderData =
          await getAllOrdersAdmin();
        setOrders(
          Array.isArray(orderData)
            ? orderData
            : []
        );

        // 상품 데이터
        const productData =
          await fetchAdminProducts();
        setProducts(
          Array.isArray(productData?.data)
            ? productData.data
            : []
        );
      } catch (error) {
        console.error("데이터 로딩 실패", error);
        toast.error(
          "데이터 로딩에 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 주문 상태별 통계
  const pendingOrders = orders.filter(
    (o) => o.status === "pending"
  ).length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, o) =>
      sum +
      (o.totalPrice ? Number(o.totalPrice) : 0),
    0
  );
  const cropCount = products.filter(
    (p) => p.category === "CROP"
  ).length;
  const deviceCount = products.filter(
    (p) => p.category === "DEVICE"
  ).length;
  const novaCount = products.filter(
    (p) => p.category === "NOVA"
  ).length;
  const serviceCount = products.filter(
    (p) => p.category === "SERVICE"
  ).length;
  const etcCount = products.filter(
    (p) =>
      ![
        "CROP",
        "DEVICE",
        "NOVA",
        "SERVICE",
      ].includes(p.category)
  ).length;

  return (
    <div className="admin-container">
      {/* Header */}
      <section className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-left">
            <div className="admin-header-icon">
              <Settings className="admin-header-icon-svg" />
            </div>
            <div>
              <h1 className="admin-title">
                관리자 대시보드
              </h1>
              <p className="admin-subtitle">
                {user?.name} 관리자님 환영합니다
              </p>
            </div>
          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut className="logout-icon" />
            로그아웃
          </button>
        </div>
      </section>

      {/* Content */}
      <div className="admin-content">
        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-card">
            <div className="admin-card-top">
              <div className="admin-card-icon bg-blue">
                <Package className="icon-blue" />
              </div>
              <span className="badge blue">
                신규 {pendingOrders}건
              </span>
            </div>
            <p className="admin-card-label">
              총 주문
            </p>
            <p className="admin-card-value">
              {orders.length}
            </p>
          </div>

          <div className="admin-card">
            <div className="admin-card-top">
              <div className="admin-card-icon bg-green">
                <TrendingUp className="icon-green" />
              </div>
            </div>
            <p className="admin-card-label">
              총 매출
            </p>
            <p className="admin-card-value">
              {totalRevenue.toLocaleString()}원
            </p>
          </div>

          <div className="admin-card">
            <div className="admin-card-top">
              <div className="admin-card-icon bg-purple">
                <ShoppingBag className="icon-purple" />
              </div>
            </div>
            <p className="admin-card-label">
              등록 상품
            </p>
            <p className="admin-card-value">
              {products.length}
            </p>
            <p className="admin-card-subtext">
              작물 {cropCount} / 기기{" "}
              {deviceCount} / 노바 {novaCount} /
              서비스 {serviceCount} / 기타{" "}
              {etcCount}
            </p>
          </div>

          <div className="admin-card">
            <div className="admin-card-top">
              <div className="admin-card-icon bg-orange">
                <Users className="icon-orange" />
              </div>
              <span className="badge orange">
                처리중 {processingOrders}건
              </span>
            </div>
            <p className="admin-card-label">
              배송 대기
            </p>
            <p className="admin-card-value">
              {pendingOrders + processingOrders}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="admin-actions-grid">
          <button
            className="admin-action-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            <div className="admin-action-icon">
              <ShoppingBag className="action-svg" />
            </div>
            <h3 className="admin-action-title">
              상품 관리
            </h3>
            <p className="admin-action-text">
              팜 추가, 상품 수정, 가격 변경
            </p>
          </button>

          <button
            className="admin-action-btn"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            <div className="admin-action-icon">
              <Package className="action-svg" />
            </div>
            <h3 className="admin-action-title">
              주문 관리
            </h3>
            <p className="admin-action-text">
              주문 확인, 배송 승인 및 관리
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
