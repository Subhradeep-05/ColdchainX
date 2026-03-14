import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  Thermometer,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api";
import "./Pages.css";

const VerifyShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadPendingVerifications();
  }, []);

  const loadPendingVerifications = async () => {
    try {
      const response = await api.getPendingVerifications();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error("Error loading verifications:", error);
    }
  };

  const handleVerify = async (approved) => {
    const currentShipment = shipments[currentIndex];
    try {
      const response = await api.verifyShipment(currentShipment._id, approved);
      if (response.success) {
        if (currentIndex < shipments.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setShipments([]);
          setCurrentIndex(0);
        }
      }
    } catch (error) {
      console.error("Error verifying shipment:", error);
    }
  };

  if (shipments.length === 0) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="empty-state"
          style={{ textAlign: "center", padding: "4rem" }}
        >
          <CheckCircle
            size={64}
            style={{ color: "var(--nude-300)", marginBottom: "1rem" }}
          />
          <h2>No Pending Verifications</h2>
          <p>All shipments have been verified</p>
        </div>
      </motion.div>
    );
  }

  const shipment = shipments[currentIndex];

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Verify Shipment</h1>
        <div className="progress-indicator">
          {currentIndex + 1} of {shipments.length}
        </div>
      </div>

      <div
        className="form-container"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h2 className="form-title">Shipment #{shipment.shipmentId}</h2>

        <div style={{ margin: "2rem 0" }}>
          <div className="verification-item" style={{ marginBottom: "1.5rem" }}>
            <Package size={20} style={{ color: "var(--nude-600)" }} />
            <div>
              <strong>Medicine:</strong> {shipment.medicineName}
            </div>
          </div>

          <div className="verification-item" style={{ marginBottom: "1.5rem" }}>
            <FileText size={20} style={{ color: "var(--nude-600)" }} />
            <div>
              <strong>Batch Number:</strong> {shipment.batchNumber}
            </div>
          </div>

          <div className="verification-item" style={{ marginBottom: "1.5rem" }}>
            <Calendar size={20} style={{ color: "var(--nude-600)" }} />
            <div>
              <strong>Expiry Date:</strong>{" "}
              {new Date(shipment.expiryDate).toLocaleDateString()}
            </div>
          </div>

          <div className="verification-item" style={{ marginBottom: "1.5rem" }}>
            <Package size={20} style={{ color: "var(--nude-600)" }} />
            <div>
              <strong>Quantity:</strong> {shipment.quantity} units
            </div>
          </div>

          <div className="verification-item" style={{ marginBottom: "1.5rem" }}>
            <Thermometer
              size={20}
              style={{
                color: shipment.temperature > 8 ? "#e74c3c" : "#27ae60",
              }}
            />
            <div>
              <strong>Temperature at Delivery:</strong> {shipment.temperature}°C
              {shipment.temperature > 8 && (
                <span style={{ color: "#e74c3c", marginLeft: "0.5rem" }}>
                  (Out of range!)
                </span>
              )}
            </div>
          </div>

          {shipment.temperature > 8 && (
            <div
              className="alert-message"
              style={{
                background: "rgba(231, 76, 60, 0.1)",
                color: "#e74c3c",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
              }}
            >
              <AlertCircle size={18} />
              <span>Temperature exceeded safe range during transit</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="btn-danger"
            style={{ flex: 1 }}
            onClick={() => handleVerify(false)}
          >
            <XCircle size={18} />
            Reject Shipment
          </button>
          <button
            className="btn-success"
            style={{ flex: 1 }}
            onClick={() => handleVerify(true)}
          >
            <CheckCircle size={18} />
            Accept & Verify
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyShipmentsPage;
