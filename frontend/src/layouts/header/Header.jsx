import {Link, useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import "./Header.css";

function Header({user}) {
  const [openMenu, setOpenMenu] = useState(false);

  // 서브메뉴 표시를 위한 코드
  const [activeMenu, setActiveMenu] = useState(null);
  const navRef = useRef();
  const location = useLocation();

  // ★ 드롭다운 외부 클릭 감지용 ref
  const dropdownRef = useRef();

  // 들어온 URL 기반으로 자동 open
  useEffect(() => {
    if (location.pathname.startsWith("/mypage")) {
      setActiveMenu("mypage");
    } else if (location.pathname.startsWith("/plants")) {
      setActiveMenu("plants");
    } else if (location.pathname.startsWith("/market")) {
      setActiveMenu("market");
    } else if (location.pathname.startsWith("/alerts")) {
      setActiveMenu("alerts");
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 네비게이션 외부 클릭 시 서브메뉴 닫기
  useEffect(() => {
    function handleNavOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mouseover", handleNavOutside);
    return () => document.removeEventListener("mouseover", handleNavOutside);
  }, []);

  return (
    <header className="nova-header">
      <div className="nova-header-inner">
        {/* 로고 */}
        <Link to="/" className="header-logo">
          <img src="/logo.svg" alt="" className="logo-img" />
        </Link>

        {/* 가운데 탭바 */}
        <nav className="nova-nav">
          <Link to="/" className="nav-item">
            <span>홈</span>
          </Link>
          <Link to="/plants" className="nav-item">
            <span>내 식물 관리</span>
          </Link>
          <Link to="/mypage" className="nav-item" onMouseEnter={() => setActiveMenu("mypage")}>
            마이페이지
          </Link>
          <Link to="/market" className="nav-item">
            <span>팜 마켓</span>
          </Link>
          <Link to="/alerts" className="nav-item">
            <span>알림</span>
          </Link>
        </nav>

        {/* 서브메뉴 */}
        <div className="submenu-zone">
          {activeMenu === "mypage" && (
            <div
              className="submenu fade"
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
        </div>

        {/* 우측 사용자 */}
        <div className="user-area" ref={dropdownRef}>
          {user ? (
            <>
              <button className="user-dropdown-btn" onClick={() => setOpenMenu((prev) => !prev)}>
                <img src="/mockups/profile-photo.svg" alt="프로필" className="user-img" />
                <span className="user-name">{user.name}</span>
                <span className="arrow">▾</span>
              </button>

              {openMenu && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    프로필 보기
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    설정
                  </Link>
                  <Link to="/history" className="dropdown-item">
                    내 히스토리
                  </Link>

                  <div className="menu-divider"></div>

                  <button className="logout-btn dropdown-item"> 로그아웃 ﹥</button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-btn">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
