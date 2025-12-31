import { useState } from "react";
import { findIdAPI } from "../../api/user/userAPI";
import BackButton from "../../components/loginBackButton/BackButton";
import "./Find.css";

export default function IDFind() {
  const [type, setType] = useState("email"); // email | phone
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleFindId = async () => {
    if (!name) {
      alert("이름을 입력하세요");
      return;
    }

    if (type === "email" && !email) {
      alert("이메일을 입력하세요");
      return;
    }

    if (type === "phone" && !phone) {
      alert("전화번호를 입력하세요");
      return;
    }

    const result = await findIdAPI(
      name,
      type === "email" ? email : null,
      type === "phone" ? phone : null
    );

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert(`찾은 아이디는 [ ${result.loginId} ] 입니다`);
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>ID 찾기</h2>

        {/* 탭 */}
        <div className="find-tabs">
          <span className={type === "email" ? "active" : ""} onClick={() => setType("email")}>
            이메일로 찾기
          </span>
          <span className={type === "phone" ? "active" : ""} onClick={() => setType("phone")}>
            전화번호로 찾기
          </span>
        </div>

        {/* 공통 */}
        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 이메일 */}
        {type === "email" && (
          <input
            className="input"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        {/* 전화번호 */}
        {type === "phone" && (
          <input
            className="input"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        )}

        <button className="green-btn" onClick={handleFindId}>
          ID 찾기
        </button>

        <BackButton />
      </div>
    </div>
  );
}
