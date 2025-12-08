
import { calculateElapsedDays, getStepName } from '../../pages/PlantManage/dateUtils';
import './FarmCard.css';

export function FarmCard({ farm, onClick, onTimeLapse }) {
  const elapsedDays = calculateElapsedDays(farm.createdTime);
  const stageName = getStepName(farm.stepId);
  // 버튼 클릭 핸들러: 이벤트 전파를 막고 타임랩스 함수 실행
  const handleTimeLapseClick = (e) => {
    e.stopPropagation(); // 부모(카드)의 onClick 이벤트가 발생하지 않도록 막음
    onTimeLapse();       // 타임랩스 모달 열기 함수 실행
  };
  return (
    <div className="farm-card" onClick={onClick}>
      <div className="farm-card-image">
        <img
          src={farm.image || 'figma:asset/3b935539e1a32b33472fa13c4e9875a8c504995c.png'} 
          alt={farm.farmName} 
        />
      </div>
      <div className="farm-card-content">
        <h3 className="farm-card-title">{farm.farmName}</h3> 
        <p className="farm-card-system">{farm.presetName}</p>
        
        <div className="farm-card-info">
          <div className="farm-info-item">
            <span className="info-label">식물</span>
            <span className="info-value info-value-green">{farm.plantType}</span>
          </div>
          <div className="farm-info-item">
            <span className="info-label">단계</span>
            <span className="info-value info-value-blue">{farm.stepId}</span>
          </div>
          <div className="farm-info-item">
            <span className="info-label">재배일</span>
            <span className="info-value info-value-purple">{elapsedDays}일</span>
          </div>
        </div>
        
        <button className="farm-card-button" onClick={handleTimeLapseClick}>
          <span className="button-icon">📹</span>
          타임랩스
        </button>
      </div>
    </div>
  );
}