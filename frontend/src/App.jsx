import {Routes, Route} from "react-router-dom";

// =============================
// 공통 CSS / 레이아웃
// =============================
import "./App.css";
import BasicLayout from "./layouts/layout/BasicLayout";
import Header from "./wooyoung_login/layouts/header/Header";

// =============================
// 팀장 페이지 영역
// =============================
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";

import MyPage from "./pages/MyPage/MyPage";
import MyPageView from "./pages/MyPage/MyPageView";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";

// =============================
// 우영 로그인/회원가입 + 인증
// =============================
import {AuthProvider} from "./wooyoung_login/auth/AuthContext";
import Login from "./wooyoung_login/pages/Login";
import Signup from "./wooyoung_login/pages/Signup";

// ID/PW 찾기
import FindIdPw from "./wooyoung_login/pages/FindIdPw";
import IDFindPage from "./wooyoung_login/pages/IDFindPage";
import PWFindVerify from "./wooyoung_login/pages/PWFindVerify";
import PWFindReset from "./wooyoung_login/pages/PWFindReset";

// 테스트
import TestHome from "./wooyoung_login/pages/TestHome";

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
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<MyPageView />} />
          <Route path="view" element={<MyPageView />} />
          <Route path="edit" element={<MyPageEdit />} />
          <Route path="timelapse" element={<MyPageTimelapse />} />
        </Route>

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
      </Routes>
    </AuthProvider>
  );
}

export default App;
