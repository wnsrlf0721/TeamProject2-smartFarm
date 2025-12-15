import {
  calculateElapsedDays,
  // getStepName,
} from "../../pages/PlantManage/dateUtils";
import styles from "./FarmCard.module.css";

export function FarmCard({ farm, onClick, onTimeLapse }) {
  const elapsedDays = calculateElapsedDays(farm.createdTime);
  const preset = farm.presetStep.preset;
  const presetStep = farm.presetStep;

  // const stageName = getStepName(farm.stepId);
  // 버튼 클릭 핸들러: 이벤트 전파를 막고 타임랩스 함수 실행
  const handleTimeLapseClick = (e) => {
    e.stopPropagation(); // 부모(카드)의 onClick 이벤트가 발생하지 않도록 막음
    onTimeLapse(farm); // 타임랩스 모달 열기 함수 실행
  };
  return (
    <div className={styles["farm-card"]} onClick={onClick}>
      <div className={styles["farm-card-image"]}>
        <img
          src={
            "http://localhost:8080" + preset.presetImageUrl ||
            "figma:asset/3b935539e1a32b33472fa13c4e9875a8c504995c.png"
          }
          alt={farm.farmName}
        />
      </div>
      <div className={styles["farm-card-content"]}>
        <h3 className={styles["farm-card-title"]}>{farm.farmName}</h3>
        <p className={styles["farm-card-system"]}>{preset.presetName}</p>

        <div className={styles["farm-card-info"]}>
          <div className={styles["farm-info-item"]}>
            <span className={styles["info-label"]}>식물</span>
            <span className={styles[("info-value", "info-value-green")]}>
              {preset.plantType}
            </span>
          </div>
          <div className={styles["farm-info-item"]}>
            <span className={styles["info-label"]}>단계</span>
            <span className={styles[("info-value", "info-value-blue")]}>
              {presetStep.growthStep}
            </span>
          </div>
          <div className={styles["farm-info-item"]}>
            <span className={styles["info-label"]}>재배일</span>
            <span className={styles[("info-value", "info-value-purple")]}>
              {elapsedDays}일
            </span>
          </div>
        </div>

        <button
          className={styles["farm-card-button"]}
          onClick={handleTimeLapseClick}
        >
          <span className={styles["button-icon"]}>📹</span>
          타임랩스
        </button>
      </div>
    </div>
  );
}
