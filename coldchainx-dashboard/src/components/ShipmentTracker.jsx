import React from "react";
import { motion } from "framer-motion";
import { MapPin, Thermometer, Package, Clock } from "lucide-react";
import "./ShipmentTracker.css";

const ShipmentTracker = () => {
  const shipments = [
    {
      id: "SHP-001",
      from: "Mumbai",
      to: "Delhi",
      temp: "2.4°C",
      status: "In Transit",
      eta: "2h 30m",
    },
    {
      id: "SHP-002",
      from: "Chennai",
      to: "Bangalore",
      temp: "3.1°C",
      status: "Delayed",
      eta: "1h 45m",
    },
    {
      id: "SHP-003",
      from: "Kolkata",
      to: "Hyderabad",
      temp: "2.8°C",
      status: "On Time",
      eta: "3h 15m",
    },
  ];

  return (
    <motion.div
      className="tracker-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tracker-header">
        <h2 className="tracker-title">
          <MapPin size={24} />
          Live Shipment Tracking
        </h2>
        <span className="tracker-badge">12 Active</span>
      </div>

      <div className="shipment-list">
        {shipments.map((shipment, index) => (
          <motion.div
            key={shipment.id}
            className="shipment-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <div className="shipment-header">
              <span className="shipment-id">{shipment.id}</span>
              <span
                className={`shipment-status ${shipment.status.toLowerCase().replace(" ", "-")}`}
              >
                {shipment.status}
              </span>
            </div>

            <div className="shipment-route">
              <div className="route-point">
                <span className="point-label">From</span>
                <span className="point-value">{shipment.from}</span>
              </div>
              <div className="route-line"></div>
              <div className="route-point">
                <span className="point-label">To</span>
                <span className="point-value">{shipment.to}</span>
              </div>
            </div>

            <div className="shipment-details">
              <div className="detail">
                <Thermometer size={16} />
                <span className={shipment.temp > 3 ? "warning-temp" : ""}>
                  {shipment.temp}
                </span>
              </div>
              <div className="detail">
                <Clock size={16} />
                <span>{shipment.eta}</span>
              </div>
              <div className="detail">
                <Package size={16} />
                <span>Vaccines</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="view-all-btn">View All Shipments</button>
    </motion.div>
  );
};

export default ShipmentTracker;
