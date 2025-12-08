import {useState} from "react";
import {Routes, Route} from "react-router-dom";

import "./App.css";
import Header from "./layouts/header/Header";
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";
// import Market from "./pages/Market/Market";
import MyPage from "./pages/MyPage/MyPage";
import MyPageView from "./pages/MyPage/MyPageView";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import MyPageTimelapse from "./pages/MyPage/MyPageTimelapse";
import Login from "./pages/Login/Login";
import BasicLayout from "./layouts/layout/BasicLayout";

function App() {
  const [user, setUser] = useState(null);

  const mockUser = {
    name: "테스트 유저",
    role: "일반회원",
    profileImg: "/test-user.png",
  };

  return (
    <>
      <Header user={mockUser} />
      <Routes>
        <Route
          path="/"
          element={
            <BasicLayout>
              <Home />
            </BasicLayout>
          }
        />
        <Route
          path="/plants"
          element={
            <BasicLayout>
              <PlantManage />
            </BasicLayout>
          }
        />
        {/* <Route path="/market" element={<Market />} /> */}
        {/* 마이페이지 (부모) */}
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<MyPageView />} /> {/* 기본 페이지 */}
          <Route path="view" element={<MyPageView />} />
          <Route path="edit" element={<MyPageEdit />} />
          <Route path="timelapse" element={<MyPageTimelapse />} />
        </Route>
        <Route
          path="/login"
          element={
            <BasicLayout>
              <Login onLogin={setUser} />
            </BasicLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
