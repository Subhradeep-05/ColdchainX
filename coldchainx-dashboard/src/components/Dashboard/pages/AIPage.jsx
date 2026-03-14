import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Zap,
  Shield,
  Calendar,
  Package,
  Truck,
  Leaf,
} from "lucide-react";
import "./Pages.css";

const AIPage = () => {
  const [selectedInsight, setSelectedInsight] = useState("demand");

  const insights = {
    demand: {
      title: "Demand Forecast",
      data: [
        {
          medicine: "Paracetamol",
          current: 5000,
          predicted: 6200,
          change: "+24%",
        },
        { medicine: "Insulin", current: 200, predicted: 280, change: "+40%" },
        {
          medicine: "Antibiotics",
          current: 1200,
          predicted: 1500,
          change: "+25%",
        },
        { medicine: "Vaccines", current: 300, predicted: 450, change: "+50%" },
      ],
    },
    route: {
      title: "Route Optimization",
      data: [
        {
          route: "Mumbai → Delhi",
          current: "4.5h",
          optimized: "3.2h",
          saving: "1.3h",
        },
        {
          route: "Chennai → Bangalore",
          current: "6h",
          optimized: "4.1h",
          saving: "1.9h",
        },
        {
          route: "Kolkata → Hyderabad",
          current: "8h",
          optimized: "5.8h",
          saving: "2.2h",
        },
      ],
    },
    carbon: {
      title: "Carbon Footprint Prediction",
      data: [
        { month: "Jan", actual: 210, predicted: 205 },
        { month: "Feb", actual: 225, predicted: 215 },
        { month: "Mar", actual: 240, predicted: 230 },
        { month: "Apr", actual: 235, predicted: 225 },
      ],
    },
    alerts: {
      title: "Risk Alerts",
      data: [
        {
          alert: "Temperature fluctuation predicted",
          severity: "high",
          date: "Today",
          location: "Mumbai-Delhi route",
        },
        {
          alert: "Supply shortage risk",
          severity: "medium",
          date: "Next week",
          location: "Chennai warehouse",
        },
        {
          alert: "Delay expected due to weather",
          severity: "low",
          date: "Tomorrow",
          location: "Kolkata region",
        },
      ],
    },
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>AI Insights & Predictions</h1>
      </div>

      <div
        className="insights-nav"
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className={`btn-${selectedInsight === "demand" ? "primary" : "secondary"}`}
          onClick={() => setSelectedInsight("demand")}
        >
          <TrendingUp size={16} />
          Demand Forecast
        </button>
        <button
          className={`btn-${selectedInsight === "route" ? "primary" : "secondary"}`}
          onClick={() => setSelectedInsight("route")}
        >
          <Truck size={16} />
          Route Optimization
        </button>
        <button
          className={`btn-${selectedInsight === "carbon" ? "primary" : "secondary"}`}
          onClick={() => setSelectedInsight("carbon")}
        >
          <Leaf size={16} />
          Carbon Prediction
        </button>
        <button
          className={`btn-${selectedInsight === "alerts" ? "primary" : "secondary"}`}
          onClick={() => setSelectedInsight("alerts")}
        >
          <AlertTriangle size={16} />
          Risk Alerts
        </button>
      </div>

      <motion.div
        key={selectedInsight}
        className="insight-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {selectedInsight === "demand" && (
          <div className="table-container">
            <h2>Demand Forecast - Next 30 Days</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Current Stock</th>
                  <th>Predicted Demand</th>
                  <th>Change</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {insights.demand.data.map((item) => (
                  <tr key={item.medicine}>
                    <td>{item.medicine}</td>
                    <td>{item.current}</td>
                    <td>
                      <strong>{item.predicted}</strong>
                    </td>
                    <td style={{ color: "#27ae60" }}>{item.change}</td>
                    <td>
                      <span className="status-badge high">
                        Order {item.predicted - item.current} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedInsight === "route" && (
          <div className="table-container">
            <h2>Route Optimization Suggestions</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Current Time</th>
                  <th>Optimized Time</th>
                  <th>Time Saved</th>
                  <th>Fuel Saved</th>
                </tr>
              </thead>
              <tbody>
                {insights.route.data.map((item) => (
                  <tr key={item.route}>
                    <td>{item.route}</td>
                    <td>{item.current}</td>
                    <td>
                      <strong>{item.optimized}</strong>
                    </td>
                    <td style={{ color: "#27ae60" }}>{item.saving}</td>
                    <td>~{parseInt(item.saving) * 5}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedInsight === "carbon" && (
          <div className="temp-monitor-grid">
            <div className="form-container">
              <h2>Carbon Footprint Prediction</h2>
              <div
                className="chart-container"
                style={{
                  height: "200px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                {insights.carbon.data.map((item) => (
                  <div
                    key={item.month}
                    style={{ flex: 1, textAlign: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: `${item.actual / 3}px`,
                          background: "var(--nude-500)",
                          opacity: 0.7,
                        }}
                      />
                      <div
                        style={{
                          width: "30px",
                          height: `${item.predicted / 3}px`,
                          background: "var(--nude-600)",
                        }}
                      />
                    </div>
                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                  marginTop: "1rem",
                }}
              >
                <span>
                  <span style={{ color: "var(--nude-500)" }}>■</span> Actual
                </span>
                <span>
                  <span style={{ color: "var(--nude-600)" }}>■</span> Predicted
                </span>
              </div>
            </div>

            <div className="info-card">
              <h3>Carbon Savings Potential</h3>
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <div style={{ fontSize: "3rem", color: "var(--nude-600)" }}>
                  18%
                </div>
                <p>Potential reduction with optimized routes</p>
                <div style={{ marginTop: "1rem" }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }} />
                  </div>
                  <p style={{ marginTop: "0.5rem" }}>65% of target achieved</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedInsight === "alerts" && (
          <div className="cards-grid">
            {insights.alerts.data.map((alert, index) => (
              <div key={index} className={`info-card ${alert.severity}`}>
                <div className="card-header">
                  <AlertTriangle
                    size={20}
                    style={{
                      color:
                        alert.severity === "high"
                          ? "#e74c3c"
                          : alert.severity === "medium"
                            ? "#f39c12"
                            : "#3498db",
                    }}
                  />
                  <h3>{alert.alert}</h3>
                </div>
                <div className="card-details">
                  <p>
                    <strong>Severity:</strong>{" "}
                    <span
                      style={{
                        color:
                          alert.severity === "high"
                            ? "#e74c3c"
                            : alert.severity === "medium"
                              ? "#f39c12"
                              : "#3498db",
                        textTransform: "uppercase",
                      }}
                    >
                      {alert.severity}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong> {alert.date}
                  </p>
                  <p>
                    <strong>Location:</strong> {alert.location}
                  </p>
                </div>
                <div className="card-footer">
                  <button className="btn-primary">Take Action</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AIPage;
