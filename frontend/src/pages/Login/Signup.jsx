import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/auth/AuthContext";
import { checkLoginIdAPI, sendEmailAuthAPI, verifyEmailAuthAPI } from "../../api/user/userAPI";
import BackButton from "../../components/loginBackButton/BackButton";
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

  const [errors, setErrors] = useState({});
  const [idChecked, setIdChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ===== 이메일 인증 UI/상태 =====
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  // ===== 타이머 =====
  const AUTH_EXPIRE_TIME = 180; // 3분
  const RESEND_COOLDOWN = 30; // 30초
  const [authRemainTime, setAuthRemainTime] = useState(0);
  const [cooldownRemain, setCooldownRemain] = useState(0);
  const timerRef = useRef(null);

  // ===== 다음 주소 =====
  const daumLoadedRef = useRef(false);
  const [isDaumLoaded, setIsDaumLoaded] = useState(false);

  /* ================= 주소 API ================= */
  useEffect(() => {
    if (daumLoadedRef.current) return;

    if (window.daum && window.daum.Postcode) {
      setIsDaumLoaded(true);
      daumLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      setIsDaumLoaded(true);
      daumLoadedRef.current = true;
    };
    document.body.appendChild(script);
  }, []);

  /* ================= 타이머(인증 유효시간 + 재전송 쿨타임) ================= */
  useEffect(() => {
    // 인증 완료면 타이머 돌릴 이유 없음
    if (!emailSent || emailVerified) return;

    // 기존 interval 제거
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setAuthRemainTime((prev) => {
        // 0 되면 만료 처리 (단, 인증 완료 상태는 절대 건드리지 않음)
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;

          // 만료 시 메시지만 띄우고, "이미 인증됨"이면 그대로 유지
          setEmailMessage("인증번호가 만료되었습니다. 다시 요청해주세요.");
          return 0;
        }
        return prev - 1;
      });

      setCooldownRemain((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [emailSent, emailVerified]);

  /* ================= 입력 처리 ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 전화번호 숫자만
    if (name === "phone") {
      const onlyNum = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({ ...prev, phone: onlyNum }));
      return;
    }

    // 아이디 바꾸면 중복확인 다시
    if (name === "id") {
      setIdChecked(false);
      setErrors((prev) => ({ ...prev, id: "" }));
    }

    // 이메일 바꾸면 "기존 인증"은 무효로 돌려야 정상
    if (name === "email") {
      setEmailSent(false);
      setEmailVerified(false);
      setShowEmailCodeInput(false);
      setEmailMessage("");
      setAuthRemainTime(0);
      setCooldownRemain(0);
      setForm((prev) => ({ ...prev, email: value, emailCode: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= 아이디 중복확인 ================= */
  const handleCheckId = async () => {
    if (!form.id) {
      alert("아이디를 입력하세요");
      return;
    }
    if (form.id.length < 5) {
      setErrors((prev) => ({ ...prev, id: "아이디는 5글자 이상이어야 합니다" }));
      return;
    }

    const result = await checkLoginIdAPI(form.id);

    if (!result.ok) {
      setErrors((prev) => ({ ...prev, id: result.msg }));
      setIdChecked(false);
      return;
    }

    setErrors((prev) => ({ ...prev, id: "" }));
    setIdChecked(true);
    alert(result.msg);
  };

  /* ================= 이메일 인증번호 발송 ================= */
  const handleSendEmailAuth = async () => {
    // 이미 인증되었으면 재전송 불가 (원하면 "이메일 변경" 유도)
    if (emailVerified) {
      setEmailMessage("이미 인증 완료되었습니다. 이메일을 변경하려면 이메일을 수정해주세요.");
      return;
    }

    // 쿨타임 중이면 막기
    if (cooldownRemain > 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: "이메일을 입력하세요" }));
      return;
    }
    if (!emailRegex.test(form.email)) {
      setErrors((prev) => ({ ...prev, email: "이메일 형식이 올바르지 않습니다" }));
      return;
    }

    // 이메일 관련 에러 제거
    setErrors((prev) => ({ ...prev, email: "" }));

    const result = await sendEmailAuthAPI(form.email);

    if (!result.ok) {
      setEmailMessage(result.msg || "인증번호 전송에 실패했습니다.");
      return;
    }

    // 발송 성공 시: 입력창 열고, 이전 인증값/코드 초기화 + 타이머 세팅
    setShowEmailCodeInput(true);
    setEmailSent(true);
    setEmailVerified(false);
    setForm((prev) => ({ ...prev, emailCode: "" }));

    setEmailMessage("인증번호가 이메일로 전송되었습니다.");
    setAuthRemainTime(AUTH_EXPIRE_TIME);
    setCooldownRemain(RESEND_COOLDOWN);
  };

  /* ================= 이메일 인증번호 검증 ================= */
  const handleVerifyEmailAuth = async () => {
    if (emailVerified) return;

    if (!emailSent) {
      setEmailMessage("먼저 인증번호를 요청해주세요.");
      return;
    }

    if (authRemainTime <= 0) {
      setEmailMessage("인증번호가 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    if (!form.emailCode) {
      setEmailMessage("인증번호를 입력하세요");
      return;
    }

    const result = await verifyEmailAuthAPI(form.email, form.emailCode);

    if (!result.ok) {
      setEmailVerified(false);
      setEmailMessage(result.msg || "인증번호가 올바르지 않습니다.");
      return;
    }

    // 인증 성공
    setEmailVerified(true);
    setEmailMessage("이메일 인증이 완료되었습니다.");
    setAuthRemainTime(0);
    setCooldownRemain(0);

    // 타이머 정지
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  /* ================= 주소 검색 ================= */
  const handleAddressSearch = () => {
    if (!isDaumLoaded) {
      alert("주소 검색 준비 중입니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          addr1: data.address,
        }));
      },
    }).open();
  };

  /* ================= 제출 ================= */
  const handleSubmit = async () => {
    setIsSubmitted(true);

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.id) newErrors.id = "아이디를 입력하세요";
    else if (form.id.length < 5) newErrors.id = "아이디는 5글자 이상이어야 합니다";
    else if (!idChecked) newErrors.id = "아이디 중복확인을 해주세요";

    if (!form.pw) newErrors.pw = "비밀번호를 입력하세요";
    else if (form.pw.length < 8 || form.pw.length > 16)
      newErrors.pw = "비밀번호는 8~16자여야 합니다";

    if (!form.pw2) newErrors.pw2 = "비밀번호 확인을 입력하세요";
    else if (form.pw !== form.pw2) newErrors.pw2 = "비밀번호가 일치하지 않습니다";

    if (!form.name) newErrors.name = "이름을 입력하세요";

    if (!form.phone || form.phone.length !== 11) newErrors.phone = "전화번호는 11자리 숫자입니다";

    if (!form.zipcode) newErrors.zipcode = "우편번호를 입력하세요";
    if (!form.addr1) newErrors.addr1 = "기본주소를 입력하세요";
    if (!form.addr2) newErrors.addr2 = "상세주소를 입력하세요";

    if (!form.email) newErrors.email = "이메일을 입력하세요";
    else if (!emailRegex.test(form.email)) newErrors.email = "이메일 형식이 올바르지 않습니다";
    else if (!emailVerified) newErrors.email = "이메일 인증을 완료해주세요";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      loginId: form.id,
      password: form.pw,
      name: form.name,
      email: form.email,
      phoneNumber: form.phone,
      postalCode: form.zipcode,
      address: form.addr1,
      addressDetail: form.addr2,
    };

    const result = await signup(payload);
    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert("회원가입 완료!");
    navigate("/login");
  };

  /* ================= UI ================= */
  const resendButtonText =
    cooldownRemain > 0 ? `재전송 (${cooldownRemain}s)` : emailVerified ? "인증완료" : "인증번호";

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>

        {/* ===== 아이디 ===== */}
        <div className="row-flex">
          <input
            name="id"
            className={`input ${errors.id ? "error" : ""}`}
            placeholder="아이디"
            onChange={handleChange}
          />
          <button type="button" className="btn-gray" onClick={handleCheckId} disabled={idChecked}>
            {idChecked ? "확인완료" : "중복확인"}
          </button>
        </div>

        {/*  기존 구조(힌트/오류/성공 문구 항상) 유지 */}
        <p className={`error-text ${errors.id ? "" : idChecked ? "success-text" : "hint-text"}`}>
          {errors.id
            ? errors.id
            : idChecked
            ? "사용 가능한 아이디입니다"
            : "아이디는 5글자 이상 입력해주세요"}
        </p>

        {/* ===== 비밀번호 ===== */}
        <input
          name="pw"
          type="password"
          className={`input ${errors.pw ? "error" : ""}`}
          placeholder="비밀번호"
          onChange={handleChange}
        />
        <p className={`error-text ${!errors.pw ? "hint-text" : ""}`}>
          {errors.pw || "비밀번호는 8~16자여야 합니다"}
        </p>

        <input
          name="pw2"
          type="password"
          className={`input ${errors.pw2 ? "error" : ""}`}
          placeholder="비밀번호 재확인"
          onChange={handleChange}
        />
        <p className={`error-text ${!errors.pw2 ? "hint-text" : ""}`}>
          {errors.pw2 || "비밀번호를 한 번 더 입력해주세요"}
        </p>

        {/* ===== 이름 ===== */}
        <input
          name="name"
          className={`input ${errors.name ? "error" : ""}`}
          placeholder="이름"
          onChange={handleChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        {/* ===== 전화 ===== */}
        <input
          name="phone"
          className={`input ${errors.phone ? "error" : ""}`}
          placeholder="전화번호 (- 없이 11자리)"
          value={form.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}

        {/* ===== 주소 ===== */}
        <div className="row-flex">
          <input
            name="zipcode"
            className={`input flex-1 ${errors.zipcode ? "error" : ""}`}
            placeholder="우편번호"
            value={form.zipcode}
            readOnly
          />
          <button type="button" className="btn-gray" onClick={handleAddressSearch}>
            검색
          </button>
        </div>
        {errors.zipcode && <p className="error-text">{errors.zipcode}</p>}

        <input
          name="addr1"
          className={`input ${errors.addr1 ? "error" : ""}`}
          placeholder="기본주소"
          value={form.addr1}
          readOnly
        />
        {errors.addr1 && <p className="error-text">{errors.addr1}</p>}

        <input
          name="addr2"
          className={`input ${errors.addr2 ? "error" : ""}`}
          placeholder="상세주소"
          onChange={handleChange}
        />
        {errors.addr2 && <p className="error-text">{errors.addr2}</p>}

        {/* ===== 이메일 ===== */}
        <div className="row-flex">
          <input
            name="email"
            className={`input flex-1 ${errors.email ? "error" : ""}`}
            placeholder="이메일 주소"
            onChange={handleChange}
          />
          <button
            type="button"
            className="btn-gray"
            onClick={handleSendEmailAuth}
            disabled={cooldownRemain > 0 || emailVerified}
            title={emailVerified ? "이미 인증 완료" : ""}
          >
            {resendButtonText}
          </button>
        </div>

        {/*  회원가입 검증용 이메일 오류(빨간 글씨) - 기존 구조 유지 */}
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/*  이메일 인증 관련 메시지(성공/실패/만료 등) */}
        {emailMessage && (
          <p className={`error-text ${emailVerified ? "success-text" : ""}`}>{emailMessage}</p>
        )}

        {showEmailCodeInput && (
          <div className="row-flex">
            <input
              name="emailCode"
              className="input flex-1"
              placeholder="인증번호 입력"
              onChange={handleChange}
              disabled={emailVerified}
            />
            <button
              type="button"
              className="btn-gray"
              onClick={handleVerifyEmailAuth}
              disabled={emailVerified}
            >
              인증확인
            </button>
          </div>
        )}

        {/*  인증 완료면 만료시간 안 보이게 */}
        {showEmailCodeInput && authRemainTime > 0 && !emailVerified && (
          <p className="hint-text">
            남은 시간: {Math.floor(authRemainTime / 60)}:
            {(authRemainTime % 60).toString().padStart(2, "0")}
          </p>
        )}

        <button className="signup-btn" onClick={handleSubmit}>
          가입하기
        </button>

        <BackButton />
      </div>
    </div>
  );
}
