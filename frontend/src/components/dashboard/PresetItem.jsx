// src/components/dashboard/PresetItem.jsx
import "./PresetItem.css";

export default function PresetItem({ icon, label, value }) {
  return (
    <div className="preset-item">
      <div className="preset-item-main">
        <div className="preset-icon">{icon}</div>

        <div className="preset-texts">
          <span className="preset-label">{label}</span>
          <span className="preset-value">{value}</span>
        </div>
      </div>
    </div>
  );
}
