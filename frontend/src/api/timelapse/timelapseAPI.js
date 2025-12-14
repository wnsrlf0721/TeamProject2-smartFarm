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
