import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";
//axios 설정파일
const api = axios.create({
  baseURL: API_SERVER_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
