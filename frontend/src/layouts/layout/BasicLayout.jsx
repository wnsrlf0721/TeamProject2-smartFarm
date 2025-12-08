// src/layouts/BasicLayout.jsx
import "./BasicLayout.css";

// 분리한 컴포넌트들
import Footer from "../footer/Footer";
import Header from "../header/Header";

function BasicLayout({ children }) {
  return (
    <div className="layout-wrapper">
      <div className="content-grid">
        <section className="main-content">{children}</section>
      </div>

      <Footer />
    </div>
  );
}

export default BasicLayout;
