import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/auth/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, user } = useAuth(); //  user 가져오기
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(" 로그인 버튼 클릭됨");

    const result = await login(id, pw);
    console.log(" login 결과:", result);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert("로그인 성공!");

    //  result.data x
    // AuthContext에서 관리하는 user 기준
    if (user?.role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
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
