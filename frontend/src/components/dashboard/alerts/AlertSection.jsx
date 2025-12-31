// src/components/dashboard/alerts/AlertSection.jsx
import "./AlertSection.css";
import AlertCard from "./AlertCard";

export default function AlertSection({
  todayAlerts = [],
  pastAlerts = [],
  onReadAlarm,
  onReadTodayAll,
  onReadPreviousAll,
  readingAllToday = false,
  readingAllPrevious = false,
}) {
  return (
    <div className="alert-grid">
      {/* 오늘 알람 */}
      <div className="alert-column">
        <h3 className="alert-title">오늘 알람</h3>
        <button className="more-pill" onClick={onReadTodayAll}>
          오늘 알림 전체 읽음
        </button>

        <div className="alert-list">
          {todayAlerts.length === 0 && <p className="alert-empty">오늘 발생한 알람이 없습니다.</p>}

          {todayAlerts.map((a) => (
            <AlertCard
              key={a.alarmId ?? `${a.createdAt}-${a.title}`}
              data={a}
              onRead={onReadAlarm}
              forceRead={readingAllToday}
            />
          ))}
        </div>
      </div>

      {/* 이전 알람 */}
      <div className="alert-column">
        <h3 className="alert-title">이전 알람</h3>
        <button className="more-pill" onClick={onReadPreviousAll}>
          이전 알림 전체 읽음
        </button>

        <div className="alert-list">
          {pastAlerts.length === 0 && <p className="alert-empty">이전 알람이 없습니다.</p>}

          {pastAlerts.map((a) => (
            <AlertCard
              key={a.alarmId ?? `${a.createdAt}-${a.title}`}
              data={a}
              onRead={onReadAlarm}
              forceRead={readingAllPrevious}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
