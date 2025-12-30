import React, {useEffect, useState} from "react";
import styles from "./MyPageTimelapse.module.css";
import {getTimeLapse} from "../../api/mypage/mypageAPI";
import {useAuth} from "../../api/auth/AuthContext";
import {useNavigate} from "react-router-dom";

function MyPageTimelapse() {
  const [myPageTimelapseList, setMyPageTimelapseList] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null); // 모달에서 재생할 동영상
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
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user, navigate]);

  const handleDownload = (videoFilePath, timelapseName) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8080${videoFilePath}`; // 서버 주소 붙여서 다운로드
    link.download = `${timelapseName}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.timelapsePage}>
      <h1 className={styles.timelapseTitle}>타임랩스 관리</h1>

      {myPageTimelapseList.map((device) => (
        <div key={device.novaId} className={styles.deviceBox}>
          <h2 className={styles.deviceTitle}>{device.novaSerialNumber}</h2>

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
                          <button
                            className={styles.viewBtn}
                            onClick={() => setSelectedVideo(tl.videoList[0].videoFilePath)}
                          >
                            보기
                          </button>
                          <button
                            className={styles.downloadBtn}
                            onClick={() =>
                              handleDownload(tl.videoList[0].videoFilePath, tl.timelapseName)
                            }
                          >
                            다운로드
                          </button>
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

      {/* 동영상 모달 */}
      {selectedVideo && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <video controls autoPlay width="100%">
              <source src={`http://localhost:8080${selectedVideo}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button className={styles.closeModal} onClick={() => setSelectedVideo(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPageTimelapse;
