import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  AlertCircle,
  Thermometer,
  Calendar,
  Filter,
} from "lucide-react";
import "./Pages.css";

const MedicineInventoryPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const inventory = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      category: "Analgesic",
      stock: 5000,
      unit: "tablets",
      location: "Pharmacy A",
      expiry: "2025-12-31",
      storageTemp: "15-25°C",
      manufacturer: "PharmaCorp",
    },
    {
      id: 2,
      name: "Insulin 100IU",
      category: "Hormone",
      stock: 200,
      unit: "vials",
      location: "Cold Storage",
      expiry: "2024-06-30",
      storageTemp: "2-8°C",
      manufacturer: "MediLife",
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      stock: 1200,
      unit: "capsules",
      location: "Pharmacy B",
      expiry: "2025-03-15",
      storageTemp: "15-25°C",
      manufacturer: "HealthPharma",
    },
    {
      id: 4,
      name: "COVID-19 Vaccine",
      category: "Vaccine",
      stock: 50,
      unit: "doses",
      location: "Cold Storage",
      expiry: "2024-05-01",
      storageTemp: "-20°C",
      manufacturer: "VaxCorp",
    },
  ];

  const getStockStatus = (stock) => {
    if (stock < 100)
      return { status: "critical", color: "#e74c3c", text: "Critical" };
    if (stock < 500) return { status: "low", color: "#f39c12", text: "Low" };
    return { status: "good", color: "#27ae60", text: "Good" };
  };

  const getExpiryStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const monthsLeft = (expiry - now) / (1000 * 60 * 60 * 24 * 30);

    if (monthsLeft < 3)
      return { status: "expiring", color: "#e74c3c", text: "Expiring Soon" };
    if (monthsLeft < 6)
      return { status: "warning", color: "#f39c12", text: "Near Expiry" };
    return { status: "good", color: "#27ae60", text: "Good" };
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Medicine Inventory</h1>
        <div className="search-box" style={{ width: "300px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <div className="stat-value">6,450</div>
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
            <div className="stat-label">Low Stock</div>
            <div className="stat-value">4</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Expiring Soon</div>
            <div className="stat-value">6</div>
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
            <div className="stat-label">Cold Storage</div>
            <div className="stat-value">2</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2>Current Stock</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={`btn-secondary ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn-secondary ${filter === "low" ? "active" : ""}`}
              onClick={() => setFilter("low")}
            >
              Low Stock
            </button>
            <button
              className={`btn-secondary ${filter === "expiring" ? "active" : ""}`}
              onClick={() => setFilter("expiring")}
            >
              Expiring
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Location</th>
              <th>Expiry</th>
              <th>Storage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item.stock);
              const expiryStatus = getExpiryStatus(item.expiry);

              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                    <br />
                    <small>{item.manufacturer}</small>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span style={{ color: stockStatus.color }}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <span style={{ color: expiryStatus.color }}>
                      {new Date(item.expiry).toLocaleDateString()}
                    </span>
                  </td>
                  <td>{item.storageTemp}</td>
                  <td>
                    <span className={`status-badge ${stockStatus.status}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MedicineInventoryPage;
