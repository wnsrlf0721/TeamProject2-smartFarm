import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/loginBackButton/BackButton";
import { resetPasswordByEmailAPI, resetPasswordByPhoneAPI } from "../../api/user/userAPI";
import "./Find.css";

export default function PWFindReset() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 PWFindVerify에서 전달한 값
  const { type, value } = location.state || {};

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // 🚨 잘못된 접근 방지
  if (!type || !value) {
    alert("잘못된 접근입니다.");
    navigate("/login", { replace: true });
    return null;
  }

  const handleReset = async () => {
    if (!pw || !pw2) {
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }

    if (pw !== pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    let result;
    if (type === "email") {
      result = await resetPasswordByEmailAPI(value, pw);
    } else {
      result = await resetPasswordByPhoneAPI(value, pw);
    }

    if (!result.ok) {
      alert(result.msg || "비밀번호 변경 실패");
      return;
    }

    alert("비밀번호가 성공적으로 변경되었습니다!");
    navigate("/login", { replace: true });
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>새 비밀번호 설정</h2>

        <input
          type="password"
          className="input"
          placeholder="새 비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        {/* 비밀번호 조건 힌트 */}
        <div className="pw-hint">
          <p className={pw.length >= 8 && pw.length <= 16 ? "ok" : ""}>• 8~16자 이내</p>
          <p className={pw && pw === pw2 ? "ok" : ""}>• 비밀번호 확인 일치</p>
        </div>

        <input
          type="password"
          className="input"
          placeholder="비밀번호 확인"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
        />

        <button className="green-btn" onClick={handleReset}>
          비밀번호 변경하기
        </button>

        <BackButton />
      </div>
    </div>
  );
}
