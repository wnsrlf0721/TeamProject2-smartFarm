import { FarmCard } from "./FarmCard";
import { EmptyFarmCard } from "./EmptyFarmCard";
import styles from "./FarmGrid.module.css";

export function FarmGrid({
  farms,
  maxCards,
  onAddFarm,
  onSelectFarm,
  onTimeLapse,
}) {
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
                onClick={onSelectFarm}
                onTimeLapse={onTimeLapse}
              />
            );
          } else {
            // 해당 위치에 Farm이 없다면 EmptyFarmCard 렌더링
            return (
              <EmptyFarmCard key={index} onClick={() => onAddFarm(index)} />
            );
          }
        })}
      </div>
    </div>
  );
}
