import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import {
  Bell,
  CheckCircle,
  Package,
  Truck,
  AlertCircle,
  XCircle,
} from "lucide-react";
import "./NotificationCenter.css";

const NotificationCenter = () => {
  const { notifications, markAsRead } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_shipment_request":
        return <Package className="icon new" />;
      case "shipment_accepted":
        return <CheckCircle className="icon success" />;
      case "shipment_delivered":
        return <Truck className="icon info" />;
      case "temperature_alert":
        return <AlertCircle className="icon warning" />;
      default:
        return <Bell className="icon default" />;
    }
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <div className="notification-center">
      <h2>Notification Center</h2>

      <div className="notifications-list">
        {Object.keys(groupedNotifications).map((date) => (
          <div key={date} className="notification-group">
            <h3 className="group-date">{date}</h3>
            {groupedNotifications[date].map((notif) => (
              <motion.div
                key={notif._id}
                className={`notification-card ${notif.read ? "read" : "unread"}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => markAsRead(notif._id)}
              >
                <div className="notification-card-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notification-card-content">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {!notif.read && <span className="unread-dot" />}
              </motion.div>
            ))}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="no-notifications-center">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
