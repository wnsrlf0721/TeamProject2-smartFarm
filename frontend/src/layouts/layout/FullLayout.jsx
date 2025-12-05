// src/layouts/FullLayout.jsx
import React from "react";
import AppFooter from "./AppFooter";
import "./BasicLayout.css"; // CSS(배경색 등)는 기존 것 같이 씀
import Header from "../header/Header";

function FullLayout({ children }) {
  console.log(children);
  return (
    <div className="layout-wrapper">
      {/* 1. 헤더 */}
      <Header />

      {/* 2. 본문 (사이드바 없이 통으로 씀) */}
      <main className="main-container" style={{ display: "block" }}>
        {/* 그리드(Grid)를 쓰지 않고, 그냥 div로 꽉 채웁니다 */}
        <div style={{ width: "100%", padding: "0 20px" }}>{children}</div>
      </main>

      {/* 3. 푸터 */}
      <AppFooter />
    </div>
  );
}

export default FullLayout;
