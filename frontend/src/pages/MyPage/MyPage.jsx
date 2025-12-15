import "./MyPage.css";

import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUserInfo} from "../../api/mypage/mypageAPI";

function MyPage(userId) {
  // userId 상위에서 받아오는 값
  // 토큰에서 분리해서 가져올 예정
  const mockUserId = 1; // 우선 mock데이터 사용

  const [userInfo, setUserInfo] = useState({
    usersResponseDTO: {
      userId: "1",
      loginId: "1",
      password: "1",
      name: "1",
      email: "1",
      phoneNumber: "1",
      postalCode: "1",
      address: "1",
      addressDetail: "1",
    },
  });
  const [novaList, setNovaList] = useState([]);
  useEffect(() => {
    getUserInfo(mockUserId)
      .then((data) => {
        setUserInfo(data.usersResponseDTO);
        setNovaList(data.novaResponseDTOList);
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
<<<<<<< HEAD
        <Outlet context={{userInfo, setUserInfo, novaList, setNovaList}} />
=======
        <Outlet context={{ userInfo, setUserInfo }} />
>>>>>>> a668be41027dcf08be5da17d4c8d039100f99b38
      </div>
    </div>
  );
}

export default MyPage;
