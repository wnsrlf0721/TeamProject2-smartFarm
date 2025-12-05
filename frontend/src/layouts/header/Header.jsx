import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Header.css";

function Header({ user }) {
  const [openMenu, setOpenMenu] = useState(false);

  // ★ 드롭다운 외부 클릭 감지용 ref
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            홈
          </Link>
          <Link to="/plants" className="nav-item">
            내 식물 관리
          </Link>
          <Link to="/market" className="nav-item">
            팜 마켓
          </Link>
          <Link to="/alerts" className="nav-item">
            알림
          </Link>
        </nav>

        {/* 우측 사용자 */}
        <div className="user-area" ref={dropdownRef}>
          {user ? (
            <>
              <button className="user-dropdown-btn" onClick={() => setOpenMenu((prev) => !prev)}>
                <img src={user.profileImg} alt="프로필" className="user-img" />
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
