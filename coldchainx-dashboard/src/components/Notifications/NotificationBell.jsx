import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_shipment_request":
        return <Package size={18} />;
      case "shipment_accepted":
        return <CheckCircle size={18} />;
      case "shipment_delivered":
        return <Truck size={18} />;
      case "temperature_alert":
        return <AlertCircle size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    // Navigate based on notification type
    if (notification.data?.shipmentId) {
      // Navigate to shipment details
      console.log("Navigate to shipment:", notification.data.shipmentId);
    }
  };

  return (
    <div className="notification-container">
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">No notifications</div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`notification-item ${notif.read ? "read" : "unread"}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <span className="notification-icon">
                      {getNotificationIcon(notif.type)}
                    </span>
                    <div className="notification-content">
                      <p className="notification-title">{notif.title}</p>
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
