import backendServer from "../backendServer";
import requests from "../request";

export const getDashboard = async (farmId) => {
  const res = await backendServer.get(requests.farmDashboard, { params: { farmId } });
  return res.data;
};
