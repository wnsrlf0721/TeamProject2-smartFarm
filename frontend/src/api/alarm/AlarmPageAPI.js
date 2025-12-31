import backendServer from "../backendServer";
import requests from "../request";

// 알람 페이지 전체 조회
export const getAlarmPage = async (params = {}) => {
  const res = await backendServer.get(requests.getAlarmPage, { params });
  return res.data;
};

export const readAllAlarms = async () => {
  const res = await backendServer.patch(requests.readAllAlarms);
  return res.data;
};

export const readAlarms = async (alarmId) => {
  const res = await backendServer.patch(requests.readAlarms, null, { params: { alarmId } });
  return res.data;
};
