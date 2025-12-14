import "./MyPage.css";

import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
// import {getUserInfo} from "../../api/mypage/mypageAPI";

function MyPage(userId) {
  // userId 상위에서 받아오는 값
  // 토큰에서 분리해서 가져올 예정
  const mockUserId = 1; // 우선 mock데이터 사용

  const [userInfo, setUserInfo] = useState({
    usersResponseDTO: {
      userId: "",
      loginId: "",
      password: "",
      name: "",
      email: "",
      phoneNumber: "",
      postalCode: "",
      address: "",
      addressDetail: "",
    },
    novaResponseDTOList: [],
  });
  useEffect(() => {
    getUserInfo(mockUserId)
      .then((data) => {
        setUserInfo(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        {/* 서브페이지가 이곳에 렌더링됨 */}
        <Outlet context={{userInfo, setUserInfo}} />
      </div>
    </div>
  );
}

export default MyPage;
