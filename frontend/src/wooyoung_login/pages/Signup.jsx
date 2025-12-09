import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Signup.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    pw: "",
    pw2: "",
    name: "",
    phone: "",
    zipcode: "",
    addr1: "",
    addr2: "",
    email: "",
    emailCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.pw !== form.pw2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = signup(form);
    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert("회원가입 완료!");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>

        <input name="id" className="input" placeholder="아이디" onChange={handleChange} />

        <input
          name="pw"
          type="password"
          className="input"
          placeholder="비밀번호"
          onChange={handleChange}
        />

        <input
          name="pw2"
          type="password"
          className="input"
          placeholder="비밀번호 재확인"
          onChange={handleChange}
        />

        <input name="name" className="input" placeholder="이름" onChange={handleChange} />

        <input name="phone" className="input" placeholder="전화번호" onChange={handleChange} />

        {/* 주소 */}
        <div className="row-flex">
          <input
            name="zipcode"
            className="input flex-1"
            placeholder="우편번호"
            onChange={handleChange}
          />
          <button className="btn-gray fit-btn">검색</button>
        </div>

        <input name="addr1" className="input" placeholder="기본주소" onChange={handleChange} />
        <input name="addr2" className="input" placeholder="상세주소" onChange={handleChange} />

        {/* 이메일 */}
        <div className="row-flex">
          <input
            name="email"
            className="input flex-1"
            placeholder="이메일 주소"
            onChange={handleChange}
          />
          <button className="btn-gray fit-btn">인증번호</button>
        </div>

        <input
          name="emailCode"
          className="input"
          placeholder="인증번호 입력"
          onChange={handleChange}
        />

        <button className="signup-btn" onClick={handleSubmit}>
          가입하기
        </button>
      </div>
    </div>
  );
}
