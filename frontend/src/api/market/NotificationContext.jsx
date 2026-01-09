import React, {
  createContext,
  useContext,
  useState,
} from "react";

/**
 * @typedef {'order' | 'payment' | 'shipping' | 'delivery' | 'refund' | 'system'} NotificationType
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {NotificationType} type
 * @property {string} title
 * @property {string} message
 * @property {Date} createdAt
 * @property {boolean} read
 * @property {string=} orderId
 */

/**
 * @typedef {Object} NotificationInput
 * @property {NotificationType} type
 * @property {string} title
 * @property {string} message
 * @property {string=} orderId
 */

/**
 * @typedef {Object} NotificationContextType
 * @property {Notification[]} notifications
 * @property {(notification: NotificationInput) => void} addNotification
 * @property {(notificationId: string) => void} markAsRead
 * @property {() => void} markAllAsRead
 * @property {number} unreadCount
 */

/** @type {React.Context<NotificationContextType | undefined>} */
const NotificationContext =
  createContext(undefined);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function NotificationProvider({
  children,
}) {
  /** @type {[Notification[], Function]} */
  const [notifications, setNotifications] =
    useState([]);

  /**
   * @param {NotificationInput} notification
   */
  const addNotification = (notification) => {
    /** @type {Notification} */
    const newNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`,
      createdAt: new Date(),
      read: false,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev,
    ]);
  };

  /**
   * @param {string} notificationId
   */
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({
        ...notif,
        read: true,
      }))
    );
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
