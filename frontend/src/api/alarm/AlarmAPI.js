import backendServer from "../backendServer";
import requests from "../request";

export const waterPlant = async (farmId) => {
  const res = await backendServer.get(requests.waterPlantManual, { params: { farmId } });
  return res.data;
};

// 전체 알람
export const getAllAlarms = async (farmId) => {
  const res = await backendServer.get(requests.getAllAlarms, { params: { farmId } });
  return res.data;
};

// 안 읽은 알람
export const getUnreadAlarms = async (farmId) => {
  const res = await backendServer.get(requests.getUnreadAlarms, { params: { farmId } });
  return res.data;
};

// 전체 읽음 처리
export const readAllAlarms = async (farmId) => {
  const res = await backendServer.get(requests.readAllAlarms, { params: { farmId } });
  return res.data;
};
