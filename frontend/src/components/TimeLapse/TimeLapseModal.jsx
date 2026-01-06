import React, {useEffect, useState} from "react";
import {timelapseView} from "../../api/timelapse/timelapseAPI";
import styles from "./TimeLapseModal.module.css";

export default function TimeLapseModal({farm, onClose}) {
  const [timelapseList, setTimelpaseList] = useState([]);
  const [selectedVideoPath, setSelectedVideoPath] = useState(null);

  useEffect(() => {
    if (!farm?.farmId) return;

    timelapseView(farm.farmId)
      .then((data) => {
        setTimelpaseList(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [farm?.farmId]);

  const convertState = (s) => {
    switch (s) {
      case "PENDING":
        return "제작 예정";
      case "PROCESSING":
        return "제작 중";
      case "COMPLETED":
        return "제작 완료";
      default:
        return "-";
    }
  };

  const handleDownload = (videoFilePath, timelapseName) => {
    const fileName = videoFilePath.split("/").pop();
    const link = document.createElement("a");
    link.href = `http://localhost:8080/video-files/${fileName}`;
    link.download = `${timelapseName}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (videoFilePath) => {
    const fileName = videoFilePath.split("/").pop();
    setSelectedVideoPath(`http://localhost:8080/video-files/${fileName}`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* 모달 클릭 시 닫히지 않도록 stopPropagation */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ❌ 우측 상단 닫기 버튼 */}
        <button className={styles.closeIcon} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>📽 {farm?.farmName} 타임랩스 목록</h2>

        <div className={styles.list}>
          {timelapseList.map((item) => (
            <div className={styles.item} key={item.id}>
              <div className={styles.infoRow}>
                <span className={styles.label}>이름:</span>
                <span className={styles.value}>{item.timelapseName}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>상태:</span>
                <span className={`${styles.state} ${styles[`state${item.state}`]}`}>
                  {convertState(item.state)}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>길이:</span>
                <span className={styles.value}>{item.duration}초</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>FPS:</span>
                <span className={styles.value}>{item.fps}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>해상도:</span>
                <span className={styles.value}>{item.resolution}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>스텝 ID:</span>
                <span className={styles.value}>{item.stepId == 0 ? "전체" : item.stepId}</span>
              </div>

              {/* ✅ 제작 완료된 경우만 버튼 표시 */}
              {item.state === "COMPLETED" && item.videoList[0].videoFilePath && (
                <div className={styles.actions}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleView(item.videoList[0].videoFilePath)}
                  >
                    보기
                  </button>

                  <button
                    className={styles.downloadBtn}
                    onClick={() => handleDownload(item.videoList[0].videoFilePath, item.name)}
                  >
                    다운로드
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 기존 닫기 버튼 유지 */}
        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>

      {/* 🎬 영상 재생 모달 */}
      {selectedVideoPath && (
        <div className={styles.videoOverlay} onClick={() => setSelectedVideoPath(null)}>
          <div className={styles.videoModal} onClick={(e) => e.stopPropagation()}>
            <video controls autoPlay width="100%">
              <source src={selectedVideoPath} type="video/mp4" />
              브라우저가 video 태그를 지원하지 않습니다.
            </video>

            <button className={styles.closeBtn} onClick={() => setSelectedVideoPath(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
