import axios from "axios";

export const API_SERVER_HOST = "http://127.0.0.1:8080";

const backendServer = axios.create({
  baseURL: API_SERVER_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 요청 인터셉터 (JWT 자동 첨부)
backendServer.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");

    if (user) {
      const { accessToken } = JSON.parse(user);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default backendServer;
