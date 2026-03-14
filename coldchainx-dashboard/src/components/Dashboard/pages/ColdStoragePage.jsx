import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  AlertCircle,
  CheckCircle,
  Package,
  Clock,
  Zap,
  Droplets,
} from "lucide-react";
import "./Pages.css";

const ColdStoragePage = () => {
  const [storageUnits, setStorageUnits] = useState([
    {
      id: 1,
      name: "Cold Room A",
      type: "Refrigerator",
      temperature: 4.2,
      humidity: 45,
      capacity: "500 units",
      occupied: 350,
      status: "normal",
      items: [
        {
          name: "Insulin",
          batch: "INS-001",
          quantity: 120,
          expiry: "2024-12-31",
        },
        {
          name: "Vaccine A",
          batch: "VAC-002",
          quantity: 80,
          expiry: "2024-11-15",
        },
        {
          name: "Vaccine B",
          batch: "VAC-003",
          quantity: 150,
          expiry: "2024-10-30",
        },
      ],
    },
    {
      id: 2,
      name: "Freezer B",
      type: "Freezer",
      temperature: -18.5,
      humidity: 30,
      capacity: "200 units",
      occupied: 120,
      status: "normal",
      items: [
        {
          name: "COVID Vaccine",
          batch: "CV-001",
          quantity: 50,
          expiry: "2024-09-30",
        },
        {
          name: "Specialty Drug",
          batch: "SP-002",
          quantity: 70,
          expiry: "2025-01-15",
        },
      ],
    },
    {
      id: 3,
      name: "Cold Room C",
      type: "Refrigerator",
      temperature: 7.8,
      humidity: 52,
      capacity: "300 units",
      occupied: 200,
      status: "warning",
      items: [
        {
          name: "Insulin",
          batch: "INS-002",
          quantity: 100,
          expiry: "2024-12-15",
        },
        {
          name: "Antibiotic",
          batch: "ANT-004",
          quantity: 100,
          expiry: "2024-11-30",
        },
      ],
    },
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      unit: "Cold Room C",
      message: "Temperature above recommended range",
      severity: "warning",
      time: "10 min ago",
    },
    {
      id: 2,
      unit: "Freezer B",
      message: "Door left open",
      severity: "critical",
      time: "25 min ago",
    },
  ]);

  useEffect(() => {
    // Simulate real-time temperature updates
    const interval = setInterval(() => {
      setStorageUnits((prev) =>
        prev.map((unit) => ({
          ...unit,
          temperature: unit.temperature + (Math.random() * 0.4 - 0.2),
          status:
            unit.temperature > 8
              ? "critical"
              : unit.temperature > 5
                ? "warning"
                : "normal",
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTemperatureStatus = (temp, type) => {
    if (type === "Freezer") {
      if (temp > -15)
        return { status: "critical", color: "#e74c3c", text: "Critical" };
      if (temp > -20)
        return { status: "warning", color: "#f39c12", text: "Warning" };
      return { status: "normal", color: "#27ae60", text: "Normal" };
    } else {
      if (temp > 8)
        return { status: "critical", color: "#e74c3c", text: "Critical" };
      if (temp > 5)
        return { status: "warning", color: "#f39c12", text: "Warning" };
      return { status: "normal", color: "#27ae60", text: "Normal" };
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Cold Storage Monitoring</h1>
        <div className="header-actions">
          <span
            className="status-badge"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <CheckCircle size={14} /> System Online
          </span>
        </div>
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
            <div className="stat-label">Total Items</div>
            <div className="stat-value">670</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <Thermometer size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Normal Units</div>
            <div className="stat-value">
              {storageUnits.filter((u) => u.status === "normal").length}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Warnings</div>
            <div className="stat-value">
              {storageUnits.filter((u) => u.status === "warning").length}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Critical</div>
            <div className="stat-value">
              {storageUnits.filter((u) => u.status === "critical").length}
            </div>
          </div>
        </div>
      </div>

      <div className="temp-monitor-grid">
        {storageUnits.map((unit) => {
          const tempStatus = getTemperatureStatus(unit.temperature, unit.type);
          return (
            <div key={unit.id} className={`temp-card ${tempStatus.status}`}>
              <div className="temp-header">
                <div>
                  <h3>{unit.name}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--taupe)" }}>
                    {unit.type}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="temp-value">
                    {unit.temperature.toFixed(1)}°C
                  </span>
                  <div style={{ fontSize: "0.8rem", color: tempStatus.color }}>
                    {tempStatus.text}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div>
                  <Droplets size={14} style={{ color: "var(--taupe)" }} />
                  <span style={{ marginLeft: "0.5rem" }}>
                    {unit.humidity}% RH
                  </span>
                </div>
                <div>
                  <Package size={14} style={{ color: "var(--taupe)" }} />
                  <span style={{ marginLeft: "0.5rem" }}>
                    {unit.occupied}/{unit.capacity}
                  </span>
                </div>
              </div>

              <div className="progress-bar" style={{ marginTop: "1rem" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${(unit.occupied / parseInt(unit.capacity)) * 100}%`,
                  }}
                />
              </div>

              <details style={{ marginTop: "1rem" }}>
                <summary
                  style={{ cursor: "pointer", color: "var(--nude-600)" }}
                >
                  View Items ({unit.items.length})
                </summary>
                <div style={{ marginTop: "0.5rem" }}>
                  {unit.items.map((item) => (
                    <div
                      key={item.batch}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem",
                        borderBottom: "1px solid var(--nude-200)",
                      }}
                    >
                      <span>
                        <strong>{item.name}</strong> - {item.batch}
                      </span>
                      <span>{item.quantity} units</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          );
        })}
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <h2>
          <AlertCircle size={20} /> Active Alerts
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Unit</th>
              <th>Alert</th>
              <th>Severity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.time}</td>
                <td>{alert.unit}</td>
                <td>{alert.message}</td>
                <td>
                  <span
                    className={`status-badge ${alert.severity === "critical" ? "rejected" : "pending"}`}
                  >
                    {alert.severity}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    Acknowledge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ColdStoragePage;
