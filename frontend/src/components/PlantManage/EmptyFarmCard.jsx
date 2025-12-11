import './EmptyFarmCard.css';

export function EmptyFarmCard({ onClick }) {
  return (
    <div className="farm-card" onClick={onClick}>
      <div className="empty-farm-card-content">
        <button className="add-farm-button">+</button>
        <p className="empty-farm-title">새로운 팜 추가</p>
        <p className="empty-farm-subtitle">클릭하여 팜을 생성하세요</p>
      </div>
    </div>
  );
}
