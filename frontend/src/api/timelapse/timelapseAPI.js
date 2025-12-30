import backendServer from "../backendServer";
import requests from "../request";

export const timelapseCreate = async (timelapseRequestDTOList) => {
  try {
    const response = await backendServer.post(requests.timelapseCreate, timelapseRequestDTOList);
    return response;
  } catch (error) {
    console.log("에러 발생: ", error);
    throw error;
  }
};

export const timelapseView = async (farmId) => {
  try {
    const config = {
      params: {
        farmId: farmId,
      },
    };
    const response = await backendServer.get(requests.timelapseView, config);
    return response.data;
  } catch (error) {
    console.log("에러 발생: ", error);
  }
};

export const getTimelapseVideo = async (settingId) => {
  try {
    const config = {
      params: {
        settingId: settingId,
      },
      responseType: "blob", // 바이너리 데이터로 응답 받기
    };
    const response = await backendServer.get(requests.timelapseVideo, config);
    return response.data;
  } catch (error) {
    console.log("에러 발생: ", error);
    throw error;
  }
};
