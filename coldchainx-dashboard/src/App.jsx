import React, { useState } from "react";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import { NotificationProvider } from "./components/context/NotificationContext";
import { WalletProvider } from "./components/context/WalletContext"; // Fixed path
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import MetricsCard from "./components/MetricsCard";
import ShipmentTracker from "./components/ShipmentTracker";
import CarbonFootprint from "./components/CarbonFootprint";
import WalletSection from "./components/WalletSection";
import AIIntegration from "./components/AIIntegration";
import ShipmentList from "./components/ShipmentList";
import Footer from "./components/Footer";
import AuthModal from "./components/Auth/AuthModal";
import DashboardRouter from "./components/DashboardRouter"; // Note: changed from DashboardLayout
import "./App.css";

const roles = [
  { id: "shipment", name: "Shipment Provider" },
  { id: "distributor", name: "Distributor" },
  { id: "hospital", name: "Hospital" },
  { id: "pharmacy", name: "Pharmacy" },
];

const Dashboard = () => {
  const { user, role, logout, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <Layout>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  // If user is authenticated, show the dashboard router
  if (user) {
    return <DashboardRouter />; // Using DashboardRouter, not DashboardLayout
  }

  // If not authenticated, show the public landing page
  return (
    <>
      <Layout>
        <div className="login-prompt">
          <div className="container">
            <div className="prompt-content">
              <p>
                ✨ Connect to access all features • Track shipments • Monitor
                carbon • Blockchain transactions
              </p>
              <button
                className="prompt-login-btn"
                onClick={() => setShowAuthModal(true)}
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        </div>

        <Hero />

        <section className="metrics-section">
          <div className="container">
            <motion.div
              className="metrics-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
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
            </motion.div>
          </div>
        </section>

        <section className="tracker-section">
          <div className="container">
            <div className="tracker-grid">
              <ShipmentTracker />
              <CarbonFootprint />
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              <WalletSection />
              <AIIntegration />
            </div>
          </div>
        </section>

        <section className="shipments-section">
          <div className="container">
            <ShipmentList />
          </div>
        </section>

        <Footer />
      </Layout>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WalletProvider>
          {" "}
          {/* ← This now properly wraps Dashboard */}
          <Dashboard />
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
