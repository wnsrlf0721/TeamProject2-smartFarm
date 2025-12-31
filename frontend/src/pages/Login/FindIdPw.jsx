import { useNavigate } from "react-router-dom";
import BackButton from "../../components/loginBackButton/BackButton";
import "./Find.css";

export default function FindIdPw() {
  const navigate = useNavigate();

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>ID / PW 찾기</h2>

        {/* 수평 구분선 */}
        <div className="find-title-line"></div>

        {/* 옵션 버튼 */}
        <button className="find-option" onClick={() => navigate("/find/id")}>
          ID 찾기
        </button>

        <button className="find-option" onClick={() => navigate("/find/pw/verify")}>
          비밀번호 찾기
        </button>

        {/* 🔥 공통 뒤로가기 버튼 */}
        <BackButton />
      </div>
    </div>
  );
}
