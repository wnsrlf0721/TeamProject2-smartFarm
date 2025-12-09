import {Outlet} from "react-router-dom";
import "./MyPage.css";

function MyPage() {
  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        {/* 서브페이지가 이곳에 렌더링됨 */}
        <Outlet />
      </div>
    </div>
  );
}

export default MyPage;
