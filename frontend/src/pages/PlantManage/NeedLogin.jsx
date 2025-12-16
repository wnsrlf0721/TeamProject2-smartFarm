import { useNavigate } from "react-router-dom";
import "./PlantManage";

export default function NeedLogin() {
  const navigate = useNavigate();

  return (
    <div className="need-login-page">
      <div className="need-login-wrap">
        <div className="need-login-box">
          <h2>로그인이 필요합니다</h2>
          <p>내 식물 관리는 로그인한 사용자만 이용할 수 있어요.</p>
          <button className="login-go-btn" onClick={() => navigate("/login")}>
            로그인 하러 가기 →
          </button>
        </div>
      </div>
    </div>
  );
}
