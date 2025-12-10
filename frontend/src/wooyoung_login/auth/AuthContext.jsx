import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
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
  ]);

  // 회원가입
  const signup = (newUser) => {
    const exists = users.some((u) => u.id === newUser.id);
    if (exists) return { ok: false, msg: "이미 존재하는 아이디입니다." };

    setUsers([...users, newUser]);
    return { ok: true };
  };

  // 로그인
  const login = (id, pw) => {
    const found = users.find((u) => u.id === id && u.pw === pw);
    if (!found) return { ok: false };

    setUser(found);
    return { ok: true };
  };

  // 로그아웃
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, users, setUsers }}>
      {children}
    </AuthContext.Provider>
  );
}
