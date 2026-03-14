import React from "react";
import { motion } from "framer-motion";
import { Package, Thermometer, Truck, Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import "./Common.css";

const ShipmentCard = ({ shipment, onAction, actionLabel }) => {
  const getTemperatureStatus = (temp) => {
    if (!temp) return null;
    if (temp > 8) return { class: "critical", text: "Critical" };
    if (temp > 5) return { class: "warning", text: "Warning" };
    return { class: "normal", text: "Normal" };
  };

  const tempStatus = shipment.temperature
    ? getTemperatureStatus(shipment.temperature)
    : null;

  return (
    <motion.div
      className="shipment-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="shipment-card-header">
        <div className="shipment-id">
          <Package size={18} />
          <span>#{shipment.shipmentId || shipment.id}</span>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="shipment-card-body">
        <h3 className="medicine-name">{shipment.medicineName}</h3>

        <div className="shipment-details">
          {shipment.batchNumber && (
            <div className="detail-item">
              <span className="detail-label">Batch:</span>
              <span className="detail-value">{shipment.batchNumber}</span>
            </div>
          )}

          <div className="detail-item">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{shipment.quantity} units</span>
          </div>

          {shipment.from && (
            <div className="detail-item">
              <MapPin size={14} />
              <span className="detail-value">{shipment.from}</span>
            </div>
          )}

          {shipment.to && (
            <div className="detail-item">
              <MapPin size={14} />
              <span className="detail-value">{shipment.to}</span>
            </div>
          )}
        </div>

        {shipment.temperature && (
          <div className={`temperature-indicator ${tempStatus?.class}`}>
            <Thermometer size={16} />
            <span>{shipment.temperature}°C</span>
            <span className="temp-status-text">{tempStatus?.text}</span>
          </div>
        )}

        {shipment.eta && (
          <div className="eta-indicator">
            <Calendar size={14} />
            <span>ETA: {shipment.eta}</span>
          </div>
        )}
      </div>

      {onAction && (
        <div className="shipment-card-footer">
          <button className="action-btn" onClick={() => onAction(shipment)}>
            {actionLabel || "View Details"}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ShipmentCard;
