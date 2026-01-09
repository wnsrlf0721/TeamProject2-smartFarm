import backendServer from "../backendServer";
import requests from "../request";

/* =========================
   관리자 주문 API
   ========================= */

// 모든 주문 목록 조회
export const getAllOrdersAdmin = async () => {
  try {
    const response = await backendServer.get(
      requests.adminOrderList
    );
    return response.data;
  } catch (error) {
    console.error(
      "관리자 주문 목록 조회 실패:",
      error
    );
    throw error;
  }
};

// 주문 상태 변경
export const updateOrderStatusAdmin = (
  orderUid,
  status
) => {
  return backendServer.post(
    requests.adminOrderUpdateStatus(orderUid),
    { status } // ✅ JSON BODY
  );
};

// 환불 승인
export const approveRefundAdmin = (orderUid) => {
  return backendServer.post(
    requests.adminOrderApproveRefund(orderUid)
  );
};

// 운송장 번호 등록/수정
// 송장번호 등록
export const updateTrackingNumberAdmin = (
  orderUid,
  trackingNumber
) => {
  return backendServer.post(
    requests.adminOrderUpdateTracking(orderUid),
    { trackingNumber } // ✅ JSON BODY
  );
};
