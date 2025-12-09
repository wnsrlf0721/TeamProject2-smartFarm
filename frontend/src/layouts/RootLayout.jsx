import { Outlet } from "react-router-dom";
import Header from "./header/Header";

const mockUser = {
  name: "테스트 유저",
  role: "일반회원",
  profileImg: "/test-user.png",
};

export default function RootLayout() {
  return (
    <>
      {/* ★ Header는 반드시 Router 안에서 렌더링되어야 한다 */}
      <Header user={mockUser} />

      {/* ★ 모든 라우트 페이지가 이 아래에 그려진다 */}
      <main>
        <Outlet />
      </main>
    </>
  );
}
