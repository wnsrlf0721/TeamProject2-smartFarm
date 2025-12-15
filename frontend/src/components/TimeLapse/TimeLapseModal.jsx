import React, {useEffect, useState} from "react";
import {timelapseView} from "../../api/timelapse/timelapseAPI";
import styles from "./TimeLapseModal.module.css";

export default function TimeLapseModal({farm, onClose}) {
  const [timelapseList, setTimelpaseList] = useState([]);
  useEffect(() => {
    // timelapseView(farm.farmId)
    timelapseView(1) // 목데이터 사용
      .then((data) => {
        setTimelpaseList(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  const mockTimelapseList = [
    {
      id: 1,
      name: "전체 영상 1",
      preset_step_id: 1,
      duration: 10,
      fps: 30,
      resolution: "1920x1080",
      state: "PENDING",
    },
    {
      id: 2,
      name: "전체 영상 2",
      preset_step_id: 2,
      duration: 15,
      fps: 24,
      resolution: "1920x1080",
      state: "PROCESSING",
    },
    {
      id: 3,
      name: "전체 영상 3",
      preset_step_id: 3,
      duration: 20,
      fps: 30,
      resolution: "1920x1080",
      state: "DONE",
    },
  ];

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
    <div className={styles.overlay}>
      <div className={styles.modal}>
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
                <span className={styles.value}>{item.preset_step_id}</span>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
