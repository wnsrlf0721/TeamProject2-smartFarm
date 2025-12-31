// src/pages/PlantModal/PlantModal.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../../api/dashboard/dashboardAPI";
import { waterPlant } from "../../api/dashboard/actuatorAPI";
import {
  getDashboardAlarms,
  readDashboardTodayAll,
  readDashboardPreviousAll,
} from "../../api/alarm/DashboardAlarmAPI";
import { useAlarm } from "../../sse/AlarmContext";
import { hasSeenPopupAlarm, markPopupAlarmSeen } from "../../api/utils/popupAlarmStorage";
// import { transformSensorLog } from "../../api/utils/sensorTransform";
import "./PlantModal.css";

import SensorBar from "../../components/dashboard/SensorBar";
import WaterLevelCard from "../../components/dashboard/WaterLevelCard";
import SensorTrendSlider from "../../components/dashboard/SensorTrendSlider";
import ToastAlert from "../../components/dashboard/ToastAlert";
import ActuStatus from "../../components/dashboard/ActuStatus";
import PresetInfo from "../../components/dashboard/PresetInfo";
import PlantHistoryCard from "../../components/dashboard/PlantHistoryCard";
import AlertSection from "../../components/dashboard/alerts/AlertSection";

function PlantModal({ farmId, onClose }) {
  const [dashboard, setDashboard] = useState(null);
  const [todayAlarms, setTodayAlarms] = useState([]);
  const [previousAlarms, setPreviousAlarms] = useState([]);
  const [readingAllToday, setReadingAllToday] = useState(false);
  const [readingAllPrevious, setReadingAllPrevious] = useState(false);

  /* ------------------- 팝업 알림 ------------------- */
  const [alerts, setAlerts] = useState([]);

  const { alarms: realtimeAlarms } = useAlarm();

  const navigate = useNavigate();

  function pushAlert(alert) {
    setAlerts((prev) => [...prev, alert]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 10000);
  }
  function removeAlert(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  // 모달 열릴 때 대시보드 API 호출
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!farmId) {
        console.log("farmId 없음, 대시보드 호출 안 함");
        return;
      }

      try {
        console.log("대시보드 요청 farmId:", farmId);
        const dashboardData = await getDashboard(farmId);
        console.log("🔥 dashboard 전체 응답", dashboardData);
        console.log("🔥 farm", dashboardData.farm);
        console.log("🔥 current", dashboardData.current);
        console.log("🔥 history", dashboardData.history);
        console.log("🔥 preset", dashboardData.preset);
        console.log("🔥 actuators", dashboardData.actuators);
        setDashboard(dashboardData);
      } catch (e) {
        console.error("dashboard api error", e);
      }
    };

    fetchDashboard();
  }, [farmId]);

  useEffect(() => {
    if (!farmId) return;

    const fetchAlarms = async () => {
      try {
        const data = await getDashboardAlarms(farmId);
        setTodayAlarms(data.todayAlarms ?? []);
        setPreviousAlarms(data.previousAlarms ?? []);
      } catch (e) {
        console.error("dashboard alarm error", e);
      }
    };

    fetchAlarms();
  }, [farmId]);

  // 실시간 알림 반영 useEffect
  useEffect(() => {
    if (realtimeAlarms.length === 0) return;

    const latest = realtimeAlarms[0]; // sse는 한 번에 하나(특성)
    console.log("🧪 latest from SSE:", latest);
    console.log("🧪 latest keys:", Object.keys(latest));
    console.log("🧪 current farmId:", farmId);
    // farmId 다른 알림은 무시
    if (latest.farmId !== farmId) return;
    // 이미 팝업으로 보여준 알람이면 무시
    if (hasSeenPopupAlarm(latest.alarmId)) return;

    // 오늘, 이전 분리하기
    const created = new Date(latest.createdAt);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (created >= todayStart) {
      setTodayAlarms((prev) => {
        // 중복 방지 (최신 state 기준)
        if (prev.some((a) => a.alarmId === latest.alarmId)) return prev;
        return [latest, ...prev].slice(0, 10);
      });
    } else {
      setPreviousAlarms((prev) => {
        if (prev.some((a) => a.alarmId === latest.alarmId)) return prev;
        return [latest, ...prev].slice(0, 10);
      });
    }
    pushAlert({
      id: `${latest.alarmId}-${latest.createdAt}`,
      type: latest.alarmType.toLowerCase(),
      title: latest.title,
      message: latest.message,
    });
    // 다시 안 뜨도록 기록
    markPopupAlarmSeen(latest.alarmId);

    getDashboard(farmId).then(setDashboard);
  }, [realtimeAlarms, farmId]);

  // 센서바, 엑추상태 적용할 polling useEffect
  // sse대신에 지정 시간(약 30~60초) 간격으로 풀링해서 대시보드에 보여주기 - 시연해야됨
  // 시연용으로는 30초면 실제로는 1시간으로 변경하면 됨 ~!
  useEffect(() => {
    if (!farmId) return;

    const interval = setInterval(async () => {
      try {
        const data = await getDashboard(farmId);
        setDashboard(data); // current_sensor 갱신
      } catch (e) {
        console.error("sensor refresh error", e);
      }
    }, 5000); // 5초

    return () => clearInterval(interval);
  }, [farmId]);

  // 단건 읽은 알람 제거 (오늘 / 이전 공통)
  const handleDashboardAlarmRead = (alarmId) => {
    setTodayAlarms((prev) => prev.filter((a) => a.alarmId !== alarmId));
    setPreviousAlarms((prev) => prev.filter((a) => a.alarmId !== alarmId));
  };

  // 오늘 알람 전체 읽음
  const handleReadTodayAll = async () => {
    try {
      setReadingAllToday(true);
      setTodayAlarms((prev) => prev.map((a) => ({ ...a, isRead: true })));
      await readDashboardTodayAll(farmId);
      setTimeout(async () => {
        const data = await getDashboardAlarms(farmId);
        setTodayAlarms(data.todayAlarms);
        setPreviousAlarms(data.previousAlarms);
        setReadingAllToday(false);
      }, 350);
    } catch (e) {
      console.error("오늘 알림 전체 읽음 실패", e);
      setReadingAllToday(false);
    }
  };

  const handleReadPreviousAll = async () => {
    try {
      setPreviousAlarms((prev) => prev.map((a) => ({ ...a, isRead: true })));

      setTimeout(() => {
        setPreviousAlarms([]);
        setReadingAllPrevious(false);
      }, 2000);
      await readDashboardPreviousAll(farmId);
      const data = await getDashboardAlarms(farmId);
      setTodayAlarms(data.todayAlarms);
      setPreviousAlarms(data.previousAlarms);
    } catch (e) {
      console.error("이전 알림 전체 읽음 실패", e);
    }
  };

  // 아직 데이터 없으면 로딩 처리
  if (!dashboard) {
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal-frame" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
          <div className="lodding">로딩중...</div>
        </div>
      </div>
    );
  }

  // 이제부턴 dashboard에서 꺼내 쓰면 됨
  const farm = dashboard.farm ?? {};
  const current_sensor = dashboard.current ?? {};
  const sensor_history = dashboard.history ?? {};
  // const preset_step = dashboard.preset ?? {}; // (PresetInfoDTO 구조에 맞춰서)
  const activeStep = dashboard.preset ?? {};
  // const plant_alarm = dashboard.alarms ?? [];
  const actuator_log = dashboard.actuators ?? [];

  const mappedSensor = {
    temperature: current_sensor.temp,
    humidity: current_sensor.humidity,
    soil: current_sensor.soilMoisture,
    light: current_sensor.lightPower,
    co2: current_sensor.co2,
  };

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
          {/* HEADER */}
          <div className="modal-header">
            <div className="header-left">
              <div className="title-row">
                <h2>
                  팜 #{farm.farmId} — {farm.farmName} ({farm.plantType})
                </h2>
                {/* 1) 재배 시작 / 예상 수확 */}
                <div className="card date-card-wrap">
                  <div className="date-item date-start">
                    <label>재배 시작</label>
                    <span>{farm.startDate}</span>
                  </div>
                  <div className="date-item date-end">
                    <label>예상 수확일</label>
                    <span>{farm.expectedHarvestDate}</span>
                  </div>
                </div>
              </div>
              <p className="updated">업데이트: {new Date(farm.updateTime).toLocaleString()}</p>
            </div>

            <div className="header-right">
              <span className="dday-tag">D-{farm.dday}</span>
              <span className="status-tag">{farm.status}</span>
            </div>
          </div>

          {/*  토스트는 모달 내부에 둠 */}
          <div className="toast-container">
            {alerts.map((a) => (
              <ToastAlert key={a.id} {...a} onClose={removeAlert} />
            ))}
          </div>

          {/*  메인 3열 레이아웃 */}
          <div className="modal-grid">
            {/* ========== LEFT COLUMN ========== */}
            <div className="grid-1">
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
                    { title: "토양 수분 변화", unit: "%", data: sensor_history.soilMoisture || [] },
                    { title: "광량 변화", unit: "lx", data: sensor_history.light || [] },
                    { title: "CO₂ 변화", unit: "ppm", data: sensor_history.co2 || [] },
                  ]}
                />
              </div>
            </div>

            {/* ========== MIDDLE COLUMN ========== */}
            <div className="grid-2">
              <div className="sensor-status-top">
                <WaterLevelCard value={current_sensor.waterLevel} />
              </div>
            </div>

            <div className="grid-3">
              <div className="grid-3-top">
                {/* 4) 장치 작동 상태 */}
                <div className="card actu-box">
                  <ActuStatus logs={actuator_log} current_sensor={mappedSensor} />
                </div>
              </div>
              {/* 2) 프리셋 */}
              <div className="card preset-card">
                <PresetInfo
                  presetSteps={dashboard.presetSteps}
                  activePresetStepId={dashboard.activePresetStepId}
                />
              </div>
            </div>

            {/* 3) 최근 활동 */}
            {/* <div className="card history-card">
                  <PlantHistoryCard
                    history={[
                      { type: "water", title: "물주기", date: "2024-12-08 15:30" },
                      { type: "repot", title: "분갈이", date: "2024-12-05 12:10" },
                      { type: "trim", title: "가지치기", date: "2024-12-03 09:50" },
                      { type: "light", title: "LED 조정", date: "2024-12-02 18:44" },
                    ]}
                  />
                </div> */}
            <div className="grid-4">
              {/* 1) 센서 상태 요약 */}
              <div className="sensor-status-main">
                <SensorBar sensor={mappedSensor} preset_step={activeStep} />
              </div>
            </div>
          </div>

          {/* 하단 — 최근 알람 */}
          <div className="card alarm-section-wide">
            <h3 className="section-title">최근 알람</h3>

            <div className="alarm-2grid">
              <AlertSection
                todayAlerts={todayAlarms}
                pastAlerts={previousAlarms}
                onReadAlarm={handleDashboardAlarmRead}
                onReadTodayAll={handleReadTodayAll}
                onReadPreviousAll={handleReadPreviousAll}
                readingAllToday={readingAllToday}
                readingAllPrevious={readingAllPrevious}
              />
              <button className="alarm-more-btn" onClick={() => navigate("/alarm")}>
                알림 더보기
              </button>
            </div>
          </div>

          {/* 🔶 FOOTER 버튼 */}
          <div className="modal-actions">
            <button
              className="action-btn blue"
              onClick={async () => {
                try {
                  await waterPlant(farm.farmId);
                } catch (e) {
                  pushAlert({
                    type: "error",
                    title: "실패",
                    message: "물 주기 실행 실패",
                  });
                }
              }}
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
