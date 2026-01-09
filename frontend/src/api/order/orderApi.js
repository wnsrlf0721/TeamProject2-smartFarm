import backendServer from "../backendServer";
import requests from "../request";

/* ===== ORDER API ===== */

// 주문 생성
export const createOrder = (orderRequest) => {
  return backendServer
    .post(requests.orderCreate, orderRequest)
    .then((res) => res.data);
};

// 주문목록을 아이디별로 조회
export const getOrders = async () => {
  try {
    const response = await backendServer.get(
      requests.orderList
    );
    return response.data;
  } catch (error) {
    console.error("주문 목록 조회 실패:", error);
    throw error;
  }
};

// 주문 상세 조회 (결제용)
export const getOrderDetail = (orderUid) => {
  return backendServer
    .get(requests.orderDetail(orderUid))
    .then((res) => res.data);
};

// 주문 확정
export const confirmOrder = (orderUid) => {
  return backendServer.post(
    requests.orderConfirm(orderUid)
  );
};

// 주문 취소
export const cancelOrder = (orderUid) => {
  return backendServer.post(
    requests.orderCancel(orderUid)
  );
};


