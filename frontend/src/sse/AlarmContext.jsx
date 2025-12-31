// 앱 전역에서 알림 저장할 공간

import { createContext, useContext, useEffect, useState } from "react";
import { connectAlarmSse, disconnectAlarmSse } from "./alarmSse";
import { useAuth } from "../api/auth/AuthContext";

// 1. Context 생성
const AlarmContext = createContext(null);

// 2. Provider
export function AlarmProvider({ children }) {
  const { user } = useAuth();
  // 실시간으로 들어오는 알림들 (alarms - 실시간 알림 배열)
  const [alarms, setAlarms] = useState([]);

  // 새 알림 추가 (SSE가 여기로 밀어 넣을 예정) (addAlarm() - 알림 1개 추가)
  const addAlarm = (alarm) => {
    setAlarms((prev) => [alarm, ...prev]);
  };

  useEffect(() => {
    if (!user?.accessToken) {
      console.log("❌ Alarm SSE not connected (no token)");
      return;
    }

    // SSE 연결
    console.log("🟢 Alarm SSE connect");
    connectAlarmSse(user.accessToken, addAlarm);

    // 정리 (로그아웃 / 새로고침)
    return () => {
      console.log("🔴 Alarm SSE disconnect");
      disconnectAlarmSse();
    };
  }, [user?.accessToken]);

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        setAlarms,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
}

// 3. 사용 편의용 훅
export function useAlarm() {
  const ctx = useContext(AlarmContext);
  if (!ctx) {
    throw new Error("useAlarm must be used within AlarmProvider");
  }
  return ctx;
}
