import backendServer from "../backendServer";
import requests from "../request";

/* =========================
   관리자 상품 API
   ========================= */

/** 상품 등록 */
export const createAdminProduct = (data) => {
  return backendServer.post(
    requests.adminProductList,
    data
  );
};

/** 상품 전체 조회 */
export const fetchAdminProducts = () => {
  return backendServer.get(
    requests.adminProductList
  );
};

/** 상품 단건 조회 */
export const fetchAdminProductById = (
  productId
) => {
  return backendServer.get(
    requests.adminProductDetail(productId)
  );
};

/** 상품 수정 */
export const updateAdminProduct = (
  productId,
  data
) => {
  return backendServer.put(
    requests.adminProductDetail(productId),
    data
  );
};

/** 상품 삭제 */
export const deleteAdminProduct = (productId) => {
  return backendServer.delete(
    requests.adminProductDetail(productId)
  );
};
