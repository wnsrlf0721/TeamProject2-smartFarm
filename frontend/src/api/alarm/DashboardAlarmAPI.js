import backendServer from "../backendServer";
import requests from "../request";

/**
 * 대시보드 알람 조회
 * - 오늘 알림 (unread, 최대 10)
 * - 이전 알림 (unread, 최대 10)
 */
export const getDashboardAlarms = async (farmId) => {
  const res = await backendServer.get(requests.dashboardAlarms, {
    params: { farmId },
  });
  return res.data;
};

export const readDashboardTodayAll = (farmId) =>
  backendServer.post(requests.readDashboardTodayAll, null, {
    params: { farmId },
  });

export const readDashboardPreviousAll = (farmId) =>
  backendServer.post(requests.readDashboardPreviousAll, null, {
    params: { farmId },
  });
