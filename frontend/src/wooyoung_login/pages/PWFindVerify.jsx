import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import BackButton from "../components/BackButton";
import "./Find.css";

export default function PWFindVerify() {
  const { users } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("phone");
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [randomCode, setRandomCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [matchedUser, setMatchedUser] = useState(null);

  // 랜덤 인증번호 생성
  const generateCode = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
  };

  // 타이머 작동
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

  // 인증 요청
  const sendCode = () => {
    if (!name || !value) return alert("정보를 모두 입력해주세요.");

    const found =
      tab === "phone"
        ? users.find((u) => u.name === name && u.phone === value)
        : users.find((u) => u.name === name && u.email === value);

    if (!found) return alert("일치하는 사용자가 없습니다!");

    const code = generateCode();
    setRandomCode(code);
    setShowCodeInput(true);
    setTimeLeft(180);
    setMatchedUser(found);

    alert(`임시 인증번호(테스트): ${code}`);
  };

  // 인증번호 검증 후 PWReset으로 이동
  const verifyCode = () => {
    if (authCode !== randomCode) {
      alert("인증번호가 일치하지 않습니다.");
      return;
    }

    alert("인증 완료! 다음 단계로 이동합니다.");

    navigate("/find/pw/reset", {
      state: { userId: matchedUser.id },
    });
  };

  return (
    <div className="find-container">
      <div className="find-box">
        <h2>
          비밀번호 재설정을 위해 <br /> 사용자 확인을 진행합니다
        </h2>

        {/* 탭 */}
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

        {/* 이름 */}
        <input
          className="input"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 전화번호/이메일 + 인증 요청 */}
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

        {/* 인증번호 입력 */}
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

        {/* 🔥 통일된 뒤로가기 버튼 */}
        <BackButton />
      </div>
    </div>
  );
}
