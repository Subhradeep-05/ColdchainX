import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Thermometer,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MedicineSearchModal from "../modals/MedicineSearchModal";
import api from "../../../services/api";
import "./RoleDashboard.css";

const DistributorDashboard = () => {
  const { user } = useAuth();
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await api.getMyShipments();
      if (response.success) {
        setShipments(response.shipments);
      }
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (shipmentData) => {
    try {
      const response = await api.createShipment({
        medicineDetails: selectedMedicine,
        ...shipmentData,
      });

      if (response.success) {
        setShowMedicineModal(false);
        loadShipments();
      }
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  const stats = [
    {
      title: "Total Shipments",
      value: shipments.length,
      icon: Package,
      color: "var(--nude-500)",
    },
    {
      title: "Pending",
      value: shipments.filter((s) => s.status === "pending_distributor").length,
      icon: Clock,
      color: "#f39c12",
    },
    {
      title: "In Transit",
      value: shipments.filter(
        (s) => s.status === "with_shipment" || s.status === "in_transit",
      ).length,
      icon: Package,
      color: "#3498db",
    },
    {
      title: "Delivered",
      value: shipments.filter((s) => s.status === "delivered").length,
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
          <h1>Distributor Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.companyName}</p>
        </div>
        <button
          className="create-btn"
          onClick={() => setShowMedicineModal(true)}
        >
          <Plus size={20} />
          <span>Create New Shipment</span>
        </button>
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

      <div className="shipments-section">
        <h2>Recent Shipments</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="shipments-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Shipment Provider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment._id}>
                    <td>#{shipment.shipmentId}</td>
                    <td>
                      <strong>{shipment.medicineName}</strong>
                      <br />
                      <small>Batch: {shipment.batchNumber}</small>
                    </td>
                    <td>{shipment.quantity}</td>
                    <td>
                      <span className={`status-badge ${shipment.status}`}>
                        {shipment.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{shipment.shipmentProviderId || "Not assigned"}</td>
                    <td>
                      <button className="action-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MedicineSearchModal
        isOpen={showMedicineModal}
        onClose={() => setShowMedicineModal(false)}
        onSelect={setSelectedMedicine}
        onSubmit={handleCreateShipment}
        selectedMedicine={selectedMedicine}
      />
    </motion.div>
  );
};

export default DistributorDashboard;
