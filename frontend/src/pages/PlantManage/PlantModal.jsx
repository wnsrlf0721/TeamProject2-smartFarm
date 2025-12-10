// src/pages/PlantModal/PlantModal.jsx
import { useState, useEffect } from "react";
import { transformSensorLog } from "../../api/utils/sensorTransform";
import "./PlantModal.css";

import SensorBar from "../../components/dashboard/SensorBar";
import WaterLevelCard from "../../components/dashboard/WaterLevelCard";
import SensorTrendSlider from "../../components/dashboard/SensorTrendSlider";
import ToastAlert from "../../components/dashboard/ToastAlert";
import ActuStatus from "../../components/dashboard/ActuStatus";
import PresetInfo from "../../components/dashboard/PresetInfo";
import PlantHistoryCard from "../../components/dashboard/PlantHistoryCard";

function PlantModal({ data, onClose }) {
  /* ------------------- 팝업 알림 ------------------- */
  const [alerts, setAlerts] = useState([]);

  function pushAlert(alert) {
    setAlerts((prev) => [...prev, { id: Date.now(), ...alert }]);
  }

  function removeAlert(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  const {
    farm = {},
    // preset = {},
    preset_step = {},
    plant_alarm = [],
    sensor_log = [],
    actuator_log = [],
  } = data ?? {};

  const { current_sensor, sensor_history } = transformSensorLog(sensor_log);

  useEffect(() => {
    if (!plant_alarm?.length) return;

    const latest = data.plant_alarm[0];

    const t = setTimeout(() => {
      pushAlert({
        type: "sensor",
        title: latest.title,
        message: latest.message,
      });
    }, 0);
    // cleanup
    return () => clearTimeout(t);
  }, [plant_alarm]);

  /* ------------------- D-DAY 계산 ------------------- */
  const dday = (() => {
    const today = new Date();
    const harvest = new Date(farm.expected_harvest_at);
    const diff = Math.ceil((harvest - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  })();

  /* ------------------- UI ------------------- */

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* 스크롤 가능한 전체 콘텐츠 래퍼 */}
        <div className="modal-content">
          {/* 🔶 HEADER */}
          <div className="modal-header">
            <div className="header-left">
              <h2>
                팜 #{farm.farm_id} — {farm.plant_nickname} ({farm.plant_type})
              </h2>
              <p className="updated">업데이트: {current_sensor.logged_at}</p>
            </div>

            <div className="header-right">
              <span className="dday-tag">D-{dday}</span>
              <span className="status-tag">{farm.status}</span>
            </div>
          </div>

          {/* 🟩 토스트는 모달 내부에 둠 */}
          <div className="toast-container">
            {alerts.map((a) => (
              <ToastAlert key={a.id} {...a} onClose={removeAlert} />
            ))}
          </div>

          {/* 🔷 메인 3열 레이아웃 */}
          <div className="modal-grid">
            {/* ========== LEFT COLUMN ========== */}
            <div className="grid-left">
              {/* 1) 식물 사진 */}
              <div className="card plant-photo-card">
                <img src="/basil.png" alt="plant" className="plant-photo" />
              </div>

              {/* 2) 로그 변화 그래프 */}
              <div className="card log-chart-card">
                <SensorTrendSlider
                  charts={[
                    { title: "온도 변화", unit: "℃", data: sensor_history.temperature || [] },
                    { title: "습도 변화", unit: "%", data: sensor_history.humidity || [] },
                    { title: "토양 수분 변화", unit: "%", data: sensor_history.soil || [] },
                    { title: "광량 변화", unit: "lx", data: sensor_history.light || [] },
                    { title: "CO₂ 변화", unit: "ppm", data: sensor_history.co2 || [] },
                  ]}
                />
              </div>
            </div>

            {/* ========== MIDDLE COLUMN ========== */}
            <div className="grid-middle">
              {/* 1) 재배 시작 / 예상 수확 */}
              <div className="card date-card-wrap">
                <div className="date-item">
                  <label>재배 시작</label>
                  <span>{farm.started_at}</span>
                </div>
                <div className="date-item">
                  <label>예상 수확일</label>
                  <span>{farm.expected_harvest_at}</span>
                </div>
              </div>

              {/* 2) 프리셋 */}
              <div className="card preset-card">
                <PresetInfo preset_step={preset_step} />
              </div>

              {/* 3) 최근 활동 */}
              <div className="card history-card">
                <PlantHistoryCard
                  history={[
                    { type: "water", title: "물주기", date: "2024-12-08 15:30" },
                    { type: "repot", title: "분갈이", date: "2024-12-05 12:10" },
                    { type: "trim", title: "가지치기", date: "2024-12-03 09:50" },
                    { type: "light", title: "LED 조정", date: "2024-12-02 18:44" },
                  ]}
                />
              </div>

              {/* 4) 장치 작동 상태 */}
              <div className="card actu-card">
                <ActuStatus
                  logs={actuator_log}
                  current_sensor={{ ...current_sensor, preset_step }}
                />
              </div>
            </div>

            {/* ========== RIGHT COLUMN ========== */}
            <div className="grid-right">
              {/* 1) 센서 상태 요약 */}
              <div className="card sensor-status-card">
                <div className="sensor-status-top">
                  <WaterLevelCard value={current_sensor.water_level} />
                </div>

                <div className="sensor-status-main">
                  <SensorBar sensor={current_sensor} preset_step={preset_step} />
                </div>
              </div>
            </div>
          </div>

          {/* 🔶 하단 — 최근 알람 */}
          <div className="card alarm-section-wide">
            <h3 className="section-title">최근 알람</h3>

            <div className="alarm-list">
              {plant_alarm.slice(0, 5).map((a) => (
                <div key={a.p_alarm_id} className="alarm-item">
                  <strong>{a.title}</strong>
                  <p>{a.message}</p>
                  <span className="alarm-time">{a.created_at}</span>
                </div>
              ))}
            </div>

            <button className="more-btn">더보기</button>
          </div>

          {/* 🔶 FOOTER 버튼 */}
          <div className="modal-actions">
            <button className="action-btn green">편집</button>
            <button
              className="action-btn blue"
              onClick={() =>
                pushAlert({
                  type: "water",
                  title: "물 주기 실행",
                  message: "자동 물 공급 동작이 실행되었습니다.",
                })
              }
            >
              물 주기
            </button>
            <button className="action-btn red">삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PlantModal;
