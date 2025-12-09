import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login(id, pw); // result = { ok: true/false }

    if (!result.ok) {
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
      return;
    }

    navigate("/");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>로그인</h2>

        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="input"
        />

        <button className="login-btn" type="submit">
          로그인
        </button>

        <div className="login-links">
          <span onClick={() => navigate("/signup")}>회원가입</span>
          <span>|</span>
          <span onClick={() => navigate("/find")}>ID/PW 찾기</span>
        </div>
      </form>
    </div>
  );
}
