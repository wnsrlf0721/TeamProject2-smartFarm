import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({ to = -1 }) {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(to)}>
      ⬅ 뒤로가기
    </button>
  );
}
