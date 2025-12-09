import React, {
  createContext,
  useContext,
  useState,
} from "react";
import imgImageWithFallback from "../assets/297ce7b757354b7f938a0f42102fbc187f5e70c4.png";
import imgImageWithFallback1 from "../assets/acae3564874b0bb677a51d6c315fff91e84deb82.png";
import imgImageWithFallback2 from "../assets/12c77ac4fb85a8fbacaf8525036bc8b60e763a1c.png";

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {'crop' | 'device' | 'service'} category
 * @property {string} farmName
 * @property {string} systemType
 * @property {string=} plant
 * @property {string=} stage
 * @property {number=} days
 * @property {number} price
 * @property {string} unit
 * @property {string} image
 * @property {string[]=} specs
 * @property {number=} stock
 */

/** @type {Product[]} */
const initialProducts = [
  {
    id: "prod-1",
    category: "crop",
    name: "청상추",
    farmName: "상추 재배 A동",
    systemType: "수경재배 시스템",
    plant: "청상추",
    stage: "생장기",
    days: 24,
    price: 3500,
    unit: "100g",
    image: imgImageWithFallback,
    stock: 8,
  },
  {
    id: "prod-2",
    category: "crop",
    name: "방울토마토",
    farmName: "토마토 재배 B동",
    systemType: "수경재배 시스템",
    plant: "방울토마토",
    stage: "개화기",
    days: 45,
    price: 8500,
    unit: "500g",
    image: imgImageWithFallback1,
    stock: 3,
  },
  {
    id: "prod-3",
    category: "crop",
    name: "설향딸기",
    farmName: "딸기 재배 C동",
    systemType: "스마트 온실",
    plant: "설향딸기",
    stage: "결실기",
    days: 62,
    price: 12000,
    unit: "300g",
    image: imgImageWithFallback2,
    stock: 15,
  },
  {
    id: "device-nova-1",
    category: "device",
    name: "Nova 스마트 센서",
    farmName: "Nova Pro Series",
    systemType: "스마트팜 IoT 기기",
    price: 145000,
    unit: "1대",
    image:
      "https://images.unsplash.com/photo-1608661918456-203a20def9ff",
    description:
      "온도, 습도, pH, EC 실시간 모니터링",
    specs: [
      "온습도 센서",
      "pH/EC 측정",
      "WiFi 연결",
      "앱 연동",
    ],
    stock: 12,
  },
  {
    id: "device-nova-2",
    category: "device",
    name: "Nova 자동 관수 시스템",
    farmName: "Nova Hydro Series",
    systemType: "스마트팜 IoT 기기",
    price: 320000,
    unit: "1세트",
    image:
      "https://images.unsplash.com/photo-1611759386165-ed9beec7b14f",
    description: "AI 기반 자동 관수 제어 시스템",
    specs: [
      "AI 제어",
      "8채널 밸브",
      "스케줄 관리",
      "원격 제어",
    ],
    stock: 5,
  },
  {
    id: "device-nova-3",
    category: "device",
    name: "Nova LED 생장등",
    farmName: "Nova Light Series",
    systemType: "스마트팜 IoT 기기",
    price: 89000,
    unit: "1개",
    image:
      "https://images.unsplash.com/photo-1708794666324-85ad91989d20",
    description:
      "작물 생장 최적화 풀 스펙트럼 LED",
    specs: [
      "풀 스펙트럼",
      "타이머 내장",
      "밝기 조절",
      "저전력",
    ],
    stock: 20,
  },
];

/**
 * @typedef {Object} ProductContextType
 * @property {Product[]} products
 * @property {(product: Omit<Product, 'id'>) => void} addProduct
 * @property {(id: string, product: Partial<Product>) => void} updateProduct
 * @property {(id: string) => void} deleteProduct
 * @property {(id: string) => (Product|undefined)} getProductById
 */

const ProductContext = createContext(undefined);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function ProductProvider({ children }) {
  const [products, setProducts] = useState(
    initialProducts
  );

  /** @param {Omit<Product, 'id'>} product */
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  /** @param {string} id @param {Partial<Product>} updates */
  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, ...updates }
          : product
      )
    );
  };

  /** @param {string} id */
  const deleteProduct = (id) => {
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  /** @param {string} id */
  const getProductById = (id) => {
    return products.find(
      (product) => product.id === id
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      "useProducts must be used within a ProductProvider"
    );
  }
  return context;
}
