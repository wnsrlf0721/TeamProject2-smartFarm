import backendServer from "../backendServer"; // npm install axios
import userRequest from "./userRequest";
// 백엔드로 요청을 만드는 파일

// =========================
// 1. 회원가입 API
// =========================
export const signupAPI = async (payload) => {
  try {
    const response = await backendServer.post(userRequest.signup, payload);
    return { ok: true, data: response.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "회원가입 실패",
    };
  }
};

// =========================
// 2. 로그인 API
// =========================
export const loginAPI = async (id, pw) => {
  try {
    const response = await backendServer.post(userRequest.login, {
      loginId: id,
      password: pw,
    });

    return { ok: true, data: response.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "아이디 또는 비밀번호가 틀렸습니다.",
    };
  }
};

// =========================
// 3. 아이디 찾기 API
// =========================
export const findIdAPI = async (name, email, phone) => {
  try {
    const response = await backendServer.post(userRequest.findId, {
      name,
      email,
      phoneNumber: phone,
    });

    return { ok: true, loginId: response.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "아이디를 찾을 수 없습니다.",
    };
  }
};

// =========================
// 4. 비밀번호 재설정 (loginId 기준 - 유지)
// =========================
export const resetPasswordAPI = async (loginId, password) => {
  try {
    const res = await backendServer.post("/api/users/password/reset", {
      loginId,
      password,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "비밀번호 변경에 실패했습니다.",
    };
  }
};

// =========================
// 5. 아이디 중복확인
// =========================
export const checkLoginIdAPI = async (loginId) => {
  try {
    const res = await backendServer.get("/api/users/check-loginid", {
      params: { loginId },
    });

    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "중복 확인 실패",
    };
  }
};

// =========================
// 6. 이메일 인증 (회원가입용)
// =========================
export const sendEmailAuthAPI = async (email) => {
  try {
    const res = await backendServer.post("/api/users/email/send", { email });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호 전송 실패",
    };
  }
};

export const verifyEmailAuthAPI = async (email, code) => {
  try {
    const res = await backendServer.post("/api/users/email/verify", {
      email,
      code,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호가 올바르지 않습니다",
    };
  }
};

// =========================
// 7. 비밀번호 찾기 - 이메일
// =========================
export const sendPwEmailAuthAPI = async (email) => {
  try {
    const res = await backendServer.post("/api/users/password/email/send", {
      email,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호 전송 실패",
    };
  }
};

export const verifyPwEmailAuthAPI = async (email, code) => {
  try {
    const res = await backendServer.post("/api/users/password/email/verify", {
      email,
      code,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호가 올바르지 않습니다",
    };
  }
};

// 👉 email 기준 reset (⚠️ /reset 아님)
export const resetPasswordByEmailAPI = async (email, password) => {
  try {
    const res = await backendServer.post("/api/users/password/email/reset", {
      email,
      password,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "비밀번호 변경 실패",
    };
  }
};

// =========================
// 8. 비밀번호 찾기 - 전화번호
// =========================
export const sendPwPhoneAuthAPI = async (phoneNumber) => {
  try {
    const res = await backendServer.post("/api/users/password/phone/send", {
      phoneNumber,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호 전송 실패",
    };
  }
};

export const verifyPwPhoneAuthAPI = async (phoneNumber, code) => {
  try {
    const res = await backendServer.post("/api/users/password/phone/verify", {
      phoneNumber,
      code,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "인증번호가 올바르지 않습니다",
    };
  }
};

// 👉 phone 기준 reset (⚠️ /reset 아님)
export const resetPasswordByPhoneAPI = async (phoneNumber, password) => {
  try {
    const res = await backendServer.post("/api/users/password/phone/reset", {
      phoneNumber,
      password,
    });
    return { ok: true, msg: res.data };
  } catch (err) {
    return {
      ok: false,
      msg: err.response?.data || "비밀번호 변경 실패",
    };
  }
};
