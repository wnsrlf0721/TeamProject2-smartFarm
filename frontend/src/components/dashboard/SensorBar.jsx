// src/components/dashboard/SensorBar.jsx
import "./SensorBar.css";

const SENSOR_RANGES = {
  temperature: { min: -10, max: 50 },
  soil: { min: 0, max: 100 },
  light: { min: 0, max: 1000 },
  humidity: { min: 0, max: 100 },
  co2: { min: 0, max: 1500 },
};

function getStatus(value, min, max) {
  if (value < min) return "Low";
  if (value > max) return "High";
  return "Normal";
}

export default function SensorBar({ sensor, preset_step }) {
  if (!sensor || !preset_step) return null;

  const items = [
    {
      type: "temperature",
      label: "Temperature",
      value: sensor.temperature,
      presetMin: preset_step.temp.min,
      presetMax: preset_step.temp.max,
      unit: "℃",
    },
    {
      type: "soil",
      label: "Soil Moisture",
      value: sensor.soil_moisture,
      presetMin: preset_step.soil?.min,
      presetMax: preset_step.soil?.max,
      unit: "%",
    },
    {
      type: "light",
      label: "Light",
      value: sensor.lightPower,
      presetMin: preset_step.light?.min,
      presetMax: preset_step.light?.max,
      unit: "lx",
    },
    {
      type: "humidity",
      label: "Humidity",
      value: sensor.humidity,
      presetMin: preset_step.humidity?.min,
      presetMax: preset_step.humidity?.max,
      unit: "%",
    },
    {
      type: "co2",
      label: "CO₂",
      value: sensor.co2,
      presetMin: preset_step.co2?.min,
      presetMax: preset_step.co2?.max,
      unit: "ppm",
    },
  ];

  return (
    <div className="sensor-box sensor-scale">
      <div className="sensor-box">
        <div className="sensor-box-header">
          <span>Environmental Sensors</span>
          <div className="sensor-box-btns">
            <button className="icon-btn">
              <span>⟳</span>
            </button>
            <button className="icon-btn">
              <span>⋯</span>
            </button>
          </div>
        </div>
      </div>

      {items.map((item) => (
        <SensorRow key={item.type} {...item} />
      ))}
    </div>
  );
}

function SensorRow({ type, label, value, presetMin, presetMax, unit }) {
  const fullMin = SENSOR_RANGES[type].min;
  const fullMax = SENSOR_RANGES[type].max;

  const percent = ((value - fullMin) / (fullMax - fullMin)) * 100;
  const presetMinPercent = ((presetMin - fullMin) / (fullMax - fullMin)) * 100;
  const presetMaxPercent = ((presetMax - fullMin) / (fullMax - fullMin)) * 100;

  const status = getStatus(value, presetMin, presetMax);
  const statusKey = status.toLowerCase();

  const statusIcon = status === "Normal" ? "✓" : status === "High" ? "↑" : "↓";

  return (
    <div className={`sensor-row sensor-${statusKey}`}>
      <div className="sensor-title-row">
        <span className="sensor-title">{label}</span>

        <div className="title-divider"></div>

        <span className={`status-pill status-${statusKey}`}>
          <span className="status-icon">{statusIcon}</span>
          {status}
        </span>
      </div>

      <div className="bar-group">
        {/* 메인 바 */}
        <div className={`bar-bg bar-${status.toLowerCase()}`}>
          <div
            className={`bar-fill bar-fill-${status.toLowerCase()}`}
            style={{ width: `${percent}%` }}
          />

          {/* 말풍선 현재값 */}
          <div className="value-bubble" style={{ left: `${percent}%` }}>
            {value}
            {unit}
          </div>

          {/* preset Min | 인디케이터 */}
          <div className="preset-line" style={{ left: `${presetMinPercent}%` }} />

          {/* preset Max | 인디케이터 */}
          <div className="preset-line" style={{ left: `${presetMaxPercent}%` }} />
        </div>

        {/* 눈금 */}
        <div className="tick-bar">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="tick" />
          ))}
        </div>
      </div>
    </div>
  );
}
