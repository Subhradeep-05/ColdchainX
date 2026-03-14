import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const IncomingShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncomingShipments();

    socketService.on("shipment_delivered", handleNewDelivery);

    return () => {
      socketService.off("shipment_delivered", handleNewDelivery);
    };
  }, []);

  const loadIncomingShipments = async () => {
    try {
      const response = await api.getIncomingShipments();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDelivery = (shipment) => {
    setShipments((prev) => [...prev, shipment]);
  };

  const handleVerify = async (shipmentId, approved) => {
    try {
      const response = await api.verifyShipment(shipmentId, approved);
      if (response.success) {
        setShipments((prev) => prev.filter((s) => s._id !== shipmentId));
      }
    } catch (error) {
      console.error("Error verifying shipment:", error);
    }
  };

  const stats = {
    total: shipments.length,
    urgent: shipments.filter((s) => s.priority === "urgent").length,
    temperature: shipments.filter((s) => s.temperature > 8).length,
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Incoming Shipments</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Expected Today</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Temperature Alerts</div>
            <div className="stat-value">{stats.temperature}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Urgent</div>
            <div className="stat-value">{stats.urgent}</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {shipments.map((shipment) => (
          <div key={shipment._id} className="info-card">
            <div className="card-header">
              <h3>{shipment.medicineName}</h3>
              <span className={`status-badge ${shipment.status}`}>
                {shipment.status === "in_transit" ? "In Transit" : "Delivered"}
              </span>
            </div>

            <div className="card-details">
              <p>
                <strong>From:</strong> {shipment.distributorName}
              </p>
              <p>
                <strong>Quantity:</strong> {shipment.quantity} units
              </p>
              <p>
                <strong>Batch:</strong> {shipment.batchNumber}
              </p>
              <p>
                <strong>Expiry:</strong>{" "}
                {new Date(shipment.expiryDate).toLocaleDateString()}
              </p>
              {shipment.temperature && (
                <p
                  style={{
                    color: shipment.temperature > 8 ? "#e74c3c" : "#27ae60",
                  }}
                >
                  <strong>Temperature:</strong> {shipment.temperature}°C
                </p>
              )}
            </div>

            {shipment.status === "delivered" && (
              <div className="card-footer">
                <button
                  className="btn-success"
                  onClick={() => handleVerify(shipment._id, true)}
                >
                  <CheckCircle size={16} />
                  Accept & Verify
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleVerify(shipment._id, false)}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            )}

            {shipment.status === "in_transit" && (
              <div className="card-footer">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "60%" }} />
                </div>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "0.5rem",
                    color: "var(--taupe)",
                  }}
                >
                  ETA: {shipment.eta || "2h 30m"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default IncomingShipmentsPage;
