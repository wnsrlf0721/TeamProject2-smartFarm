import React, { createContext, useContext, useState } from "react";

import { getOrders,createOrder } from "../../api/order/orderApi"; // 주문 유저별 주문목록 API

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} image
 * @property {string=} category
 * @property {string=} description
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

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const createOrder = (items, totalPrice, address, phone, paymentMethod) => {
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      deliveryAddress: address,
      phoneNumber: phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status, updatedAt: new Date() } : order
      )
    );
  };

  const confirmOrder = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: "confirmed", updatedAt: new Date() } : order
      )
    );
  };

  const updateTrackingNumber = (orderId, trackingNumber) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, trackingNumber, updatedAt: new Date() } : order
      )
    );
  };

  const requestRefund = (orderId, reason) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status: "refund_requested", refundReason: reason, refundRequestedAt: new Date(), updatedAt: new Date() }
          : order
      )
    );
  };

  const approveRefund = (orderId) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: "refunded", paymentStatus: "refunded", updatedAt: new Date() } : order
      )
    );
  };

  const getOrderById = (orderId) => orders.find(order => order.id === orderId);

  return (
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, confirmOrder, updateTrackingNumber, requestRefund, approveRefund, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
}
