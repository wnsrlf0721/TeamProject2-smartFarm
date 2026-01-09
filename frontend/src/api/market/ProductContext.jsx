import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchProducts,
  fetchProductDetail,
} from "../product/productApi";

const ProductContext = createContext();

/**
 * 서버 기반 Product Provider
 */
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     상품 목록 조회
     ========================= */
  const loadProducts = async ({
    category,
    keyword,
    page = 0,
    size = 20,
  } = {}) => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        category,
        keyword,
        page,
        size,
      });

      // ⚠️ 서버가 Page 응답이면 content
      setProducts(res.data.content ?? res.data);
    } catch (e) {
      console.error("상품 목록 조회 실패", e);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     상품 단건 조회
     ========================= */
  const getProductById = async (productId) => {
    const res = await fetchProductDetail(
      productId
    );
    return res.data;
  };

  useEffect(() => {
    loadProducts(); // 최초 전체 조회
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        loadProducts,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error(
      "useProducts must be used within ProductProvider"
    );
  }
  return ctx;
}
