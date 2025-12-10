import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import BackButton from "../components/BackButton";
import "./Find.css";

export default function IDFindPage() {
  const { users } = useAuth();
  const [tab, setTab] = useState("email");

  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const findId = () => {
    let found;

    if (tab === "email") {
      found = users.find((u) => u.name === name && u.email === value);
    } else {
      found = users.find((u) => u.name === name && u.phone === value);
    }

    if (!found) return alert("해당 정보로 가입된 ID가 없습니다!");

    alert(`✔ 찾은 ID: ${found.id}`);
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>ID 찾기</h2>

        {/* 탭 */}
        <div className="find-tabs">
          <span className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}>
            이메일로 찾기
          </span>
          <span className={tab === "phone" ? "active" : ""} onClick={() => setTab("phone")}>
            전화번호로 찾기
          </span>
        </div>

        {/* 이름 입력 */}
        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 이메일 또는 전화번호 */}
        <input
          className="input"
          placeholder={tab === "email" ? "이메일" : "전화번호"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button className="green-btn" onClick={findId}>
          ID 찾기
        </button>

        {/*  통일된 뒤로가기 버튼 */}
        <BackButton />
      </div>
    </div>
  );
}
