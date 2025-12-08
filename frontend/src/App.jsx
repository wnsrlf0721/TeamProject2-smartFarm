import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./layouts/header/Header";
import Home from "./pages/Home/Home";
import PlantManage from "./pages/PlantManage/PlantManage";
// import Market from "./pages/Market/Market";
// import MyPage from "./pages/MyPage/MyPage";
import Login from "./pages/Login/Login";

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
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<PlantManage />} />
        {/* <Route path="/market" element={<Market />} />
        <Route path="/mypage" element={<MyPage />} /> */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
