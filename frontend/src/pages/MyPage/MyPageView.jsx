import {useState} from "react";
import {useNavigate} from "react-router-dom";

function MyPageView() {
  const navigate = useNavigate();

  const [userData] = useState({
    loginId: "sayjoy97",
    name: "장세종",
    userAddr: "경남 통영시",
    email: "sayjoy97@gmail.com",
    phoneNumber: "010-8661-6470",
    novaSerialNumber: ["NOVA-2000", "NOVA-2001"],
  });

  return (
    <div className="mypage-card">
      <h1 className="mypage-title">마이페이지</h1>

      <div className="info-row">
        <div className="info-label">아이디</div>
        <div className="info-value">{userData.loginId}</div>
      </div>

      <div className="info-row">
        <div className="info-label">이름</div>
        <div className="info-value">{userData.name}</div>
      </div>

      <div className="info-row">
        <div className="info-label">주소</div>
        <div className="info-value">{userData.userAddr}</div>
      </div>

      <div className="info-row">
        <div className="info-label">이메일</div>
        <div className="info-value">{userData.email}</div>
      </div>

      <div className="info-row">
        <div className="info-label">전화번호</div>
        <div className="info-value">{userData.phoneNumber}</div>
      </div>

      <div className="info-row">
        <div className="info-label">NOVA 시리얼 번호</div>
        <div className="serial-list">
          {userData.novaSerialNumber.map((s, i) => (
            <div key={i} className="serial-item-view">
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="button-area">
        <button className="edit-btn" onClick={() => navigate("/mypage/edit")}>
          정보 수정하기
        </button>
      </div>
    </div>
  );
}

export default MyPageView;
