import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/loginBackButton/BackButton";
import {
  sendPwEmailAuthAPI,
  verifyPwEmailAuthAPI,
  sendPwPhoneAuthAPI,
  verifyPwPhoneAuthAPI,
} from "../../api/user/userAPI";
import "./Find.css";

export default function PWFindVerify() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("phone");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // 인증번호 요청
  const sendCode = async () => {
    if (!name || !value) {
      alert("정보를 모두 입력해주세요.");
      return;
    }

    const result =
      tab === "email" ? await sendPwEmailAuthAPI(value) : await sendPwPhoneAuthAPI(value);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    setShowCodeInput(true);
    setTimeLeft(180);
    alert(result.msg);
  };

  // 인증 확인
  const verifyCode = async () => {
    const result =
      tab === "email"
        ? await verifyPwEmailAuthAPI(value, authCode)
        : await verifyPwPhoneAuthAPI(value, authCode);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    /**
     * ✅ 핵심
     * 지금 프로젝트 구조상
     * email / phone === loginId 로 사용 중
     */
    const loginId = value;

    // ✅ reset 페이지 대비 안전장치
    localStorage.setItem("pwResetLoginId", loginId);

    alert("인증 완료!");

    navigate("/find/pw/reset", {
      state: {
        type: tab, // "email" | "phone"
        value: value, // email or phoneNumber
      },
    });
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>
          비밀번호 재설정을 위해 <br /> 사용자 확인을 진행합니다
        </h2>

        <div className="find-tabs">
          <span
            className={tab === "phone" ? "active" : ""}
            onClick={() => {
              setTab("phone");
              setShowCodeInput(false);
            }}
          >
            전화번호 인증
          </span>

          <span
            className={tab === "email" ? "active" : ""}
            onClick={() => {
              setTab("email");
              setShowCodeInput(false);
            }}
          >
            이메일 인증
          </span>
        </div>

        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="auth-row">
          <input
            className="input flex-1"
            placeholder={tab === "phone" ? "전화번호" : "이메일"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button className="auth-btn" onClick={sendCode}>
            인증요청
          </button>
        </div>

        {showCodeInput && (
          <div className="auth-section">
            <div className="auth-row">
              <input
                className="input auth-input"
                placeholder="인증번호 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
              />

              <div className="timer-box">
                {timeLeft > 0 ? (
                  <span>{formatTime(timeLeft)}</span>
                ) : (
                  <span className="timeout">시간 초과</span>
                )}
              </div>
            </div>

            <button className="green-btn" onClick={verifyCode}>
              다음
            </button>
          </div>
        )}

        <BackButton />
      </div>
    </div>
  );
}
