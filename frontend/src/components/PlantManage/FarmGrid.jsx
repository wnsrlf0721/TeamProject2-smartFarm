import { FarmCard } from "./FarmCard";
import { EmptyFarmCard } from "./EmptyFarmCard";
import styles from "./FarmGrid.module.css";
import { deleteFarm } from "../../api/PlantManage/plantsAPI";

export function FarmGrid({ farms, maxCards, onAddFarm, onSelectFarm, onTimeLapse, onEdit }) {
  const slots = Array.from({ length: maxCards }, (_, i) => i + 1);

  return (
    <div className={styles["farm-grid-container"]}>
      <div className={styles["farm-grid"]}>
        {slots.map((index) => {
          const isFarm = farms.find((f) => f.slot === index);

          if (isFarm) {
            return (
              <FarmCard
                key={index}
                farm={isFarm}
                onClick={() => onSelectFarm(isFarm)}
                onTimeLapse={onTimeLapse}
                onEdit={onEdit}
                onDelete={async (farmId) => {
                  try {
                    const response = await deleteFarm(farmId);
                    if (response.status === 200) {
                      alert("팜이 성공적으로 삭제되었습니다.");
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error("팜 삭제 중 오류 발생:", error);
                    alert("팜 삭제에 실패했습니다. 다시 시도해주세요.");
                  }
                }}
              />
            );
          } else {
            // 해당 위치에 Farm이 없다면 EmptyFarmCard 렌더링
            return <EmptyFarmCard key={index} onClick={() => onAddFarm(index)} />;
          }
        })}
      </div>
    </div>
  );
}
