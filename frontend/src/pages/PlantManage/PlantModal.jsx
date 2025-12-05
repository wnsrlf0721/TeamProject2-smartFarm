import "./PlantModal.css";
import SensorLineChart from "./SensorLineChart";

function PlantModal({ data, onClose }) {
  if (!data) return null;

  const { farm, preset, preset_step, current_sensor, sensor_history, alarms } = data;

  // D-day 계산
  const dday = (() => {
    const today = new Date();
    const harvest = new Date(farm.expected_harvest_at);
    const diff = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  })();

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal smart-modal" onClick={(e) => e.stopPropagation()}>
        {/* X 버튼 */}
        <button className="close-x" onClick={onClose}>
          ✕
        </button>

        {/* HEADER */}
        <div className="modal-header">
          <h2>
            팜 #{farm.farm_id} - {farm.plant_name}
          </h2>

          <span className="dday-badge">D-{dday}</span>
          <span className="status-badge">{farm.status}</span>

          <span className="update-time">업데이트: {current_sensor.logged_at}</span>
        </div>

        {/* ========== 상단 layout 전체 ========== */}
        <div className="modal-body">
          {/* LEFT : PLANT IMAGE */}
          <div className="left-column">
            <img src="/basil.png" alt={farm.plant_name} className="plant-img" />
          </div>

          {/* RIGHT : 프리셋, 성장단계, 날짜 */}
          <div className="right-column">
            {/* 프리셋/성장단계 칩 라인 */}
            <div className="preset-chip-row">
              <div className="preset-chip">
                <div className="chip-icon">🌿</div>
                <div className="chip-text">
                  <span className="chip-label">프리셋</span>
                  <span className="chip-value">{preset.preset_name}</span>
                </div>
              </div>

              <div className="preset-chip">
                <div className="chip-icon">🌱</div>
                <div className="chip-text">
                  <span className="chip-label">성장 단계</span>
                  <span className="chip-value">{preset_step.growth_step_name}</span>
                </div>
              </div>
            </div>

            {/* 날짜 2개 */}
            <div className="date-card-row">
              <div className="date-card">
                <div className="date-icon">📅</div>
                <div className="date-text">
                  <span className="date-label">재배 시작</span>
                  <span className="date-value">{farm.started_at}</span>
                </div>
              </div>

              <div className="date-card">
                <div className="date-icon">🌾</div>
                <div className="date-text">
                  <span className="date-label">예상 수확일</span>
                  <span className="date-value">{farm.expected_harvest_at}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========== 센서 위젯 4개 (막대바) ========== */}
        <div className="sensor-widget-grid">
          {/* 온도 */}
          <div className="sensor-widget advanced">
            <div className="sensor-top">
              <div className="sensor-icon">🌡️</div>
              <div className="sensor-title">온도</div>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${
                    ((current_sensor.temperature - preset_step.temp.min) /
                      (preset_step.temp.max - preset_step.temp.min)) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="sensor-bottom">
              <span className="sensor-value">{current_sensor.temperature}℃</span>
              <span className="sensor-range">
                {preset_step.temp.min}~{preset_step.temp.max}℃
              </span>
            </div>
          </div>

          {/* 습도 */}
          <div className="sensor-widget advanced">
            <div className="sensor-top">
              <div className="sensor-icon">💧</div>
              <div className="sensor-title">습도</div>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${
                    ((current_sensor.humidity - preset_step.humidity.min) /
                      (preset_step.humidity.max - preset_step.humidity.min)) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="sensor-bottom">
              <span className="sensor-value">{current_sensor.humidity}%</span>
              <span className="sensor-range">
                {preset_step.humidity.min}~{preset_step.humidity.max}%
              </span>
            </div>
          </div>

          {/* 조도 */}
          <div className="sensor-widget advanced">
            <div className="sensor-top">
              <div className="sensor-icon">💡</div>
              <div className="sensor-title">조도</div>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${
                    ((current_sensor.lightPower - preset_step.lightPower.min) /
                      (preset_step.lightPower.max - preset_step.lightPower.min)) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="sensor-bottom">
              <span className="sensor-value">{current_sensor.lightPower} lux</span>
              <span className="sensor-range">
                {preset_step.lightPower.min}~{preset_step.lightPower.max} lux
              </span>
            </div>
          </div>

          {/* 토양 수분 */}
          <div className="sensor-widget advanced">
            <div className="sensor-top">
              <div className="sensor-icon">🪴</div>
              <div className="sensor-title">토양 수분</div>
            </div>

            <div className="sensor-bar">
              <div
                className="sensor-bar-fill"
                style={{
                  width: `${
                    ((current_sensor.soil_moisture - preset_step.soil_moisture.min) /
                      (preset_step.soil_moisture.max - preset_step.soil_moisture.min)) *
                    100
                  }%`,
                }}
              ></div>
            </div>

            <div className="sensor-bottom">
              <span className="sensor-value">{current_sensor.soil_moisture}%</span>
              <span className="sensor-range">
                {preset_step.soil_moisture.min}~{preset_step.soil_moisture.max}%
              </span>
            </div>
          </div>
        </div>

        {/* ========== 차트 ========== */}
        <div className="chart-box">
          <SensorLineChart title="온도 변화 그래프" data={sensor_history.temperature} />
        </div>

        {/* ========== 알람 ========== */}
        <h3 className="section-title">최근 알람</h3>

        <div className="alarm-list">
          {alarms.map((a, i) => (
            <div key={i} className="alarm-item">
              <strong>{a.title}</strong>
              <p>{a.message}</p>
            </div>
          ))}
        </div>

        {/* ========== 하단 버튼 ========== */}
        <div className="bottom-actions">
          <button className="action-btn action-edit">편집</button>
          <button className="action-btn action-water">물 주기</button>
          <button className="action-btn action-delete">삭제</button>
        </div>
      </div>
    </div>
  );
}

export default PlantModal;
