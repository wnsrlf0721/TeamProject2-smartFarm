import "./AlarmPage.css";
import { useEffect, useState } from "react";
import axios from "axios";

function AlarmPage({ farmId }) {
  /** ======================
   * 상태 정의
   * ====================== */
  // 1차 탭: 전체 / 센서 / 이벤트
  const [selectedType, setSelectedType] = useState("ALL"); // ALL | SENSOR | EVENT

  // 2차 필터: 읽음 / 안읽음
  const [isRead, setIsRead] = useState(false); // false = 안 읽은 알림

  // 알람 리스트
  const [alarms, setAlarms] = useState([]);

  // 로딩 상태 (선택)
  const [loading, setLoading] = useState(false);

  const getIsReadParam = () => {
    if (isRead === "all") return null;
    return isRead === "read";
  };

  /** ======================
   * 알람 조회
   * ====================== */
  const fetchAlarms = async () => {
    if (!farmId) return;

    setLoading(true);

    try {
      const isRead = getIsReadParam();
      let response;

      // 전체 + 읽음/안읽음
      if (selectedType === "ALL") {
        response = await axios.get("/alarm/page/read-status", {
          params: { farmId, isRead },
        });
      }
      // 타입 + 읽음/안읽음
      else {
        response = await axios.get("/alarm/page/type-read", {
          params: {
            farmId,
            alarmType: selectedType,
            isRead,
          },
        });
      }

      setAlarms(response.data);
    } catch (error) {
      console.error("알람 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  /** ======================
   * 전체 읽음 처리
   * ====================== */
  const handleReadAll = async () => {
    try {
      await axios.patch("/alarm/read-all", { params: { farmId } });
      // 다시 조회
      fetchAlarms();
    } catch (error) {
      console.error("전체 읽음 처리 실패", error);
    }
  };

  /** ======================
   * 상태 변경 시 재조회
   * ====================== */
  useEffect(() => {
    fetchAlarms();
  }, [selectedType, isRead, farmId]);

  /** ======================
   * 렌더링
   * ====================== */
  return (
    <div className="alarm-page">
      {/* ===== 헤더 ===== */}
      <div className="alarm-header">
        <h1>알림</h1>
        <button className="read-all-btn" onClick={handleReadAll}>
          전체 읽음
        </button>
      </div>

      {/* ===== 1차 탭 (타입) ===== */}
      <div className="alarm-type-tabs">
        {["ALL", "SENSOR", "EVENT"].map((type) => (
          <button
            key={type}
            className={`type-tab ${selectedType === type ? "active" : ""}`}
            onClick={() => setSelectedType(type)}
          >
            {type === "ALL" ? "전체" : type === "SENSOR" ? "센서" : "이벤트"}
          </button>
        ))}
      </div>

      {/* ===== 2차 필터 (읽음 상태) ===== */}
      <div className="alarm-read-filter">
        <button className={!isRead ? "active" : ""} onClick={() => setIsRead(false)}>
          안 읽은 알림
        </button>
        <button className={isRead ? "active" : ""} onClick={() => setIsRead(true)}>
          읽은 알림
        </button>
      </div>

      {/* ===== 리스트 ===== */}
      <div className="alarm-list">
        {loading ? (
          <div className="alarm-loading">로딩 중...</div>
        ) : alarms.length === 0 ? (
          <div className="alarm-empty">알림이 없습니다.</div>
        ) : (
          alarms.map((alarm) => (
            <div key={alarm.pAlarmId} className={`alarm-item ${alarm.isRead ? "read" : "unread"}`}>
              <div className="alarm-left">{!alarm.isRead && <span className="unread-dot" />}</div>

              <div className="alarm-content">
                <h3 className="alarm-title">{alarm.title}</h3>
                <p className="alarm-message">{alarm.message}</p>
              </div>

              <div className="alarm-right">
                <span className="alarm-time">{alarm.createdAt.replace("T", " ")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlarmPage;
