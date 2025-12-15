import { createContext, useContext, useState } from "react";
import { signupAPI, loginAPI } from "../../api/user/userAPI";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    // 새로고침해도 로그인 유지
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

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
        <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
    );
}
