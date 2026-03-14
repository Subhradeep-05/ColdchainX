import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  AlertCircle,
  CheckCircle,
  TrendingDown,
  Search,
  Filter,
} from "lucide-react";
import "./Pages.css";

const InventoryPage = () => {
  const [filter, setFilter] = useState("all");

  const inventory = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      batch: "BATCH001",
      quantity: 5000,
      expiry: "2025-12-31",
      location: "Warehouse A",
      status: "good",
    },
    {
      id: 2,
      name: "Insulin 100IU",
      batch: "BATCH002",
      quantity: 200,
      expiry: "2024-06-30",
      location: "Cold Storage",
      status: "low",
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      batch: "BATCH003",
      quantity: 1200,
      expiry: "2025-03-15",
      location: "Warehouse B",
      status: "good",
    },
    {
      id: 4,
      name: "Vaccine - COVID-19",
      batch: "BATCH004",
      quantity: 50,
      expiry: "2024-05-01",
      location: "Cold Storage",
      status: "critical",
    },
    {
      id: 5,
      name: "Ibuprofen 400mg",
      batch: "BATCH005",
      quantity: 3000,
      expiry: "2026-01-20",
      location: "Warehouse A",
      status: "good",
    },
  ];

  const stats = {
    totalItems: inventory.reduce((acc, item) => acc + item.quantity, 0),
    totalBatches: inventory.length,
    lowStock: inventory.filter((i) => i.status === "low").length,
    critical: inventory.filter((i) => i.status === "critical").length,
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Inventory Management</h1>
        <div className="search-box" style={{ width: "300px" }}>
          <Search size={18} />
          <input type="text" placeholder="Search inventory..." />
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
            <div className="stat-value">
              {stats.totalItems.toLocaleString()}
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
            <div className="stat-label">Total Batches</div>
            <div className="stat-value">{stats.totalBatches}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Low Stock</div>
            <div className="stat-value">{stats.lowStock}</div>
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
            <div className="stat-label">Critical</div>
            <div className="stat-value">{stats.critical}</div>
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
          <h2>Current Inventory</h2>
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
              className={`btn-secondary ${filter === "critical" ? "active" : ""}`}
              onClick={() => setFilter("critical")}
            >
              Critical
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Batch</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory
              .filter((item) => filter === "all" || item.status === filter)
              .map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>{item.batch}</td>
                  <td>{item.quantity.toLocaleString()}</td>
                  <td>{new Date(item.expiry).toLocaleDateString()}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === "good"
                        ? "Good"
                        : item.status === "low"
                          ? "Low Stock"
                          : "Critical"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default InventoryPage;
