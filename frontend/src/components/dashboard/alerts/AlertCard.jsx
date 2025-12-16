// src/components/dashboard/alerts/AlertCard.jsx

export default function AlertCard({ data }) {
  const { title, message, createdAt } = data;

  // 상대 시간 계산 (간단 버전)
  const timeAgo = getRelativeTime(createdAt);

  return (
    <div className="alert-card">
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
