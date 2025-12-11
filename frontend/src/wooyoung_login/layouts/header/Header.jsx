// ==============================
// 통합 Header.jsx (마이페이지 + Auth + 드롭다운 + 서브메뉴)
// ==============================
import {Link, useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import {useAuth} from "../../auth/AuthContext";
import "./Header.css";

export default function Header() {
  const {user, logout} = useAuth();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  // const [activeMenu, setActiveMenu] = useState(null);

  const dropdownRef = useRef();
  const navRef = useRef();
  // const location = useLocation();

  // ============================
  // URL 기반 활성 메뉴 자동 적용
  // ============================
  // useEffect(() => {
  //   if (location.pathname.startsWith("/mypage")) setActiveMenu("mypage");
  //   else if (location.pathname.startsWith("/plants")) setActiveMenu("plants");
  //   else if (location.pathname.startsWith("/market")) setActiveMenu("market");
  //   else if (location.pathname.startsWith("/alerts")) setActiveMenu("alerts");
  //   else setActiveMenu(null);
  // }, [location.pathname]);

  // ============================
  // 드롭다운 외부 클릭 시 닫기
  // ============================
  // useEffect(() => {
  //   function close(e) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
  //       setOpenUserMenu(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", close);
  //   return () => document.removeEventListener("mousedown", close);
  // }, []);

  // ============================
  // 메뉴 Hover 외부 클릭 시 서브메뉴 닫기
  // ============================
  // useEffect(() => {
  //   function closeNav(e) {
  //     if (navRef.current && !navRef.current.contains(e.target)) {
  //       setActiveMenu(null);
  //     }
  //   }
  //   document.addEventListener("mouseover", closeNav);
  //   return () => document.removeEventListener("mouseover", closeNav);
  // }, []);

  return (
    <header className="nova-header">
      <div className="nova-header-inner">
        {/* -------------------------
            로고
        -------------------------- */}
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="logo" className="logo-img" />
        </Link>

        {/* -------------------------
            네비게이션
        -------------------------- */}
        <nav className="nova-nav" ref={navRef}>
          <Link to="/" className="nav-item">
            <span>홈</span>
          </Link>

          <Link to="/plants" className="nav-item">
            <span>내 식물 관리</span>
          </Link>

          {/* <Link to="/mypage" className="nav-item" onMouseEnter={() => setActiveMenu("mypage")}>
            <span>마이페이지</span>
          </Link> */}

          <Link to="/market" className="nav-item">
            <span>팜 마켓</span>
          </Link>

          <Link to="/alerts" className="nav-item">
            <span>알림</span>
          </Link>
        </nav>

        {/* -------------------------
            마이페이지 서브메뉴
        -------------------------- */}
        {/* <div className="submenu-zone">
          {activeMenu === "mypage" && (
            <div
              className="submenu"
              onMouseEnter={() => setActiveMenu("mypage")}
              onMouseLeave={() => {
                if (!location.pathname.startsWith("/mypage")) {
                  setActiveMenu(null);
                }
              }}
            >
              <Link to="/mypage/view">프로필 관리</Link>
              <Link to="/mypage/edit">프로필 수정</Link>
              <Link to="/mypage/timelapse">타임 랩스</Link>
            </div>
          )}
        </div> */}

        {/* -------------------------
            우측 사용자 메뉴
        -------------------------- */}
        <div className="user-area" ref={dropdownRef}>
          {user ? (
            <>
              {/* 로그인 후 드롭다운 */}
              <button
                className="user-dropdown-btn"
                onClick={() => setOpenUserMenu((prev) => !prev)}
              >
                <img
                  src={user.profileImg || "/mockups/woo-default-profile.svg"}
                  alt="프로필"
                  className="user-img"
                />
                <span className="user-name">{user.name}</span>
                <span className="arrow">▾</span>
              </button>

              {openUserMenu && (
                <div className="dropdown-menu">
                  <Link to="/mypage/view">프로필 보기</Link>
                  <Link to="/mypage/timelapse">타임 랩스</Link>
                  <Link to="/settings">설정</Link>
                  <Link to="/history">나의 히스토리</Link>

                  <div className="menu-divider"></div>

                  <button className="logout-btn" onClick={logout}>
                    로그아웃 ﹥
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* 로그인 전 */}
              <button className="user-dropdown-btn" onClick={() => setOpenUserMenu((p) => !p)}>
                <img src="/mockups/woo-user-icon.svg" alt="" className="user-img" />
                <span className="user-name">로그인</span>
                <span className="arrow">▾</span>
              </button>

              {openUserMenu && (
                <div className="dropdown-menu login-dropdown">
                  <Link to="/login" className="dropdown-item">
                    로그인
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
