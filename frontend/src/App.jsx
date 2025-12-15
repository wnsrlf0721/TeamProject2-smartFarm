import { Routes, Route } from "react-router-dom";

// =============================
// 공통 CSS / 레이아웃
// =============================
import "./App.css";
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./layouts/header/Header";

// =============================
// 팀장 페이지 영역
// =============================
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";

// import MyPage from "./pages/MyPage/MyPage";
// import MyPageView from "./pages/MyPage/MyPageView";
// import MyPageEdit from "./pages/MyPage/MyPageEdit";
// import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";

// =============================
// 우영 로그인/회원가입 + 인증
// =============================
import { AuthProvider } from "./api/auth/AuthContext";

// 로그인 / 회원가입
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";

// ID/PW 찾기
import FindIdPw from "./pages/Login/FindIdPw";
import IDFindPage from "./pages/Login/IDFindPage";
import PWFindVerify from "./pages/Login/PWFindVerify";
import PWFindReset from "./pages/Login/PWFindReset";

// 테스트 & 관리자 페이지
import TestHome from "./pages/Login/TestHome";
import AdminHome from "./pages/Login/AdminHome";
import AlarmPage from "./pages/Alerts/AlarmPage";

//usestate 써서 import 해보기
function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        {/* 홈 */}
        <Route
          path="/"
          element={
            <BasicLayout>
              <Home />
            </BasicLayout>
          }
        />

        {/* 식물관리 */}
        <Route
          path="/plants"
          element={
            <BasicLayout>
              <PlantManage />
            </BasicLayout>
          }
        />

        {/* 마이페이지 */}
        {/* <Route path="/mypage" element={<MyPage />}>
          <Route index element={<MyPageView />} />
          <Route path="view" element={<MyPageView />} />
          <Route path="edit" element={<MyPageEdit />} />
          <Route path="timelapse" element={<MyPageTimelapse />} />
        </Route> */}

        {/* 로그인 관련 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ID/PW 찾기 */}
        <Route path="/find" element={<FindIdPw />} />
        <Route path="/find/id" element={<IDFindPage />} />
        <Route path="/find/pw/verify" element={<PWFindVerify />} />
        <Route path="/find/pw/reset" element={<PWFindReset />} />

        {/* 테스트 페이지 */}
        <Route path="/wootest" element={<TestHome />} />
        {/* 🔥 관리자 로그인 / 관리자 페이지 */}
        <Route path="/admin" element={<AdminHome />} />
        {/* 알람관리 */}
        <Route
          path="/alarm"
          element={
            <BasicLayout>
              <AlarmPage />
            </BasicLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
