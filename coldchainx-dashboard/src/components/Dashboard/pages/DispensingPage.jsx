import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Package,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Printer,
  Search,
} from "lucide-react";
import "./Pages.css";

const DispensingPage = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patient: "John Smith",
      age: 45,
      doctor: "Dr. Williams",
      medicine: "Paracetamol 500mg",
      dosage: "1 tablet every 6 hours",
      quantity: 30,
      status: "pending",
      prescribedDate: "2024-03-15",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      age: 32,
      doctor: "Dr. Chen",
      medicine: "Amoxicillin 250mg",
      dosage: "2 tablets twice daily",
      quantity: 20,
      status: "in-progress",
      prescribedDate: "2024-03-15",
    },
    {
      id: 3,
      patient: "Mike Wilson",
      age: 58,
      doctor: "Dr. Patel",
      medicine: "Insulin 100IU",
      dosage: "10 units before meals",
      quantity: 5,
      status: "pending",
      prescribedDate: "2024-03-14",
    },
    {
      id: 4,
      patient: "Emily Brown",
      age: 27,
      doctor: "Dr. Garcia",
      medicine: "Ibuprofen 400mg",
      dosage: "1 tablet as needed",
      quantity: 20,
      status: "completed",
      prescribedDate: "2024-03-14",
    },
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = {
    pending: prescriptions.filter((p) => p.status === "pending").length,
    inProgress: prescriptions.filter((p) => p.status === "in-progress").length,
    completed: prescriptions.filter((p) => p.status === "completed").length,
    total: prescriptions.length,
  };

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      (filter === "all" || p.status === filter) &&
      (p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicine.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleDispense = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const confirmDispense = () => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === selectedPrescription.id ? { ...p, status: "completed" } : p,
      ),
    );
    setSelectedPrescription(null);
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Dispensing</h1>
        <div className="search-box" style={{ width: "300px" }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search patient or medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <Pill size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Prescriptions</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(155, 89, 182, 0.1)", color: "#9b59b6" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
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
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
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
          <h2>Prescription Queue</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={`btn-secondary ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`btn-secondary ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`btn-secondary ${filter === "in-progress" ? "active" : ""}`}
              onClick={() => setFilter("in-progress")}
            >
              In Progress
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Quantity</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.patient}</strong>
                  <br />
                  <small>Age: {p.age}</small>
                </td>
                <td>{p.medicine}</td>
                <td>{p.dosage}</td>
                <td>{p.quantity}</td>
                <td>{p.doctor}</td>
                <td>
                  <span className={`status-badge ${p.status}`}>{p.status}</span>
                </td>
                <td>
                  {p.status !== "completed" && (
                    <button
                      className="btn-primary"
                      style={{ padding: "0.25rem 0.75rem" }}
                      onClick={() => handleDispense(p)}
                    >
                      Dispense
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPrescription && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPrescription(null)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirm Dispensing</h2>

            <div style={{ margin: "2rem 0" }}>
              <p>
                <strong>Patient:</strong> {selectedPrescription.patient}
              </p>
              <p>
                <strong>Medicine:</strong> {selectedPrescription.medicine}
              </p>
              <p>
                <strong>Dosage:</strong> {selectedPrescription.dosage}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedPrescription.quantity}
              </p>
              <p>
                <strong>Prescribed by:</strong> {selectedPrescription.doctor}
              </p>
            </div>

            <div className="form-actions">
              <button
                className="btn-secondary"
                onClick={() => setSelectedPrescription(null)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmDispense}>
                <CheckCircle size={16} />
                Confirm Dispense
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DispensingPage;
