import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/loginBackButton/BackButton";
import { resetPasswordByEmailAPI, resetPasswordByPhoneAPI } from "../../api/user/userAPI";
import "./Find.css";

export default function PWFindReset() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const phoneNumber = location.state?.phoneNumber;

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // 🚨 잘못된 접근 방지 (렌더링 중 navigate ❌)
  useEffect(() => {
    if (!email && !phoneNumber) {
      alert("잘못된 접근입니다.");
      navigate("/login", { replace: true });
    }
  }, [email, phoneNumber, navigate]);

  const handleReset = async () => {
    if (!pw || !pw2) {
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }

    if (pw !== pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = email
      ? await resetPasswordByEmailAPI(email, pw)
      : await resetPasswordByPhoneAPI(phoneNumber, pw);

    // ❌ object alert 방지
    if (!result.ok) {
      alert(typeof result.msg === "string" ? result.msg : "비밀번호 변경에 실패했습니다.");
      return;
    }

    // ✅ 성공 메시지는 프론트에서 고정
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
        {/*  비밀번호 조건 힌트 */}
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
