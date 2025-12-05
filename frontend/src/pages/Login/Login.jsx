import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 프론트단 임시 로그인 로직 (백엔드 연결 전)
    if (id === "test" && pw === "1234") {
      onLogin({
        name: "Joseph William",
        role: "Administrator",
        profileImg: "/profile.jpg", // 임시 이미지
      });
    } else {
      alert("아이디 또는 비밀번호가 잘못되었습니다.");
    }
  };

  return (
    <div className="login-wrapper">
      <h1>로그인</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
