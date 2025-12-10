// src/components/dashboard/WaterLevelCard.jsx
import "./WaterLevelCard.css";

export default function WaterLevelCard({ value }) {
  const status = value < 20 ? "Low" : value > 70 ? "High" : "Normal";

  return (
    <div className="water-card">
      <div className="water-card-header">
        <span className="water-title">Water Level</span>
        <button className="water-menu-btn">⋯</button>
      </div>

      <div className="water-icon-wrap">
        <div className="water-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#41523a">
            <path d="M12 2C12 2 6 9 6 13.5C6 17.09 8.91 20 12.5 20C16.09 20 19 17.09 19 13.5C19 9 12 2 12 2Z" />
          </svg>
        </div>
      </div>

      <div className={`water-status ${status.toLowerCase()}`}>{status}</div>

      <div className="water-value">{value}%</div>
    </div>
  );
}
