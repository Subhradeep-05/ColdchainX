import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  XCircle,
  Thermometer,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import StatusBadge from "../common/StatusBadge";
import api from "../../../services/api";
import "./RoleDashboard.css";

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [incomingShipments, setIncomingShipments] = useState([]);
  const [verifiedShipments, setVerifiedShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await api.getMyShipments();
      if (response.success) {
        const incoming = response.shipments.filter(
          (s) => s.status === "delivered",
        );
        const verified = response.shipments.filter(
          (s) => s.status === "verified" || s.status === "rejected",
        );
        setIncomingShipments(incoming);
        setVerifiedShipments(verified);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (shipmentId, approved) => {
    try {
      const response = await api.verifyShipment(shipmentId, approved);
      if (response.success) {
        loadShipments();
      }
    } catch (error) {
      console.error("Error verifying shipment:", error);
    }
  };

  return (
    <motion.div
      className="role-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-header">
        <div>
          <h1>Pharmacy Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.companyName}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#f39c1220", color: "#f39c12" }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{incomingShipments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "#27ae6020", color: "#27ae60" }}
          >
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Verified</h3>
            <p className="stat-value">
              {verifiedShipments.filter((s) => s.status === "verified").length}
            </p>
          </div>
        </div>
      </div>

      <div className="two-column-grid">
        <div className="column">
          <h2>Pending Verification</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="shipment-cards">
              {incomingShipments.map((shipment) => (
                <div key={shipment._id} className="shipment-card pharmacy">
                  <div className="shipment-header">
                    <h3>{shipment.medicineName}</h3>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <div className="shipment-details">
                    <p>Batch: {shipment.batchNumber}</p>
                    <p>Quantity: {shipment.quantity}</p>
                    <p>
                      Expiry:{" "}
                      {new Date(shipment.expiryDate).toLocaleDateString()}
                    </p>
                    <p>From: {shipment.distributorName}</p>

                    <div className="temperature-info">
                      <Thermometer size={16} />
                      <span>Storage: {shipment.storageTemp || "15-25°C"}</span>
                    </div>
                  </div>

                  <div className="verification-actions">
                    <button
                      className="verify-btn approve"
                      onClick={() => handleVerify(shipment._id, true)}
                    >
                      <CheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      className="verify-btn reject"
                      onClick={() => handleVerify(shipment._id, false)}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {incomingShipments.length === 0 && (
                <div className="empty-state">
                  No shipments pending verification
                </div>
              )}
            </div>
          )}
        </div>

        <div className="column">
          <h2>Recent Activity</h2>
          <div className="verified-list">
            {verifiedShipments.map((shipment) => (
              <div key={shipment._id} className="verified-item">
                <div className={`verified-icon ${shipment.status}`}>
                  {shipment.status === "verified" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                </div>
                <div className="verified-info">
                  <p className="verified-name">{shipment.medicineName}</p>
                  <p className="verified-from">
                    from {shipment.distributorName}
                  </p>
                </div>
                <span className={`verified-status ${shipment.status}`}>
                  {shipment.status}
                </span>
              </div>
            ))}
            {verifiedShipments.length === 0 && (
              <div className="empty-state">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PharmacyDashboard;
