import React, {useEffect, useState} from "react";
import {timelapseView} from "../../api/timelapse/timelapseAPI";
import styles from "./TimeLapseModal.module.css";

export default function TimeLapseModal({farm, onClose}) {
  const [timelapseList, setTimelpaseList] = useState([]);

  useEffect(() => {
    if (!farm?.farmId) return;

    timelapseView(farm.farmId)
      .then((data) => {
        setTimelpaseList(data);
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
      case "DONE":
        return "제작 완료";
      default:
        return "-";
    }
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
                <span className={styles.value}>{item.name}</span>
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
                <span className={styles.value}>{item.preset_step_id ?? "전체"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 기존 닫기 버튼 유지 */}
        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
