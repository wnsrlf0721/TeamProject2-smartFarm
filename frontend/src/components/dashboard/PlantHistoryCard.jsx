// src/components/dashboard/PlantHistoryCard.jsx

import "./PlantHistoryCard.css";

export default function PlantHistoryCard({ history = [] }) {
  const icons = {
    water: "💧",
    repot: "🌱",
    trim: "✂️",
    light: "💡",
    nutrient: "🧪",
  };

  const visible = history.slice(0, 4);

  return (
    <div className="history-card">
      <div className="history-header">
        <h3>Recent Activities</h3>
        <span className="more-btn">더보기</span>
      </div>

      {visible.length === 0 && <div className="history-empty">아직 관리 기록이 없습니다.</div>}

      <div className="history-list">
        {visible.map((item, idx) => (
          <div className="history-item" key={idx}>
            <span className="history-icon">{icons[item.type] || "📝"}</span>
            <div className="history-info">
              <span className="history-title">{item.title}</span>
              <span className="history-date">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
