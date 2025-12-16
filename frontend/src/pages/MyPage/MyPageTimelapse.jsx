import React, {useEffect, useState} from "react";
import styles from "./MyPageTimelapse.module.css";
import {getTimeLapse} from "../../api/mypage/mypageAPI";
import {useAuth} from "../../api/auth/AuthContext";
import {useNavigate} from "react-router-dom";

function MyPageTimelapse() {
  const [myPageTimelapseList, setMyPageTimelapseList] = useState([]);
  const {user} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    getTimeLapse(user.userId)
      .then((data) => {
        setMyPageTimelapseList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user, navigate]);

  return (
    <div className={styles.timelapsePage}>
      <h1 className={styles.timelapseTitle}>타임랩스 관리</h1>

      {myPageTimelapseList.map((device) => (
        <div key={device.novaId} className={styles.deviceBox}>
          <h2 className={styles.deviceTitle}>{device.novaSerialNumber}</h2>

          {/* farmId 기준으로 그룹핑 */}
          {Object.values(
            device.timelapseResponseDTOList.reduce((acc, tl) => {
              const farmId = tl.farm.farmId;

              if (!acc[farmId]) {
                acc[farmId] = {
                  farmName: tl.farm.farmName,
                  timelapses: [],
                };
              }

              acc[farmId].timelapses.push(tl);
              return acc;
            }, {})
          ).map((farm, idx) => (
            <div key={idx} className={styles.farmBox}>
              <h3 className={styles.farmTitle}>{farm.farmName}</h3>

              {farm.timelapses.length === 0 && (
                <div className={styles.noTimelapse}>타임랩스가 없습니다.</div>
              )}

              <div className={styles.timelapseList}>
                {farm.timelapses.map((tl) => {
                  const hasVideo = tl.videoList && tl.videoList.length > 0;

                  return (
                    <div
                      key={tl.settingId}
                      className={`${styles.timelapseCard} ${
                        styles["status-" + (hasVideo ? "done" : "pending")]
                      }`}
                    >
                      <h4 className={styles.tlTitle}>{tl.timelapseName}</h4>

                      {hasVideo ? (
                        <div className={styles.tlActions}>
                          <button className={styles.viewBtn}>보기</button>
                          <button className={styles.downloadBtn}>다운로드</button>
                          <div className={styles.tlSize}>용량: {tl.videoList[0].size}</div>
                        </div>
                      ) : (
                        <div className={styles.pendingText}>제작 예정</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MyPageTimelapse;
