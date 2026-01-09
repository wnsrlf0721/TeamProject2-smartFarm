import backendServer from "../backendServer";
import requests from "../request";
/* =========================
   사용자 상품 API
   ========================= */

/** 상품 목록 조회 */
export const fetchProducts = ({
  category,
  keyword,
  page,
  size,
}) => {
  return backendServer.get(requests.productList, {
    params: {
      category,
      keyword,
      page,
      size,
    },
  });
};

/** 상품 상세 조회 */
export const fetchProductDetail = (productId) => {
  return backendServer.get(
    requests.productDetail(productId)
  );
};
