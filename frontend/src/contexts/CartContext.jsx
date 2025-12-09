import React, {
  createContext,
  useContext,
  useState,
} from "react";

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {'crop'|'device'|'service'} category
 * @property {string} farmName
 * @property {string} systemType
 * @property {string=} plant
 * @property {string=} stage
 * @property {number=} days
 * @property {number} price
 * @property {string} unit
 * @property {string} image
 * @property {string=} description
 * @property {string[]=} specs
 * @property {number=} stock
 */

/**
 * @typedef {Product & { quantity: number }} CartItem
 */

/**
 * @typedef {Object} CartContextType
 * @property {CartItem[]} items
 * @property {(product: Product, quantity?: number) => void} addToCart
 * @property {(productId: string) => void} removeFromCart
 * @property {(productId: string, quantity: number) => void} updateQuantity
 * @property {() => void} clearCart
 * @property {number} totalItems
 * @property {number} totalPrice
 */

/**
 * @typedef {{ children: React.ReactNode }} CartProviderProps
 */

/** @type {React.Context<CartContextType | undefined>} */
const CartContext = createContext(undefined);

/**
 * @param {CartProviderProps} props
 */
export function CartProvider({ children }) {
  /** @type {[CartItem[], Function]} */
  const [items, setItems] = useState([]);

  /**
   * @param {Product} product
   * @param {number} [quantity=1]
   */
  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...prevItems,
        { ...product, quantity },
      ];
    });
  };

  /**
   * @param {string} productId
   */
  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  /**
   * @param {string} productId
   * @param {number} quantity
   */
  const updateQuantity = (
    productId,
    quantity
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }
  return context;
}
