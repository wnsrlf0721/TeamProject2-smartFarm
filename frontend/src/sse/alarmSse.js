// src/sse/alarmSse.js

let eventSource = null;

/**
 * SSE 연결 시작
 * @param {string} token - JWT accessToken (Bearer 없이!)
 * @param {(alarm:any)=>void} onMessage - 알림 수신 콜백
 */
export function connectAlarmSse(token, onMessage) {
  if (eventSource) {
    console.warn("SSE already connected");
    return;
  }

  const url = `http://localhost:8080/alarm/subscribe?token=${token}`;

  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("✅ Alarm SSE connected");
  };

  eventSource.addEventListener("alarm", (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🔔 SSE alarm received:", data);
      onMessage(data);
    } catch (e) {
      console.error("SSE parse error", e);
    }
  });

  eventSource.onerror = (e) => {
    console.error("❌ SSE error", e);
    // disconnectAlarmSse();
  };
}

/**
 * SSE 연결 해제
 */
export function disconnectAlarmSse() {
  if (eventSource) {
    console.log("Alarm SSE disconnected");
    eventSource.close();
    eventSource = null;
  }
}
