import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Thermometer,
  Navigation,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const ActiveDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActiveDeliveries();

    socketService.on("location_updated", handleLocationUpdate);
    socketService.on("temperature_update", handleTemperatureUpdate);

    return () => {
      socketService.off("location_updated", handleLocationUpdate);
      socketService.off("temperature_update", handleTemperatureUpdate);
    };
  }, []);

  const loadActiveDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getActiveDeliveries();
      if (response.success) {
        // Ensure deliveries is always an array
        setDeliveries(response.shipments || []);
      } else {
        setError(response.error || "Failed to load deliveries");
        setDeliveries([]);
      }
    } catch (error) {
      console.error("Error loading deliveries:", error);
      setError("Network error. Please try again.");
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = (data) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d._id === data.deliveryId ? { ...d, location: data.location } : d,
      ),
    );
  };

  const handleTemperatureUpdate = (data) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d._id === data.shipmentId ? { ...d, temperature: data.temperature } : d,
      ),
    );
  };

  const updateLocation = (deliveryId, location) => {
    socketService.emit("update_location", { deliveryId, location });
    // Also update via API
    api.updateShipmentLocation(deliveryId, location).catch(console.error);
  };

  const getTemperatureStatus = (temp) => {
    if (!temp) return { status: "unknown", color: "#999", text: "No data" };
    if (temp > 8)
      return { status: "critical", color: "#e74c3c", text: "Critical" };
    if (temp < 2)
      return { status: "critical", color: "#e74c3c", text: "Critical" };
    if (temp > 5)
      return { status: "warning", color: "#f39c12", text: "Warning" };
    return { status: "normal", color: "#27ae60", text: "Normal" };
  };

  const getProgressPercentage = (shipment) => {
    if (!shipment.createdAt || !shipment.estimatedDelivery) return 0;
    const start = new Date(shipment.createdAt).getTime();
    const end = new Date(shipment.estimatedDelivery).getTime();
    const now = Date.now();

    if (now >= end) return 100;
    if (now <= start) return 0;

    return Math.round(((now - start) / (end - start)) * 100);
  };

  if (loading) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading active deliveries...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Error Loading Deliveries</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={loadActiveDeliveries}>
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Active Deliveries</h1>
        <button className="btn-secondary" onClick={loadActiveDeliveries}>
          <Navigation size={16} /> Refresh
        </button>
      </div>

      {deliveries.length === 0 ? (
        <div className="empty-state">
          <Package size={64} style={{ color: "var(--nude-300)" }} />
          <h3>No Active Deliveries</h3>
          <p>You don't have any active deliveries at the moment.</p>
        </div>
      ) : (
        <div className="temp-monitor-grid">
          {deliveries.map((delivery) => {
            const tempStatus = getTemperatureStatus(delivery.temperature);
            const progress = getProgressPercentage(delivery);

            return (
              <div
                key={delivery._id}
                className={`temp-card ${tempStatus.status}`}
              >
                <div className="temp-header">
                  <div>
                    <h3>{delivery.medicineName || "Unknown Medicine"}</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--taupe)" }}>
                      Batch: {delivery.batchNumber || "N/A"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="temp-value">
                      {delivery.temperature
                        ? delivery.temperature.toFixed(1)
                        : "--"}
                      °C
                    </span>
                    <div
                      style={{ fontSize: "0.8rem", color: tempStatus.color }}
                    >
                      {tempStatus.text}
                    </div>
                  </div>
                </div>

                <div className="delivery-info" style={{ marginTop: "1rem" }}>
                  <p>
                    <MapPin size={14} style={{ marginRight: "0.5rem" }} />
                    <strong>From:</strong>{" "}
                    {delivery.distributorName || "Unknown"}
                  </p>
                  <p>
                    <MapPin size={14} style={{ marginRight: "0.5rem" }} />
                    <strong>To:</strong>{" "}
                    {delivery.hospitalName ||
                      delivery.pharmacyName ||
                      "Pending"}
                  </p>
                  <p>
                    <Package size={14} style={{ marginRight: "0.5rem" }} />
                    <strong>Quantity:</strong> {delivery.quantity || 0} units
                  </p>
                  {delivery.currentLocation && (
                    <p>
                      <Navigation size={14} style={{ marginRight: "0.5rem" }} />
                      <strong>Last Location:</strong> {delivery.currentLocation}
                    </p>
                  )}
                </div>

                <div className="progress-section" style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{ fontSize: "0.85rem", color: "var(--taupe)" }}
                    >
                      Progress
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}
                >
                  <button
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    Update Location
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() =>
                      (window.location.href = `/shipments/${delivery._id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDelivery && (
        <LocationUpdateModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onUpdate={updateLocation}
        />
      )}
    </motion.div>
  );
};

const LocationUpdateModal = ({ delivery, onClose, onUpdate }) => {
  const [location, setLocation] = useState(delivery.currentLocation || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(delivery._id, location);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Update Location</h2>
        <h3>{delivery.medicineName || "Shipment"}</h3>

        <form onSubmit={handleSubmit}>
          <div style={{ margin: "2rem 0" }}>
            <div className="form-group">
              <label>Current Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter current location"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ActiveDeliveriesPage;
