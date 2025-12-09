import React, {
  createContext,
  useContext,
  useState,
} from "react";

/**
 * @typedef {import("./CartContext").CartItem} CartItem
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {CartItem[]} items
 * @property {number} totalPrice
 * @property {'pending' | 'processing' | 'shipping' | 'delivered' | 'confirmed' | 'cancelled' | 'refund_requested' | 'refunded'} status
 * @property {'pending' | 'paid' | 'failed' | 'refunded'} paymentStatus
 * @property {'kakaopay' | 'tosspay'=} paymentMethod
 * @property {string=} trackingNumber
 * @property {string} deliveryAddress
 * @property {string} phoneNumber
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date=} estimatedDelivery
 * @property {string=} refundReason
 * @property {Date=} refundRequestedAt
 */

/**
 * @typedef {Object} OrderContextType
 * @property {Order[]} orders
 * @property {(items: CartItem[], totalPrice: number, address: string, phone: string, method: 'kakaopay' | 'tosspay') => Order} createOrder
 * @property {(orderId: string, status: Order['status']) => void} updateOrderStatus
 * @property {(orderId: string) => void} confirmOrder
 * @property {(orderId: string, trackingNumber: string) => void} updateTrackingNumber
 * @property {(orderId: string, reason: string) => void} requestRefund
 * @property {(orderId: string) => void} approveRefund
 * @property {(orderId: string) => (Order | undefined)} getOrderById
 */

const OrderContext = createContext(undefined);

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export function OrderProvider({ children }) {
  /** @type {[Order[], Function]} */
  const [orders, setOrders] = useState([]);

  /**
   * @param {CartItem[]} items
   * @param {number} totalPrice
   * @param {string} address
   * @param {string} phone
   * @param {'kakaopay' | 'tosspay'} paymentMethod
   * @returns {Order}
   */
  const createOrder = (
    items,
    totalPrice,
    address,
    phone,
    paymentMethod
  ) => {
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      items,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      deliveryAddress: address,
      phoneNumber: phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  /**
   * @param {string} orderId
   * @param {Order['status']} status
   */
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  /**
   * @param {string} orderId
   */
  const confirmOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "confirmed",
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  /**
   * @param {string} orderId
   * @param {string} trackingNumber
   */
  const updateTrackingNumber = (
    orderId,
    trackingNumber
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              trackingNumber,
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  /**
   * @param {string} orderId
   * @param {string} reason
   */
  const requestRefund = (orderId, reason) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "refund_requested",
              refundReason: reason,
              refundRequestedAt: new Date(),
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  /**
   * @param {string} orderId
   */
  const approveRefund = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "refunded",
              paymentStatus: "refunded",
              updatedAt: new Date(),
            }
          : order
      )
    );
  };

  /**
   * @param {string} orderId
   * @returns {Order | undefined}
   */
  const getOrderById = (orderId) => {
    return orders.find(
      (order) => order.id === orderId
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        confirmOrder,
        updateTrackingNumber,
        requestRefund,
        approveRefund,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error(
      "useOrders must be used within an OrderProvider"
    );
  }
  return context;
}
