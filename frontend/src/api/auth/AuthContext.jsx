import { createContext, useContext, useState } from "react";
import { signupAPI, loginAPI } from "../../api/user/userAPI";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
<<<<<<< HEAD
  // 새로고침해도 로그인 유지
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
=======
  const [user, setUser] = useState(null);

  // 더미 유저 저장 배열
  const [users, setUsers] = useState([
    { id: "1", pw: "1", name: "1", phone: "1", email: "1", role: "USER" },
    {
      id: "admin",
      pw: "1234",
      name: "관리자",
      phone: "010-0000-0000",
      email: "admin@test.com",
      role: "ADMIN",
    },
    {
      id: "user",
      userId: 4,
      pw: "1234",
      name: "사용자",
      phone: "010-0000-0000",
      email: "user@test.com",
      role: "USER",
    },
  ]);
>>>>>>> develop

  // 회원가입
  const signup = async (form) => {
    return await signupAPI(form);
  };

  // 로그인
  const login = async (id, pw) => {
    const result = await loginAPI(id, pw);

    if (result.ok) {
      // user 객체 그대로 저장
      console.log(result.data);
      setUser(result.data);
      localStorage.setItem("user", JSON.stringify(result.data));
    }

    return result;
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
=======
    <AuthContext.Provider
      value={{ user, signup, login, logout, users, setUsers }}
    >
      {children}
    </AuthContext.Provider>
>>>>>>> develop
  );
}
