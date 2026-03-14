import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_shipment_request":
        return "📦";
      case "shipment_accepted":
        return "✅";
      case "shipment_delivered":
        return "🚚";
      case "temperature_alert":
        return "🌡️";
      default:
        return "🔔";
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
                    onClick={() => markAsRead(notif._id)}
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
