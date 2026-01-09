import backendServer from "../backendServer";
import requests from "../request";


/* ===== PAYMENT API ===== */

/**
 * 결제 승인 요청
 * @param {Object} data
 * @param {string} data.payment_uid - iamport imp_uid
 * @param {string} data.order_uid - 주문 UID
 */
export const confirmPayment = (data) => {
  return backendServer.post(requests.paymentConfirm, data);
};






