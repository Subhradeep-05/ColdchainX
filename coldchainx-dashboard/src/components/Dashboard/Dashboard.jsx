import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import ProfileDetails from "./Profile/ProfileDetails";
import ShipmentTracker from "../ShipmentTracker";
import CarbonFootprint from "../CarbonFootprint";
import WalletSection from "../WalletSection";
import AIIntegration from "../AIIntegration";
import ShipmentList from "../ShipmentList";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dashboard-content"
          >
            <div className="welcome-section">
              <h1>Welcome back, {user?.fullName || user?.name}! 👋</h1>
              <p className="role-badge">{user?.role}</p>
            </div>

            <div className="metrics-grid">
              <MetricsCard
                title="Active Shipments"
                value="156"
                change="+12"
                icon="Package"
              />
              <MetricsCard
                title="Temperature Alerts"
                value="3"
                change="-2"
                icon="Thermometer"
                warning
              />
              <MetricsCard
                title="Carbon Offset"
                value="245"
                unit="tons"
                change="+18"
                icon="Leaf"
              />
              <MetricsCard
                title="Blockchain Transactions"
                value="1,892"
                change="+342"
                icon="Wallet"
              />
            </div>

            <div className="tracker-grid">
              <ShipmentTracker />
              <CarbonFootprint />
            </div>

            <div className="features-grid">
              <WalletSection />
              <AIIntegration />
            </div>

            <ShipmentList />
          </motion.div>
        );

      case "shipments":
        return (
          <motion.div
            key="shipments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-content"
          >
            <h2>Shipments Management</h2>
            <ShipmentList detailed />
          </motion.div>
        );

      case "carbon":
        return (
          <motion.div
            key="carbon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-content"
          >
            <h2>Carbon Footprint Analytics</h2>
            <CarbonFootprint detailed />
          </motion.div>
        );

      case "wallet":
        return (
          <motion.div
            key="wallet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-content"
          >
            <h2>Wallet & Transactions</h2>
            <WalletSection detailed />
          </motion.div>
        );

      case "ai":
        return (
          <motion.div
            key="ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-content"
          >
            <h2>AI Insights & Predictions</h2>
            <AIIntegration detailed />
          </motion.div>
        );

      case "profile":
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="page-content"
          >
            <ProfileDetails user={user} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div
        className={`dashboard-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <DashboardNavbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        <div className="dashboard-container">{renderContent()}</div>
      </div>
    </div>
  );
};

// Reusing your existing MetricsCard
const MetricsCard = ({ title, value, change, unit, icon, warning }) => {
  const IconComponent = require("lucide-react")[icon];

  return (
    <motion.div
      className={`metrics-card ${warning ? "warning" : ""}`}
      whileHover={{ y: -5 }}
    >
      <div className="card-header">
        <div className="card-icon">
          <IconComponent size={24} />
        </div>
        <span
          className={`card-change ${change.startsWith("+") ? "positive" : "negative"}`}
        >
          {change}
        </span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value">
          {value}
          {unit && <span className="card-unit">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
