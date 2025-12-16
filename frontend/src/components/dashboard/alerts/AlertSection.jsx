// src/components/dashboard/alerts/AlertSection.jsx
import "./AlertSection.css";
import AlertCard from "./AlertCard";

export default function AlertSection({ plant_alarm = [] }) {
  if (!Array.isArray(plant_alarm)) return null;

  // 날짜 구분
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const todayAlerts = plant_alarm.filter(
    (a) => typeof a.createdAt === "string" && a.createdAt.startsWith(today)
  );

  const pastAlerts = plant_alarm.filter(
    (a) => typeof a.createdAt === "string" && !a.createdAt.startsWith(today)
  );

  return (
    <div className="alert-grid">
      {/* 오늘 알람 */}
      <div className="alert-column">
        <h3 className="alert-title">오늘 알람</h3>

        <div className="alert-list">
          {todayAlerts.length === 0 && <p className="alert-empty">오늘 발생한 알람이 없습니다.</p>}

          {todayAlerts.map((a, idx) => (
            <AlertCard key={idx} data={a} />
          ))}
        </div>

        <button className="more-pill">오늘 알람 더보기 &gt;</button>
      </div>

      {/* 이전 알람 */}
      <div className="alert-column">
        <h3 className="alert-title">이전 알람</h3>

        <div className="alert-list">
          {pastAlerts.length === 0 && <p className="alert-empty">이전 알람이 없습니다.</p>}

          {pastAlerts.map((a, idx) => (
            <AlertCard key={idx} data={a} />
          ))}
        </div>

        <button className="more-pill">이전 알람 더보기 &gt;</button>
      </div>
    </div>
  );
}
