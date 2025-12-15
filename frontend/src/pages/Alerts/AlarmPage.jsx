import "./AlarmPage.css";
import { useState } from "react";

function AlarmPage() {
  // 임시 mock 데이터 (나중에 API로 교체)
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      type: "sensor",
      title: "온도 이상 감지",
      message: "현재 온도가 설정 범위를 벗어났습니다.",
      createdAt: "2025-01-15 14:32",
      isRead: false,
    },
    {
      id: 2,
      type: "system",
      title: "물 주기 완료",
      message: "자동 물 공급이 정상적으로 완료되었습니다.",
      createdAt: "2025-01-15 09:10",
      isRead: true,
    },
  ]);

  const handleRead = (id) => {
    setAlarms((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const handleDelete = (id) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="alarm-page">
      <h1 className="alarm-title">알림</h1>

      {alarms.length === 0 ? (
        <div className="alarm-empty">알림이 없습니다.</div>
      ) : (
        <ul className="alarm-list">
          {alarms.map((alarm) => (
            <li
              key={alarm.id}
              className={`alarm-item ${alarm.isRead ? "read" : "unread"}`}
              onClick={() => handleRead(alarm.id)}
            >
              <div className="alarm-main">
                <div className="alarm-text">
                  <h3 className="alarm-item-title">{alarm.title}</h3>
                  <p className="alarm-message">{alarm.message}</p>
                </div>

                <span className="alarm-time">{alarm.createdAt}</span>
              </div>

              <button
                className="alarm-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(alarm.id);
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlarmPage;
