import "./PresetInfo.css";

export default function PresetInfo({ preset = {}, preset_step = {} }) {
  if (!preset_step || Object.keys(preset_step).length === 0) {
    return <div className="preset-card empty">프리셋 정보를 불러오는 중...</div>;
  }

  const items = [
    {
      icon: "🌡️",
      label: "Temperature",
      min: preset_step.temp?.min,
      max: preset_step.temp?.max,
      unit: "℃",
    },
    {
      icon: "💧",
      label: "Humidity",
      min: preset_step.humidity?.min,
      max: preset_step.humidity?.max,
      unit: "%",
    },
    {
      icon: "☀️",
      label: "Light",
      min: preset_step.lightPower?.min,
      max: preset_step.lightPower?.max,
      unit: "lx",
    },
    {
      icon: "🪱",
      label: "Soil Moisture",
      min: preset_step.soil_moisture?.min,
      max: preset_step.soil_moisture?.max,
      unit: "%",
    },
  ].filter((i) => i.min != null && i.max != null);

  return (
    <div className="preset-card">
      {/* <h3 className="preset-title">Preset Range</h3> */}
      <div className="preset-name">{preset.preset_name || "이름 없는 프리셋"}</div>

      <div className="preset-list">
        {items.map((item) => (
          <div className="preset-item" key={item.label}>
            <div className="preset-left">
              <span className="preset-icon">{item.icon}</span>
              <span className="preset-label">{item.label}</span>
            </div>

            <span className="preset-range">
              {item.min}–{item.max}
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
