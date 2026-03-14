import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import ShipmentCard from "../common/ShipmentCard";
import StatusBadge from "../common/StatusBadge";
import api from "../../../services/api";
import "./RoleDashboard.css";

const ShipmentDashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [availableShipments, setAvailableShipments] = useState([]);
  const [myShipments, setMyShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      // Get available shipments (pending_distributor)
      const availableResponse = await api.getAvailableShipments();
      if (availableResponse.success) {
        setAvailableShipments(availableResponse.shipments);
      }

      // Get my accepted shipments
      const myResponse = await api.getMyShipments();
      if (myResponse.success) {
        setMyShipments(myResponse.shipments);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptShipment = async (shipment) => {
    try {
      const response = await api.acceptShipment(shipment._id);
      if (response.success) {
        loadShipments();
      }
    } catch (error) {
      console.error("Error accepting shipment:", error);
    }
  };

  const handleStartTransit = async (shipment) => {
    try {
      const response = await api.startTransit(shipment._id);
      if (response.success) {
        loadShipments();
      }
    } catch (error) {
      console.error("Error starting transit:", error);
    }
  };

  const stats = [
    {
      title: "Available",
      value: availableShipments.length,
      icon: Package,
      color: "#3498db",
    },
    {
      title: "My Shipments",
      value: myShipments.length,
      icon: Truck,
      color: "var(--nude-600)",
    },
    {
      title: "In Transit",
      value: myShipments.filter((s) => s.status === "in_transit").length,
      icon: Clock,
      color: "#f39c12",
    },
    {
      title: "Delivered",
      value: myShipments.filter((s) => s.status === "delivered").length,
      icon: CheckCircle,
      color: "#27ae60",
    },
  ];

  return (
    <motion.div
      className="role-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-header">
        <div>
          <h1>Shipment Provider Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.companyName}</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="stat-icon"
              style={{ background: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="two-column-grid">
        <div className="column">
          <h2>Available Shipments</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="available-shipments">
              {availableShipments.map((shipment) => (
                <div key={shipment._id} className="available-card">
                  <div className="available-header">
                    <h3>{shipment.medicineName}</h3>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <div className="available-details">
                    <p>Quantity: {shipment.quantity} units</p>
                    <p>From: {shipment.distributorName}</p>
                    <p>Batch: {shipment.batchNumber}</p>
                  </div>
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptShipment(shipment)}
                  >
                    Accept Shipment
                  </button>
                </div>
              ))}
              {availableShipments.length === 0 && (
                <div className="empty-state">No available shipments</div>
              )}
            </div>
          )}
        </div>

        <div className="column">
          <h2>My Active Shipments</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="my-shipments">
              {myShipments.map((shipment) => (
                <div key={shipment._id} className="my-shipment-card">
                  <div className="shipment-header">
                    <h3>{shipment.medicineName}</h3>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <div className="shipment-details">
                    <p>
                      To:{" "}
                      {shipment.hospitalId || shipment.pharmacyId || "Pending"}
                    </p>
                    <p>Quantity: {shipment.quantity}</p>
                    {shipment.status === "with_shipment" && (
                      <button
                        className="start-transit-btn"
                        onClick={() => handleStartTransit(shipment)}
                      >
                        <Truck size={16} />
                        Start Transit
                      </button>
                    )}
                    {shipment.status === "in_transit" && (
                      <div className="tracking-info">
                        <MapPin size={16} />
                        <span>In transit - ETA: 2h 30m</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {myShipments.length === 0 && (
                <div className="empty-state">No active shipments</div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShipmentDashboard;
