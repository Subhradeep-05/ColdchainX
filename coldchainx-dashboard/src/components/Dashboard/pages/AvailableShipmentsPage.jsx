import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  MapPin,
  Calendar,
  Thermometer,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const AvailableShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    loadAvailableShipments();

    socketService.on("new_shipment_created", handleNewShipment);

    return () => {
      socketService.off("new_shipment_created", handleNewShipment);
    };
  }, []);

  const loadAvailableShipments = async () => {
    try {
      const response = await api.getAvailableShipments();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewShipment = (shipment) => {
    setShipments((prev) => [shipment, ...prev]);
  };

  const handleAcceptShipment = async (shipmentId) => {
    try {
      const response = await api.acceptShipment(shipmentId);
      if (response.success) {
        setShipments((prev) => prev.filter((s) => s._id !== shipmentId));
        setSelectedShipment(null);
      }
    } catch (error) {
      console.error("Error accepting shipment:", error);
    }
  };

  const stats = {
    total: shipments.length,
    urgent: shipments.filter((s) => s.priority === "urgent").length,
    medical: shipments.filter(
      (s) => s.category === "vaccine" || s.category === "insulin",
    ).length,
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Available Shipments</h1>
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
            <div className="stat-label">Available</div>
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
            <div className="stat-label">Urgent</div>
            <div className="stat-value">{stats.urgent}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Medical Supplies</div>
            <div className="stat-value">{stats.medical}</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {shipments.map((shipment) => (
          <motion.div
            key={shipment._id}
            className="info-card"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedShipment(shipment)}
          >
            <div className="card-header">
              <h3>{shipment.medicineName}</h3>
              <span
                className={`card-badge ${shipment.priority === "urgent" ? "high" : "medium"}`}
              >
                {shipment.priority || "Normal"}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <MapPin size={14} className="detail-label" />
                <span className="detail-value">
                  From: {shipment.distributorName}
                </span>
              </div>
              <div className="detail-row">
                <Package size={14} className="detail-label" />
                <span className="detail-value">
                  Quantity: {shipment.quantity} units
                </span>
              </div>
              <div className="detail-row">
                <Calendar size={14} className="detail-label" />
                <span className="detail-value">
                  Created: {new Date(shipment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {shipment.storageTemp && (
                <div className="detail-row">
                  <Thermometer size={14} className="detail-label" />
                  <span className="detail-value">
                    Storage: {shipment.storageTemp}
                  </span>
                </div>
              )}
            </div>

            <div className="card-footer">
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptShipment(shipment._id);
                }}
              >
                <Truck size={16} />
                Accept Shipment
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onAccept={handleAcceptShipment}
        />
      )}
    </motion.div>
  );
};

const ShipmentDetailModal = ({ shipment, onClose, onAccept }) => (
  <div className="modal-overlay" onClick={onClose}>
    <motion.div
      className="modal-content"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Shipment Details</h2>

      <div style={{ margin: "2rem 0" }}>
        <h3>{shipment.medicineName}</h3>
        <p>
          <strong>Distributor:</strong> {shipment.distributorName}
        </p>
        <p>
          <strong>Quantity:</strong> {shipment.quantity} units
        </p>
        <p>
          <strong>Batch Number:</strong> {shipment.batchNumber}
        </p>
        <p>
          <strong>Expiry Date:</strong>{" "}
          {new Date(shipment.expiryDate).toLocaleDateString()}
        </p>
        {shipment.storageTemp && (
          <p>
            <strong>Storage:</strong> {shipment.storageTemp}
          </p>
        )}
        {shipment.specialInstructions && (
          <>
            <p>
              <strong>Special Instructions:</strong>
            </p>
            <p
              style={{
                background: "var(--nude-100)",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              {shipment.specialInstructions}
            </p>
          </>
        )}
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn-primary" onClick={() => onAccept(shipment._id)}>
          Accept Shipment
        </button>
      </div>
    </motion.div>
  </div>
);

export default AvailableShipmentsPage;
