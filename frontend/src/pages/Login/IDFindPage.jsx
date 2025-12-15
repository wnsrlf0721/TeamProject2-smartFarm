import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/loginBackButton/BackButton";
import { findIdAPI } from "../../api/user/userAPI";
import "./Find.css";

export default function IDFindPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("email");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const handleFindId = async () => {
    if (!name || !value) {
      alert("정보를 모두 입력해주세요.");
      return;
    }

    const result =
      tab === "email" ? await findIdAPI(name, value, null) : await findIdAPI(name, null, value);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert(`아이디는 "${result.loginId}" 입니다.`);
    navigate("/login");
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>ID 찾기</h2>

        <div className="find-tabs">
          <span className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}>
            이메일로 찾기
          </span>
          <span className={tab === "phone" ? "active" : ""} onClick={() => setTab("phone")}>
            전화번호로 찾기
          </span>
        </div>

        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder={tab === "email" ? "이메일" : "전화번호"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button className="green-btn" onClick={handleFindId}>
          ID 찾기
        </button>

        <BackButton />
      </div>
    </div>
  );
}
