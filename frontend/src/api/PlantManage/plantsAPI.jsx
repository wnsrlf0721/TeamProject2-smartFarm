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
