import { FarmCard } from './FarmCard';
import { EmptyFarmCard } from './EmptyFarmCard';
import './FarmGrid.css';

export function FarmGrid({ farms, maxCards, onAddFarm, onSelectFarm, onTimeLapse }) {
  const emptySlots = maxCards - farms.length;

  return (
    <div className="farm-grid-container">
      <div className="farm-grid">
        {farms.map((farm) => (
          <FarmCard key={farm.slot} farm={farm} onClick={onSelectFarm} onTimeLapse={() => onTimeLapse(farm)}/>
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <EmptyFarmCard key={farms.length+index} onClick={onAddFarm} />
        ))}
      </div>
    </div>
  );
}