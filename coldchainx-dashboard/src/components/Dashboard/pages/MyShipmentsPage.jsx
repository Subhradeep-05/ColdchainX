import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Thermometer,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const MyShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyShipments();

    socketService.on("shipment_updated", handleShipmentUpdate);

    return () => {
      socketService.off("shipment_updated", handleShipmentUpdate);
    };
  }, []);

  const loadMyShipments = async () => {
    try {
      const response = await api.getMyShipments();
      if (response.success) {
        setShipments(
          response.shipments.filter((s) => s.status !== "pending_distributor"),
        );
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipmentUpdate = (updatedShipment) => {
    setShipments((prev) =>
      prev.map((s) => (s._id === updatedShipment._id ? updatedShipment : s)),
    );
  };

  const handleStartTransit = async (shipmentId) => {
    try {
      const response = await api.startTransit(shipmentId);
      if (response.success) {
        loadMyShipments();
      }
    } catch (error) {
      console.error("Error starting transit:", error);
    }
  };

  const handleDeliver = async (shipmentId) => {
    try {
      const response = await api.deliverShipment(shipmentId);
      if (response.success) {
        loadMyShipments();
      }
    } catch (error) {
      console.error("Error delivering shipment:", error);
    }
  };

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    pending: shipments.filter((s) => s.status === "with_shipment").length,
  };

  const getStatusActions = (shipment) => {
    switch (shipment.status) {
      case "with_shipment":
        return (
          <button
            className="btn-primary"
            onClick={() => handleStartTransit(shipment._id)}
          >
            <Truck size={16} />
            Start Transit
          </button>
        );
      case "in_transit":
        return (
          <button
            className="btn-success"
            onClick={() => handleDeliver(shipment._id)}
          >
            <CheckCircle size={16} />
            Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>My Shipments</h1>
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
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
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
            <div className="stat-label">Pending Pickup</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(155, 89, 182, 0.1)", color: "#9b59b6" }}
          >
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Transit</div>
            <div className="stat-value">{stats.inTransit}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Delivered</div>
            <div className="stat-value">{stats.delivered}</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {shipments.map((shipment) => (
          <div key={shipment._id} className="info-card">
            <div className="card-header">
              <h3>{shipment.medicineName}</h3>
              <span className={`status-badge ${shipment.status}`}>
                {shipment.status.replace("_", " ")}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <MapPin size={14} className="detail-label" />
                <span>From: {shipment.distributorName}</span>
              </div>
              <div className="detail-row">
                <MapPin size={14} className="detail-label" />
                <span>To: {shipment.destinationName || "Pending"}</span>
              </div>
              <div className="detail-row">
                <Package size={14} className="detail-label" />
                <span>Quantity: {shipment.quantity} units</span>
              </div>
              {shipment.temperature && (
                <div className="detail-row">
                  <Thermometer size={14} className="detail-label" />
                  <span className={shipment.temperature > 8 ? "alert" : ""}>
                    {shipment.temperature}°C
                  </span>
                </div>
              )}
            </div>

            <div className="card-footer">{getStatusActions(shipment)}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyShipmentsPage;
