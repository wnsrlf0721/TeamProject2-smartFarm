import backendServer from "../backendServer";
import requests from "../request";

export const getNovaList = async (id) => {
  const response = await backendServer.get(requests.novaList, {
    params: {
      userId: id,
    },
  });
  return response.data;
};

export const getFarmList = async (id) => {
  const response = await backendServer.get(requests.farmCardList, {
    params: {
      novaId: id,
    },
  });
  return response.data;
};
export const updateFarm = async (farmId, formData) => {
  const response = await backendServer.put(requests.farmUpdate + `/${farmId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteFarm = async (id) => {
  const response = await backendServer.delete(requests.farmDelete + `/${id}`);
  return response;
};

export const createFarm = async (formData) => {
  const request = await backendServer.post(requests.farmCreate, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.data;
};

export const getPresetList = async (id) => {
  const response = await backendServer.get(requests.presetList, {
    params: {
      userId: id,
    },
  });
  return response.data;
};
export const getPresetStepList = async (id) => {
  const response = await backendServer.get(requests.presetStep, {
    params: {
      presetId: id,
    },
  });
  return response.data;
};
