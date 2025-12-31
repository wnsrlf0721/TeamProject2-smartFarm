import backendServer from "../backendServer";
import requests from "../request";

export const waterPlant = async (farmId) => {
  const res = await backendServer.post(requests.waterPlantManual, null, { params: { farmId } });
  return res.data;
};
