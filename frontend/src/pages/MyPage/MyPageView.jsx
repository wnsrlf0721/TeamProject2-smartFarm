import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./MyPageView.module.css";
import {useOutletContext} from "react-router-dom";

function MyPageView() {
  const navigate = useNavigate();
  const {userInfo, novaList} = useOutletContext();

  return (
    <div className={styles.mypageCard}>
      <h1 className={styles.mypageTitle}>마이페이지</h1>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>아이디</div>
        <div className={styles.infoValue}>{userInfo.loginId}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>이름</div>
        <div className={styles.infoValue}>{userInfo.name}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>전화번호</div>
        <div className={styles.infoValue}>{userInfo.phoneNumber}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>주소</div>
        <div
          className={styles.infoValue}
        >{`(${userInfo.postalCode}) ${userInfo.address} ${userInfo.addressDetail}`}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>이메일</div>
        <div className={styles.infoValue}>{userInfo.email}</div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>NOVA 시리얼 번호</div>
        <div className={styles.serialList}>
          {novaList.map((novaResponseDTO, i) => (
            <div key={i} className={styles.serialItemView}>
              {novaResponseDTO.novaSerialNumber}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttonArea}>
        <button className={styles.editBtn} onClick={() => navigate("/mypage/edit")}>
          정보 수정하기
        </button>
      </div>
    </div>
  );
}

export default MyPageView;
