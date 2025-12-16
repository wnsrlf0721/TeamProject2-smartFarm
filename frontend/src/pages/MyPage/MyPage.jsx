import "./MyPage.css";
import {useAuth} from "../../api/auth/AuthContext";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getUserInfo} from "../../api/mypage/mypageAPI";

function MyPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
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
  });
  const [novaList, setNovaList] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    getUserInfo(user.userId)
      .then((data) => {
        setUserInfo(data.usersResponseDTO);
        setNovaList(data.novaResponseDTOList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user, navigate]);

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        {/* 서브페이지가 이곳에 렌더링됨 */}
        <Outlet context={{userInfo, setUserInfo, novaList, setNovaList}} />
      </div>
    </div>
  );
}

export default MyPage;
