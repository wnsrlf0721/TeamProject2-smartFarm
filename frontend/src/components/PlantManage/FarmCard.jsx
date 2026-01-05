import {
  calculateElapsedDays,
  // getStepName,
} from "../../pages/PlantManage/dateUtils";
import styles from "./FarmCard.module.css";

export function FarmCard({ farm, onClick, onTimeLapse, onDelete, onEdit }) {
  const elapsedDays = calculateElapsedDays(farm.createdTime);
  const preset = farm.presetStep.preset;
  const presetStep = farm.presetStep;

  // const stageName = getStepName(farm.stepId);
  // 버튼 클릭 핸들러: 이벤트 전파를 막고 타임랩스 함수 실행
  const handleTimeLapseClick = (e) => {
    e.stopPropagation(); // 부모(카드)의 onClick 이벤트가 발생하지 않도록 막음
    onTimeLapse(farm); // 타임랩스 모달 열기 함수 실행
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 1. 카드 클릭 이벤트가 발생하지 않도록 전파 중단

    // 2. 브라우저 기본 confirm 창을 사용하여 삭제 여부 확인
    const isConfirmed = window.confirm(
      `[${farm.farmName}] 팜을 정말 삭제하시겠습니까?\n삭제 시 해당 팜 정보를 다시 불러올 수 없습니다.`
    );

    // 3. '확인(예)'를 눌렀을 때만 부모에게 farmId 전달하여 삭제 로직 실행
    if (isConfirmed) {
      onDelete(farm.farmId);
    }
  };

  // 설정(프리셋) 변경 버튼 핸들러
  const handleEditClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onEdit(farm);
  };
  return (
    <div className={styles["farm-card"]} onClick={onClick}>
      <button className={styles["delete-btn"]} onClick={handleDeleteClick} title="팜 삭제">
        {/* 휴지통 SVG 아이콘 */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </button>
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
            <span className={styles[("info-value", "info-value-green")]}>{preset.plantType}</span>
          </div>
          <div className={styles["farm-info-item"]}>
            <span className={styles["info-label"]}>단계</span>
            <span className={styles[("info-value", "info-value-blue")]}>{presetStep.growthStep}</span>
          </div>
          <div className={styles["farm-info-item"]}>
            <span className={styles["info-label"]}>재배일</span>
            <span className={styles[("info-value", "info-value-purple")]}>{elapsedDays}일</span>
          </div>
        </div>
        <div className={styles["button-group"]}>
          {/* 왼쪽: 설정 변경 버튼 */}
          <button className={`${styles["action-btn"]} ${styles["edit-btn"]}`} onClick={handleEditClick}>
            <span className={styles["button-icon"]}>⚙️</span>
            설정
          </button>

          {/* 오른쪽: 타임랩스 버튼 */}
          <button className={`${styles["action-btn"]} ${styles["timelapse-btn"]}`} onClick={handleTimeLapseClick}>
            <span className={styles["button-icon"]}>📹</span>
            타임랩스
          </button>
        </div>
      </div>
    </div>
  );
}
