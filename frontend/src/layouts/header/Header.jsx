// ==============================
// 공통 Header.jsx
// ==============================
import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  useState,
  useRef,
  useEffect,
} from "react";
import { useAuth } from "../../api/auth/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout, isAdmin } = useAuth();

  const [openUserMenu, setOpenUserMenu] =
    useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ============================
  // 드롭다운 외부 클릭 시 자동 닫기
  // ============================
  useEffect(() => {
    function close(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenUserMenu(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  return (
    <header className="nova-header">
      <div className="nova-header-inner">
        {/* -------------------------
            로고
        -------------------------- */}
        <NavLink to="/" className="header-logo">
          <img
            src="/logo.svg"
            alt="logo"
            className="logo-img"
          />
        </NavLink>

        {/* -------------------------
            네비게이션 메뉴
        -------------------------- */}
        <nav className="nova-nav">
          <NavLink to="/" className="nav-item">
            <span>홈</span>
          </NavLink>

          <NavLink
            to="/plants"
            className="nav-item"
          >
            <span>내 식물 관리</span>
          </NavLink>

          <NavLink
            to="/market"
            className="nav-item"
          >
            <span>팜 마켓</span>
          </NavLink>

          <NavLink
            to="/alarm"
            className="nav-item"
          >
            <span>알림</span>
          </NavLink>
        </nav>

        {/* -------------------------
            우측 사용자 메뉴
        -------------------------- */}
        <div
          className="user-area"
          ref={dropdownRef}
        >
          {user ? (
            <>
              {/* 로그인 후 나타나는 버튼 */}
              <button
                className="user-dropdown-btn"
                onClick={() =>
                  setOpenUserMenu((prev) => !prev)
                }
              >
                <img
                  src={
                    user.profileImg ||
                    "/mockups/woo-default-profile.svg"
                  }
                  alt="프로필"
                  className="user-img"
                />
                <span className="user-name">
                  {user.name}
                </span>
                <span className="arrow">▾</span>
              </button>

              {openUserMenu && (
                <div className="dropdown-menu">
                  <Link
                    to="/mypage/view"
                    onClick={() =>
                      setOpenUserMenu(false)
                    }
                  >
                    프로필 보기
                  </Link>
                  <Link
                    to="/mypage/timelapse"
                    onClick={() =>
                      setOpenUserMenu(false)
                    }
                  >
                    타임 랩스
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() =>
                      setOpenUserMenu(false)
                    }
                  >
                    설정
                  </Link>
                  <Link
                    to="/history"
                    onClick={() =>
                      setOpenUserMenu(false)
                    }
                  >
                    나의 히스토리
                  </Link>

                  {/* 관리자 전용 메뉴 */}
                  {isAdmin() && (
                    <>
                      <div className="menu-divider"></div>
                      <Link
                        to="/admin"
                        className="admin-menu"
                        onClick={() =>
                          setOpenUserMenu(false)
                        }
                      >
                        관리자 대시보드
                      </Link>
                    </>
                  )}

                  <div className="menu-divider"></div>

                  <button
                    className="logout-btn"
                    onClick={() => {
                      logout();
                      setOpenUserMenu(false);
                      alert(
                        "로그아웃되었습니다."
                      );
                      navigate("/");
                    }}
                  >
                    로그아웃 ﹥
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* 로그인 전 */}
              <button
                className="user-dropdown-btn"
                onClick={() =>
                  setOpenUserMenu((p) => !p)
                }
              >
                <img
                  src="/mockups/woo-user-icon.svg"
                  alt="유저 아이콘"
                  className="user-img"
                />
                <span className="user-name">
                  로그인
                </span>
                <span className="arrow">▾</span>
              </button>

              {openUserMenu && (
                <div className="dropdown-menu login-dropdown">
                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={() =>
                      setOpenUserMenu(false)
                    }
                  >
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
