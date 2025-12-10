import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import BackButton from "../components/BackButton";
import "./Find.css";

export default function PWFindReset() {
  const navigate = useNavigate();
  const { users, setUsers } = useAuth();
  const location = useLocation();

  const userId = location.state?.userId;
  const foundUser = users.find((u) => u.id === userId);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // 잘못된 접근 방지
  if (!userId || !foundUser) {
    return (
      <div className="find-container">
        <div className="find-box">
          <h2>잘못된 접근입니다.</h2>

          {/* 변경됨: 기존의 텍스트 뒤로가기 삭제 → BackButton 컴포넌트 사용 */}
          <BackButton to="/find" />
        </div>
      </div>
    );
  }

  const handleReset = () => {
    if (pw !== pw2) return alert("비밀번호가 일치하지 않습니다.");

    const updated = users.map((u) => (u.id === userId ? { ...u, pw } : u));
    setUsers(updated);

    alert("비밀번호가 성공적으로 변경되었습니다!");
    navigate("/login");
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

        {/* 변경됨: 텍스트 형태 뒤로가기 삭제 → 공통 버튼 적용 */}
        <BackButton />
      </div>
    </div>
  );
}
