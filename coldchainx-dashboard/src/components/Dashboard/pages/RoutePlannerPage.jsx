import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Navigation,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import "./Pages.css";

const RoutePlannerPage = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      from: "Mumbai Warehouse",
      to: "City Hospital",
      distance: "28 km",
      duration: "45 min",
      stops: [
        { location: "Mumbai Warehouse", status: "current" },
        { location: "Pharma Hub", status: "completed" },
        { location: "City Hospital", status: "pending" },
      ],
      shipments: ["Paracetamol", "Antibiotics"],
      status: "active",
    },
    {
      id: 2,
      from: "Delhi Distribution",
      to: "HealthFirst Pharmacy",
      distance: "15 km",
      duration: "25 min",
      stops: [
        { location: "Delhi Distribution", status: "completed" },
        { location: "Central Pharmacy", status: "pending" },
        { location: "HealthFirst Pharmacy", status: "pending" },
      ],
      shipments: ["Insulin", "Vaccines"],
      status: "planned",
    },
  ]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Route Planner</h1>
        <button className="btn-primary">
          <Navigation size={18} />
          Optimize Routes
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Routes</div>
            <div className="stat-value">
              {routes.filter((r) => r.status === "active").length}
            </div>
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
            <div className="stat-label">Completed Today</div>
            <div className="stat-value">8</div>
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
            <div className="stat-label">Avg. Delivery Time</div>
            <div className="stat-value">32 min</div>
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
            <div className="stat-label">Delays</div>
            <div className="stat-value">2</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {routes.map((route) => (
          <div key={route.id} className="info-card">
            <div className="card-header">
              <h3>Route #{route.id}</h3>
              <span className={`status-badge ${route.status}`}>
                {route.status}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <Map size={14} className="detail-label" />
                <span>
                  {route.from} → {route.to}
                </span>
              </div>
              <div className="detail-row">
                <Navigation size={14} className="detail-label" />
                <span>
                  {route.distance} • {route.duration}
                </span>
              </div>
              <div className="detail-row">
                <Package size={14} className="detail-label" />
                <span>{route.shipments.join(", ")}</span>
              </div>
            </div>

            <div className="route-stops" style={{ margin: "1rem 0" }}>
              {route.stops.map((stop, index) => (
                <div
                  key={index}
                  className="stop-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background:
                        stop.status === "completed"
                          ? "#27ae60"
                          : stop.status === "current"
                            ? "#f39c12"
                            : "#ddd",
                    }}
                  />
                  <span style={{ flex: 1 }}>{stop.location}</span>
                  {stop.status === "current" && (
                    <span className="status-badge pending">Current</span>
                  )}
                </div>
              ))}
            </div>

            <div className="card-footer">
              <button
                className="btn-primary"
                onClick={() => setSelectedRoute(route)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoute && (
        <RouteDetailModal
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}
    </motion.div>
  );
};

const RouteDetailModal = ({ route, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <motion.div
      className="modal-content"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>Route Details #{route.id}</h2>

      <div style={{ margin: "2rem 0" }}>
        <h3>Route Information</h3>
        <p>
          <strong>From:</strong> {route.from}
        </p>
        <p>
          <strong>To:</strong> {route.to}
        </p>
        <p>
          <strong>Distance:</strong> {route.distance}
        </p>
        <p>
          <strong>Est. Duration:</strong> {route.duration}
        </p>
        <p>
          <strong>Shipments:</strong> {route.shipments.join(", ")}
        </p>

        <h3 style={{ marginTop: "1.5rem" }}>Stops</h3>
        {route.stops.map((stop, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <span>{index + 1}.</span>
            <span style={{ flex: 1 }}>{stop.location}</span>
            <span className={`status-badge ${stop.status}`}>{stop.status}</span>
          </div>
        ))}
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn-primary">Start Navigation</button>
      </div>
    </motion.div>
  </div>
);

export default RoutePlannerPage;
