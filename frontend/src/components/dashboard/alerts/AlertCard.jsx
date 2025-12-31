// src/components/dashboard/alerts/AlertCard.jsx

import { readAlarms } from "../../../api/alarm/AlarmPageAPI";

export default function AlertCard({ data, onRead, forceRead = false }) {
  const { alarmId, title, message, createdAt, isRead } = data;
  const reading = forceRead || isRead;

  // 상대 시간 계산 (간단 버전)
  const timeAgo = getRelativeTime(createdAt);

  const handleClick = async () => {
    // 이미 읽은 알람이면 아무것도 안 함
    if (isRead) return;

    try {
      await readAlarms(alarmId); // DB 반영
      onRead?.(alarmId);
    } catch (e) {
      console.error("알람 읽음 실패", e);
    }
  };

  return (
    <div className={`alert-card ${reading ? "read" : "unread"}`} onClick={handleClick}>
      <div className="alert-card-top">
        <strong className="alert-title-text">{title}</strong>
        <span className="alert-time">{timeAgo}</span>
      </div>

      <p className="alert-message">{message}</p>
    </div>
  );
}

// 상대 시간 계산 함수
function getRelativeTime(ts) {
  const now = new Date();
  const past = new Date(ts);

  const diffMs = now - past;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return ts.slice(0, 10); // YYYY-MM-DD
}
