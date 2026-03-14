import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "./Pages.css";

const RequestSuppliesPage = () => {
  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [requestDetails, setRequestDetails] = useState({
    urgency: "normal",
    notes: "",
    deliveryDate: "",
  });

  const inventory = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      stock: 500,
      unit: "tablets",
      manufacturer: "PharmaCorp",
    },
    {
      id: 2,
      name: "Insulin 100IU",
      stock: 50,
      unit: "vials",
      manufacturer: "MediLife",
    },
    {
      id: 3,
      name: "Amoxicillin 250mg",
      stock: 200,
      unit: "capsules",
      manufacturer: "HealthPharma",
    },
    {
      id: 4,
      name: "COVID-19 Vaccine",
      stock: 30,
      unit: "doses",
      manufacturer: "VaxCorp",
    },
    {
      id: 5,
      name: "Ibuprofen 400mg",
      stock: 300,
      unit: "tablets",
      manufacturer: "PharmaCorp",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addToRequest = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 100 } : i,
        );
      }
      return [...prev, { ...item, quantity: 100 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setSelectedItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromRequest = (id) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const submitRequest = () => {
    console.log("Submitting request:", {
      items: selectedItems,
      ...requestDetails,
    });
    // API call here
    setStep(3);
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Request Supplies</h1>
        <div
          className="progress-steps"
          style={{ display: "flex", gap: "2rem" }}
        >
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            1. Select Items
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            2. Confirm Request
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            3. Submitted
          </div>
        </div>
      </div>

      {step === 1 && (
        <motion.div
          className="form-container"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <div className="search-section" style={{ marginBottom: "2rem" }}>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="cards-grid">
            {filteredInventory.map((item) => (
              <div key={item.id} className="info-card">
                <div className="card-header">
                  <h3>{item.name}</h3>
                  <span
                    className={`card-badge ${item.stock < 100 ? "high" : "low"}`}
                  >
                    Stock: {item.stock}
                  </span>
                </div>

                <div className="card-details">
                  <p>Manufacturer: {item.manufacturer}</p>
                  <p>Unit: {item.unit}</p>
                </div>

                <div className="card-footer">
                  <button
                    className="btn-primary"
                    onClick={() => addToRequest(item)}
                  >
                    <Plus size={16} />
                    Add to Request
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h3>Selected Items ({selectedItems.length})</h3>
              <div style={{ marginTop: "1rem" }}>
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                      padding: "0.5rem",
                      background: "var(--nude-50)",
                      borderRadius: "8px",
                    }}
                  >
                    <span style={{ flex: 2 }}>{item.name}</span>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      style={{ width: "100px", padding: "0.25rem" }}
                      min="0"
                      step="100"
                    />
                    <span>{item.unit}</span>
                    <button
                      onClick={() => removeFromRequest(item.id)}
                      style={{
                        color: "#e74c3c",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn-primary"
              disabled={selectedItems.length === 0}
              onClick={() => setStep(2)}
            >
              Next: Confirm Request
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          className="form-container"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <h2 className="form-title">Confirm Request</h2>

          <div style={{ marginBottom: "2rem" }}>
            <h3>Requested Items</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-group">
            <label>Urgency Level</label>
            <select
              value={requestDetails.urgency}
              onChange={(e) =>
                setRequestDetails({
                  ...requestDetails,
                  urgency: e.target.value,
                })
              }
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Delivery Date</label>
            <input
              type="date"
              value={requestDetails.deliveryDate}
              onChange={(e) =>
                setRequestDetails({
                  ...requestDetails,
                  deliveryDate: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              rows="3"
              value={requestDetails.notes}
              onChange={(e) =>
                setRequestDetails({ ...requestDetails, notes: e.target.value })
              }
              placeholder="Any special requirements or notes..."
            />
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn-primary" onClick={submitRequest}>
              <Send size={16} />
              Submit Request
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          className="form-container"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <CheckCircle
              size={64}
              style={{ color: "#27ae60", marginBottom: "1rem" }}
            />
            <h2>Request Submitted Successfully!</h2>
            <p>Your supply request has been sent to distributors.</p>
            <p style={{ marginTop: "1rem", color: "var(--taupe)" }}>
              Request ID: REQ-{Date.now().toString().slice(-8)}
            </p>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setStep(1);
                setSelectedItems([]);
                setRequestDetails({
                  urgency: "normal",
                  notes: "",
                  deliveryDate: "",
                });
              }}
            >
              Create Another Request
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RequestSuppliesPage;
