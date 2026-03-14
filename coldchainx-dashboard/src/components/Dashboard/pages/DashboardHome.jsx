import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Thermometer,
  Leaf,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react";
import { useAuth } from "../../../components/context/AuthContext";
import ShipmentTracker from "../../ShipmentTracker";
import CarbonFootprint from "../../CarbonFootprint";
import WalletSection from "../../WalletSection";
import AIIntegration from "../../AIIntegration";
import ShipmentList from "../../ShipmentList";
import "./Pages.css";

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeShipments: 24,
    pendingDeliveries: 8,
    temperatureAlerts: 2,
    monthlySavings: "12.5",
  });

  const activities = [
    {
      id: 1,
      action: "Shipment #1234 delivered",
      time: "5 min ago",
      status: "completed",
    },
    {
      id: 2,
      action: "Temperature alert for Shipment #567",
      time: "15 min ago",
      status: "warning",
    },
    {
      id: 3,
      action: "New shipment created",
      time: "1 hour ago",
      status: "info",
    },
    {
      id: 4,
      action: "Carbon credit earned",
      time: "3 hours ago",
      status: "success",
    },
  ];

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.fullName || user?.name}!</h1>
          <p>Here's what's happening with your supply chain today</p>
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
            <div className="stat-label">Active Shipments</div>
            <div className="stat-value">{stats.activeShipments}</div>
            <div className="stat-trend positive">↑ 12% from yesterday</div>
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
            <div className="stat-label">Pending Deliveries</div>
            <div className="stat-value">{stats.pendingDeliveries}</div>
            <div className="stat-trend">8 awaiting pickup</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <Thermometer size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Temperature Alerts</div>
            <div className="stat-value">{stats.temperatureAlerts}</div>
            <div className="stat-trend negative">2 critical alerts</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <Leaf size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Carbon Saved (tons)</div>
            <div className="stat-value">{stats.monthlySavings}</div>
            <div className="stat-trend positive">↓ 5% this month</div>
          </div>
        </div>
      </div>

      <div className="tracker-grid" style={{ marginBottom: "2rem" }}>
        <ShipmentTracker />
        <CarbonFootprint />
      </div>

      <div className="features-grid" style={{ marginBottom: "2rem" }}>
        <WalletSection />
        <AIIntegration />
      </div>

      <div className="table-container">
        <h2>
          <Activity size={20} /> Recent Activity
        </h2>
        <div className="activity-list">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`activity-item ${activity.status}`}
            >
              {activity.status === "completed" && <CheckCircle size={16} />}
              {activity.status === "warning" && <AlertCircle size={16} />}
              {activity.status === "info" && <Package size={16} />}
              {activity.status === "success" && <TrendingUp size={16} />}
              <span className="activity-text">{activity.action}</span>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHome;
