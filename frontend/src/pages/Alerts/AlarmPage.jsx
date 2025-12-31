import "./AlarmPage.css";
import { useEffect, useState } from "react";
import { getAlarmPage } from "../../api/alarm/AlarmPageAPI";
import { readAllAlarms } from "../../api/alarm/AlarmPageAPI";
import { readAlarms } from "../../api/alarm/AlarmPageAPI";
import { formatDateTime } from "./dateFormat";
import { useAlarm } from "../../sse/AlarmContext";

function AlarmPage() {
  // 1차 탭: 전체 / 센서 / 이벤트
  const [selectedType, setSelectedType] = useState("ALL"); // ALL | SENSOR | EVENT

  // 2차 필터: 읽음 / 안읽음
  const [readFilter, setReadFilter] = useState("unread"); // false = 안 읽은 알림

  // 알람 리스트
  const [alarms, setAlarms] = useState([]);

  // 로딩 상태 (선택)
  const [loading, setLoading] = useState(false);

  // 단건 읽음 처리 시 css 잠시 보여주고 상태 이동 (읽은 알림으로)
  const [animatingId, setAnimatingId] = useState(null);

  // SSE로 “새로 들어온 알람들만” 쌓이는 배열
  const { alarms: realtimeAlarms } = useAlarm();

  const getIsReadParam = () => {
    if (readFilter === "all") return null;
    return readFilter === "read";
  };

  /** ======================
   * 알람 조회
   * ====================== */
  const fetchAlarms = async () => {
    setLoading(true);
    try {
      const params = {
        alarmType: selectedType === "ALL" ? null : selectedType,
        isRead: getIsReadParam(),
      };

      const data = await getAlarmPage(params);
      // 🔥 isRead 무조건 boolean으로 정규화
      const normalized = data.map((alarm) => ({
        ...alarm,
        isRead: alarm.isRead === true, // true만 true, 나머지는 false
      }));
      setAlarms(normalized);
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
      await readAllAlarms();
      // 다시 조회
      fetchAlarms();
    } catch (error) {
      console.error("전체 읽음 처리 실패", error);
    }
  };

  /** ======================
   * 단건 클릭 읽음 처리
   * ====================== */
  const handleAlarmClick = async (alarmId) => {
    try {
      await readAlarms(alarmId);

      // 클릭한 알림을 읽음 상태로 표시
      setAnimatingId(alarmId);

      // 잠깐 읽음 css 보여주기
      setTimeout(() => {
        // 안 읽은 목록에서 제거
        setAlarms((prev) => prev.filter((alarm) => alarm.alarmId !== alarmId));

        // 읽은 알림 탭으로 이동
        setReadFilter("read");
        setAnimatingId(null);
      }, 350); // 300~500ms 가 ㄱㅊ은듯
    } catch (error) {
      console.error("단건 읽음 처리 실패", error);
    }
  };

  /** ======================
   * 상태 변경 시 재조회
   * ====================== */
  useEffect(() => {
    if (animatingId !== null) return;
    fetchAlarms();
  }, [selectedType, readFilter]);

  /** ======================
   * SSE 실시간 알림 반영
   * ====================== */
  useEffect(() => {
    if (!realtimeAlarms.length) return;

    const latest = realtimeAlarms[0];

    setAlarms((prev) => {
      // 중복 방지
      if (prev.some((a) => a.alarmId === latest.alarmId)) {
        return prev;
      }

      // 현재 탭 조건 검사
      const isUnreadTab = readFilter === "unread";
      const isReadTab = readFilter === "read";

      // 안읽은 탭인데 읽은 알림이면 무시
      if (isUnreadTab && latest.isRead === true) {
        return prev;
      }

      // 읽은 탭인데 안읽은 알림이면 무시
      if (isReadTab && latest.isRead === false) {
        return prev;
      }

      // 타입 필터 검사
      if (selectedType !== "ALL" && latest.alarmType !== selectedType) {
        return prev;
      }

      // 조건 통과 → 맨 위에 추가
      return [latest, ...prev];
    });
  }, [realtimeAlarms]);

  useEffect(() => {
    console.log(
      alarms.map((a) => ({
        id: a.alarmId,
        isRead: a.isRead,
        type: typeof a.isRead,
      }))
    );
  }, [alarms]);

  /** ======================
   * 렌더링
   * ====================== */

  console.log("selectedType:", selectedType);
  console.log("readFilter:", readFilter);
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
        <button
          className={readFilter === "unread" ? "active" : ""}
          onClick={() => setReadFilter("unread")}
        >
          안 읽은 알림
        </button>
        <button
          className={readFilter === "read" ? "active" : ""}
          onClick={() => setReadFilter("read")}
        >
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
            <div
              key={alarm.alarmId}
              className={`alarm-item ${
                readFilter === "read" || alarm.isRead || animatingId === alarm.alarmId
                  ? "read"
                  : "unread"
              }`}
              onClick={() => {
                if (readFilter !== "unread") return; // 탭 기준 차단
                if (alarm.isRead !== false) return; // 데이터 기준 차단
                handleAlarmClick(alarm.alarmId);
              }}
            >
              <div className="alarm-left">{!alarm.isRead && <span className="unread-dot" />}</div>

              <div className="alarm-content">
                <div className="alarm-farm">{alarm.farmName}</div>
                <h3 className="alarm-title">{alarm.title}</h3>
                <p className="alarm-message">{alarm.message}</p>
              </div>

              <div className="alarm-right">
                <span className="alarm-time">{formatDateTime(alarm.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AlarmPage;
