// import jwtAxios from "./jwtUtil";
import backendServer from "../backendServer";
import requests from "../request";

export const getUserInfo = async (userId) => {
  try {
    const config = {
      params: {
        userId: userId,
      },
    };
    const response = await backendServer.get(requests.myPageView, config);
    return response.data;
  } catch (error) {
    console.log("에러 발생: ", error);
  }
};

export const updateUserInfo = async (editUserInfo) => {
  try {
    const response = await backendServer.post(requests.myPageEdit, editUserInfo);
    return response;
  } catch (error) {
    console.log("에러 발생: ", error);
    throw error;
  }
};

export const getTimeLapse = async (userId) => {
  try {
    const config = {
      params: {
        userId: userId,
      },
    };
    const response = await backendServer.get(requests.myPageTimelapse, config);
    return response.data;
  } catch (error) {
    console.log("에러 발생: ", error);
  }
};
