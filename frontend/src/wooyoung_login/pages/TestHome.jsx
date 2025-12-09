import { useAuth } from "../auth/AuthContext";

export default function TestHome() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "40px" }}>
      <h1>메인 페이지</h1>
      <p>현재 로그인한 사용자:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
