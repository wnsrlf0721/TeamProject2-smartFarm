import { useState } from "react";
import "./Find.css";

export default function IDFind() {
  const [tab, setTab] = useState("email");

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>ID/PW 찾기</h2>

        <div className="find-tabs">
          <span className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}>
            ID 찾기
          </span>
          <span className={tab === "phone" ? "active" : ""} onClick={() => setTab("phone")}>
            비밀번호 찾기
          </span>
        </div>

        {tab === "email" && (
          <div>
            <button className="find-option"> 이름, 이메일로 찾기</button>
            <button className="find-option"> 이름, 전화번호로 찾기</button>
          </div>
        )}
      </div>
    </div>
  );
}
