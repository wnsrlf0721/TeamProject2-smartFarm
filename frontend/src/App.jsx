import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/market/ui/sonner";

import "./App.css";

// =============================
// Layout
// =============================
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./layouts/header/Header";

// =============================
// Providers
// =============================
import {
  AuthProvider,
  useAuth,
} from "./api/auth/AuthContext";

import { AlarmProvider } from "./sse/AlarmContext";
import { ProductProvider } from "./api/market/ProductContext";
import { CartProvider } from "./api/market/CartContext";
import { OrderProvider } from "./api/market/OrderContext";
import { ReviewProvider } from "./api/market/ReviewContext";
import { NotificationProvider } from "./api/market/NotificationContext";

// =============================
// Pages
// =============================
// Home / Plant
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";
import NeedLogin from "./pages/PlantManage/NeedLogin";

// Login
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import FindIdPw from "./pages/Login/FindIdPw";
import IDFindPage from "./pages/Login/IDFindPage";
import PWFindVerify from "./pages/Login/PWFindVerify";
import PWFindReset from "./pages/Login/PWFindReset";

// Alarm
import AlarmPage from "./pages/Alerts/AlarmPage";

// MyPage
import MyPage from "./pages/MyPage/MyPage";
import MyPageView from "./pages/MyPage/MyPageView";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import OrderManagement from "./pages/Admin/OrderManagement";

// Market
import Market from "./pages/Market/Market";
import ProductDetail from "./pages/Market/ProductDetail";
import Cart from "./pages/Market/Cart";
import Checkout from "./pages/Market/Checkout";
import PaymentSuccess from "./pages/Market/SuccessPayment";
import PaymentFail from "./pages/Market/PaymentFail";
import OrderHistory from "./pages/Market/OrderHistory";
import OrderTracking from "./pages/Market/OrderTracking";

// =============================
// Route Guards
// =============================
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user)
    return <Navigate to="/login" replace />;
  if (!isAdmin())
    return <Navigate to="/403" replace />;

  return children;
}

// =============================
// App
// =============================
export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewProvider>
              <NotificationProvider>
                <AlarmProvider>
                  <Header />
                  <Toaster
                    position="top-right"
                    richColors
                    closeButton
                  />

                  <Routes>
                    {/* Home */}
                    <Route
                      path="/"
                      element={
                        <BasicLayout>
                          <Home />
                        </BasicLayout>
                      }
                    />

                    {/* Plant */}
                    <Route
                      path="/plants"
                      element={
                        <BasicLayout>
                          <PlantManage />
                        </BasicLayout>
                      }
                    />
                    <Route
                      path="/plants/need-login"
                      element={<NeedLogin />}
                    />

                    {/* Alarm */}
                    <Route
                      path="/alarm"
                      element={
                        <PrivateRoute>
                          <BasicLayout>
                            <AlarmPage />
                          </BasicLayout>
                        </PrivateRoute>
                      }
                    />

                    {/* Auth */}
                    <Route
                      path="/login"
                      element={<Login />}
                    />
                    <Route
                      path="/signup"
                      element={<Signup />}
                    />

                    {/* Find ID / PW */}
                    <Route
                      path="/find"
                      element={<FindIdPw />}
                    />
                    <Route
                      path="/find/id"
                      element={<IDFindPage />}
                    />
                    <Route
                      path="/find/pw/verify"
                      element={<PWFindVerify />}
                    />
                    <Route
                      path="/find/pw/reset"
                      element={<PWFindReset />}
                    />

                    {/* Admin */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <AdminRoute>
                          <ProductManagement />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <AdminRoute>
                          <OrderManagement />
                        </AdminRoute>
                      }
                    />

                    {/* Market */}
                    <Route
                      path="/market"
                      element={<Market />}
                    />
                    <Route
                      path="/products"
                      element={<Market />}
                    />
                    <Route
                      path="/product/:productId"
                      element={<ProductDetail />}
                    />
                    <Route
                      path="/cart"
                      element={<Cart />}
                    />
                    <Route
                      path="/checkout"
                      element={<Checkout />}
                    />
                    <Route
                      path="/success-payment"
                      element={<PaymentSuccess />}
                    />
                    <Route
                      path="/fail-payment"
                      element={<PaymentFail />}
                    />

                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute>
                          <OrderHistory />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/tracking/:orderId"
                      element={
                        <PrivateRoute>
                          <OrderTracking />
                        </PrivateRoute>
                      }
                    />

                    {/* MyPage */}
                    <Route
                      path="/mypage"
                      element={
                        <PrivateRoute>
                          <MyPage />
                        </PrivateRoute>
                      }
                    >
                      <Route
                        index
                        element={<MyPageView />}
                      />
                      <Route
                        path="view"
                        element={<MyPageView />}
                      />
                      <Route
                        path="edit"
                        element={<MyPageEdit />}
                      />
                      <Route
                        path="timelapse"
                        element={
                          <MyPageTimelapse />
                        }
                      />
                    </Route>
                  </Routes>
                </AlarmProvider>
              </NotificationProvider>
            </ReviewProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
