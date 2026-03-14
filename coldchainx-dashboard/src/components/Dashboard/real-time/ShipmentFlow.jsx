import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import socketService from "../../../services/socket";
import api from "../../../services/api";
import "./ShipmentFlow.css";

const ShipmentFlow = ({ shipment, onUpdate }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(shipment.status);
  const [temperature, setTemperature] = useState(shipment.temperature);
  const [location, setLocation] = useState(shipment.currentLocation);

  useEffect(() => {
    // Listen for real-time updates for this shipment
    socketService.on(`shipment_${shipment._id}`, handleShipmentUpdate);

    return () => {
      socketService.off(`shipment_${shipment._id}`, handleShipmentUpdate);
    };
  }, [shipment._id]);

  const handleShipmentUpdate = (data) => {
    setStatus(data.status);
    setTemperature(data.temperature);
    setLocation(data.location);
    if (onUpdate) onUpdate(data);
  };

  const getRoleActions = () => {
    switch (user?.role) {
      case "distributor":
        return (
          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => assignShipment(shipment._id)}
            >
              Assign to Shipment Provider
            </button>
          </div>
        );

      case "shipment":
        return (
          <div className="action-buttons">
            {status === "assigned" && (
              <button
                className="btn-primary"
                onClick={() => startDelivery(shipment._id)}
              >
                Start Delivery
              </button>
            )}
            {status === "in_transit" && (
              <>
                <input
                  type="number"
                  placeholder="Temperature °C"
                  onChange={(e) => recordTemp(shipment._id, e.target.value)}
                />
                <button
                  className="btn-success"
                  onClick={() => markDelivered(shipment._id)}
                >
                  Mark Delivered
                </button>
              </>
            )}
          </div>
        );

      case "hospital":
      case "pharmacy":
        return (
          <div className="action-buttons">
            {status === "delivered" && (
              <>
                <button
                  className="btn-success"
                  onClick={() => verifyShipment(shipment._id, true)}
                >
                  Accept & Verify
                </button>
                <button
                  className="btn-danger"
                  onClick={() => verifyShipment(shipment._id, false)}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`shipment-flow-card status-${status}`}>
      <div className="shipment-header">
        <h3>{shipment.medicineName}</h3>
        <span className="status-badge">{status}</span>
      </div>

      <div className="shipment-tracking">
        <div className="tracking-info">
          <div className="info-item">
            <span className="label">Current Location</span>
            <span className="value">{location || "Not started"}</span>
          </div>
          <div className="info-item">
            <span className="label">Temperature</span>
            <span className={`value ${temperature > 8 ? "alert" : ""}`}>
              {temperature ? `${temperature}°C` : "Not recorded"}
            </span>
          </div>
        </div>

        <div className="timeline">
          <div
            className={`timeline-step ${status !== "pending" ? "completed" : ""}`}
          >
            <span>Assigned</span>
          </div>
          <div
            className={`timeline-step ${status === "in_transit" || status === "delivered" ? "completed" : ""}`}
          >
            <span>In Transit</span>
          </div>
          <div
            className={`timeline-step ${status === "delivered" ? "completed" : ""}`}
          >
            <span>Delivered</span>
          </div>
          <div
            className={`timeline-step ${status === "verified" ? "completed" : ""}`}
          >
            <span>Verified</span>
          </div>
        </div>
      </div>

      {getRoleActions()}
    </div>
  );
};

export default ShipmentFlow;
