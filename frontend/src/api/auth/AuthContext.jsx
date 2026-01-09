// src/api/auth/AuthContext.jsx
import {
  createContext,
  useContext,
  useState,
} from "react";
import {
  loginAPI,
  signupAPI,
} from "../user/userAPI";

// =====================
// ROLE 상수
// =====================
const ROLES = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
};

// =====================
// Context 생성
// =====================
const AuthContext = createContext(null);
export const useAuth = () =>
  useContext(AuthContext);

// =====================
// Provider
// =====================
export function AuthProvider({ children }) {
  // 🔹 새로고침 시 로그인 유지
  const [user, setUser] = useState(() => {
    const savedUser =
      localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // =====================
  // 회원가입
  // =====================
  const signup = async (form) => {
    return await signupAPI(form);
  };

  // =====================
  // 로그인
  // =====================
  const login = async (loginId, password) => {
    const result = await loginAPI(
      loginId,
      password
    );

    if (result.ok) {
      setUser(result.data);
      localStorage.setItem(
        "user",
        JSON.stringify(result.data)
      );
    }

    return result;
  };

  // =====================
  // 로그아웃
  // =====================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // =====================
  // 권한 체크
  // =====================
  const hasRole = (roles = []) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole([ROLES.ADMIN]);
  const isUser = () => hasRole([ROLES.USER]);

  // =====================
  // Context Value
  // =====================
  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        hasRole,
        isAdmin,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
