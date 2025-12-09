import { createBrowserRouter, Navigate } from "react-router-dom";

// === Root Layout ===
import RootLayout from "../layouts/RootLayout";
import BasicLayout from "../layouts/layout/BasicLayout";

// === BASIC PAGES ===
import Home from "../pages/Home/Home";
import PlantManage from "../pages/PlantManage/PlantManage";
import Login from "../pages/Login/Login";

// === MY PAGE ===
import MyPage from "../pages/MyPage/MyPage";
import MyPageView from "../pages/MyPage/MyPageView";
import MyPageEdit from "../pages/MyPage/MyPageEdit";
import MyPageTimelapse from "../pages/MyPage/MyPageTimelapse";

// === MARKET ===
import Market from "../pages/Market/Market";
import MarketLogin from "../pages/Market/Login";
import ProductList from "../pages/Market/ProductList";
import ProductDetail from "../pages/Market/ProductDetail";
import Cart from "../pages/Market/Cart";
import Checkout from "../pages/Market/Checkout";
import OrderHistory from "../pages/Market/OrderHistory";
import OrderTracking from "../pages/Market/OrderTracking";
import Notifications from "../pages/Market/Notifications";

// === GLOBAL ALERTS ===
import AlertsPage from "../pages/Alerts/AlertsPage"; // ★ 새로 생성 필요

// === PROFILE SETTING PAGES ===
import ProfilePage from "../pages/Profile/ProfilePage"; // 새로 생성
import SettingsPage from "../pages/Settings/SettingsPage"; // 새로 생성
import HistoryPage from "../pages/History/HistoryPage"; // 새로 생성

// === ADMIN ===
import AdminDashboard from "../pages/Market/admin/AdminDashboard";
import ProductManagement from "../pages/Market/admin/ProductManagement";
import OrderManagement from "../pages/Market/admin/OrderManagement";

// === PROTECTED ===
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ===============================
      // BASIC
      // ===============================
      {
        index: true,
        element: (
          <BasicLayout>
            <Home />
          </BasicLayout>
        ),
      },
      {
        path: "plants",
        element: (
          <BasicLayout>
            <PlantManage />
          </BasicLayout>
        ),
      },
      {
        path: "login",
        element: (
          <BasicLayout>
            <Login />
          </BasicLayout>
        ),
      },

      // ===============================
      // MY PAGE
      // ===============================
      {
        path: "mypage",
        element: <MyPage />,
        children: [
          { index: true, element: <MyPageView /> },
          { path: "view", element: <MyPageView /> },
          { path: "edit", element: <MyPageEdit /> },
          { path: "timelapse", element: <MyPageTimelapse /> },
        ],
      },

      // ===============================
      // PROFILE & SETTINGS PAGES (Header Dropdown)
      // ===============================
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "history", element: <HistoryPage /> },

      // ===============================
      // GLOBAL ALERTS (Header의 알림)
      // ===============================
      { path: "alerts", element: <AlertsPage /> },

      // ===============================
      // MARKET (E-Commerce)
      // ===============================
      { path: "market", element: <Market /> },
      { path: "market/login", element: <MarketLogin /> },
      { path: "market/products", element: <ProductList /> },
      { path: "market/product/:productId", element: <ProductDetail /> },

      // PROTECTED MARKET ROUTES
      {
        path: "market/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "market/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "market/orders",
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "market/notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "market/tracking/:orderId",
        element: (
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        ),
      },

      // ===============================
      // ADMIN (Protected)
      // ===============================
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/products",
        element: (
          <ProtectedRoute requireAdmin>
            <ProductManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/orders",
        element: (
          <ProtectedRoute requireAdmin>
            <OrderManagement />
          </ProtectedRoute>
        ),
      },

      // ===============================
      // NOT FOUND → HOME REDIRECT
      // ===============================
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
