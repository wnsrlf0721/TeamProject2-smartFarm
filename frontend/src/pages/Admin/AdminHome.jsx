import { useAuth } from "../../api/auth/AuthContext";

export default function AdminHome() {
  const { user } = useAuth();

  return (
    <div style={{ padding: "40px" }}>
      <h1>관리자 페이지</h1>

      <p>현재 로그인한 관리자 정보:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <p style={{ marginTop: "20px" }}>
        🚧 관리자 대시보드는 추후 추가 예정입니다.
      </p>
    </div>
  );
}
