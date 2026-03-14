import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  TrendingDown,
  Award,
  Calendar,
  Truck,
  Factory,
  BarChart3,
} from "lucide-react";
import "./Pages.css";

const CarbonFootprintPage = () => {
  const [timeframe, setTimeframe] = useState("month");

  const emissionsData = {
    total: 245,
    breakdown: [
      { category: "Transport", value: 156, color: "#3498db" },
      { category: "Storage", value: 89, color: "#f39c12" },
    ],
    history: [
      { month: "Jan", value: 210 },
      { month: "Feb", value: 225 },
      { month: "Mar", value: 240 },
      { month: "Apr", value: 235 },
      { month: "May", value: 245 },
      { month: "Jun", value: 230 },
    ],
    credits: [
      {
        id: 1,
        amount: 50,
        date: "2024-03-15",
        project: "Reforestation Initiative",
      },
      { id: 2, amount: 30, date: "2024-03-10", project: "Solar Energy" },
      { id: 3, amount: 25, date: "2024-03-05", project: "Efficient Vehicles" },
    ],
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Carbon Footprint Analytics</h1>
        <div className="timeframe-selector">
          <button
            className={`timeframe-btn ${timeframe === "week" ? "active" : ""}`}
            onClick={() => setTimeframe("week")}
          >
            Week
          </button>
          <button
            className={`timeframe-btn ${timeframe === "month" ? "active" : ""}`}
            onClick={() => setTimeframe("month")}
          >
            Month
          </button>
          <button
            className={`timeframe-btn ${timeframe === "year" ? "active" : ""}`}
            onClick={() => setTimeframe("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <Leaf size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Emissions</div>
            <div className="stat-value">
              {emissionsData.total} <small>tons</small>
            </div>
            <div className="stat-trend negative">↑ 2% vs last month</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Reduction Target</div>
            <div className="stat-value">18%</div>
            <div className="stat-trend positive">On track</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Credits Earned</div>
            <div className="stat-value">124</div>
            <div className="stat-trend">+15 this month</div>
          </div>
        </div>
      </div>

      <div className="temp-monitor-grid">
        <div className="form-container" style={{ maxWidth: "100%" }}>
          <h2 className="form-title">Emissions Breakdown</h2>
          {emissionsData.breakdown.map((item) => (
            <div
              key={item.category}
              className="progress-item"
              style={{ marginBottom: "1.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>{item.category}</span>
                <span>{item.value} tons</span>
              </div>
              <div
                className="progress-bar"
                style={{
                  height: "8px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${(item.value / emissionsData.total) * 100}%`,
                    background: item.color,
                    height: "100%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-container" style={{ maxWidth: "100%" }}>
          <h2 className="form-title">Monthly Trend</h2>
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
            {emissionsData.history.map((data) => (
              <div
                key={data.month}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  className="bar"
                  style={{
                    height: `${(data.value / 300) * 150}px`,
                    width: "100%",
                    background:
                      "linear-gradient(135deg, var(--nude-500), var(--nude-600))",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                <span
                  style={{
                    marginTop: "0.5rem",
                    color: "var(--taupe)",
                    fontSize: "0.8rem",
                  }}
                >
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <h2>
          <Award size={20} /> Carbon Credit History
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emissionsData.credits.map((credit) => (
              <tr key={credit.id}>
                <td>{new Date(credit.date).toLocaleDateString()}</td>
                <td>{credit.project}</td>
                <td>
                  <strong>{credit.amount} credits</strong>
                </td>
                <td>
                  <span className="status-badge completed">Verified</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CarbonFootprintPage;
