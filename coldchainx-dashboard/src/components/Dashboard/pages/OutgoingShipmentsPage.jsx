import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const OutgoingShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();

    socketService.on("shipment_updated", handleShipmentUpdate);

    return () => {
      socketService.off("shipment_updated", handleShipmentUpdate);
    };
  }, []);

  const loadShipments = async () => {
    try {
      const response = await api.getMyShipments();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipmentUpdate = (data) => {
    setShipments((prev) => prev.map((s) => (s._id === data._id ? data : s)));
  };

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === "pending_distributor").length,
    inTransit: shipments.filter((s) => s.status === "in_transit").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
    verified: shipments.filter((s) => s.status === "verified").length,
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Outgoing Shipments</h1>
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
            <div className="stat-label">Pending</div>
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
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.delivered + stats.verified}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h2>All Outgoing Shipments</h2>

        {loading ? (
          <div className="loading">Loading shipments...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Medicine</th>
                <th>Batch</th>
                <th>Quantity</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment._id}>
                  <td>#{shipment.shipmentId}</td>
                  <td>
                    <strong>{shipment.medicineName}</strong>
                  </td>
                  <td>{shipment.batchNumber}</td>
                  <td>{shipment.quantity}</td>
                  <td>{shipment.destinationName || "Pending"}</td>
                  <td>
                    <span className={`status-badge ${shipment.status}`}>
                      {shipment.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ padding: "0.25rem 0.5rem" }}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default OutgoingShipmentsPage;
