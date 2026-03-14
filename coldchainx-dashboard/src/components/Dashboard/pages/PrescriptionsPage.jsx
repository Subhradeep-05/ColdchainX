import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  Calendar,
  Pill,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Package,
} from "lucide-react";
import "./Pages.css";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patient: "John Smith",
      patientId: "PT-001",
      age: 45,
      medicine: "Paracetamol 500mg",
      dosage: "1 tablet every 6 hours",
      quantity: 30,
      refills: 2,
      doctor: "Dr. Williams",
      prescribedDate: "2024-03-15",
      expiryDate: "2024-06-15",
      status: "active",
      type: "regular",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      patientId: "PT-002",
      age: 32,
      medicine: "Amoxicillin 250mg",
      dosage: "2 tablets twice daily",
      quantity: 20,
      refills: 1,
      doctor: "Dr. Chen",
      prescribedDate: "2024-03-14",
      expiryDate: "2024-04-14",
      status: "active",
      type: "antibiotic",
    },
    {
      id: 3,
      patient: "Mike Wilson",
      patientId: "PT-003",
      age: 58,
      medicine: "Insulin 100IU",
      dosage: "10 units before meals",
      quantity: 5,
      refills: 3,
      doctor: "Dr. Patel",
      prescribedDate: "2024-03-10",
      expiryDate: "2024-04-10",
      status: "active",
      type: "chronic",
    },
    {
      id: 4,
      patient: "Emily Brown",
      patientId: "PT-004",
      age: 27,
      medicine: "Ibuprofen 400mg",
      dosage: "1 tablet as needed",
      quantity: 20,
      refills: 0,
      doctor: "Dr. Garcia",
      prescribedDate: "2024-03-01",
      expiryDate: "2024-03-01",
      status: "expired",
      type: "regular",
    },
    {
      id: 5,
      patient: "Robert Davis",
      patientId: "PT-005",
      age: 52,
      medicine: "Lisinopril 10mg",
      dosage: "1 tablet daily",
      quantity: 30,
      refills: 5,
      doctor: "Dr. Williams",
      prescribedDate: "2024-02-28",
      expiryDate: "2024-05-28",
      status: "active",
      type: "chronic",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const stats = {
    active: prescriptions.filter((p) => p.status === "active").length,
    expired: prescriptions.filter((p) => p.status === "expired").length,
    chronic: prescriptions.filter((p) => p.type === "chronic").length,
    totalRefills: prescriptions.reduce((acc, p) => acc + p.refills, 0),
  };

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      (filter === "all" || p.status === filter || p.type === filter) &&
      (p.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Prescriptions</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          New Prescription
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active</div>
            <div className="stat-value">{stats.active}</div>
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
            <div className="stat-label">Expired</div>
            <div className="stat-value">{stats.expired}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(155, 89, 182, 0.1)", color: "#9b59b6" }}
          >
            <Pill size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Chronic</div>
            <div className="stat-value">{stats.chronic}</div>
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
            <div className="stat-label">Total Refills</div>
            <div className="stat-value">{stats.totalRefills}</div>
          </div>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by patient, medicine, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter
            size={18}
            style={{ color: "var(--taupe)", marginLeft: "0.5rem" }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "2px solid var(--nude-200)",
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="chronic">Chronic</option>
            <option value="regular">Regular</option>
            <option value="antibiotic">Antibiotic</option>
          </select>
        </div>
      </div>

      <div className="cards-grid">
        {filteredPrescriptions.map((p) => (
          <div key={p.id} className={`info-card ${p.status}`}>
            <div className="card-header">
              <div>
                <h3>{p.patient}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--taupe)" }}>
                  {p.patientId}
                </p>
              </div>
              <span className={`status-badge ${p.status}`}>{p.status}</span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <Pill size={14} className="detail-label" />
                <span>
                  <strong>{p.medicine}</strong>
                </span>
              </div>
              <div className="detail-row">
                <User size={14} className="detail-label" />
                <span>{p.doctor}</span>
              </div>
              <div className="detail-row">
                <Calendar size={14} className="detail-label" />
                <span>
                  Prescribed: {new Date(p.prescribedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <Clock size={14} className="detail-label" />
                <span>
                  Expires: {new Date(p.expiryDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <Package size={14} className="detail-label" />
                <span>
                  {p.dosage} - {p.quantity} units
                </span>
              </div>
              <div className="detail-row">
                <CheckCircle size={14} className="detail-label" />
                <span>Refills left: {p.refills}</span>
              </div>
            </div>

            <div className="card-footer">
              <button className="btn-secondary">View Details</button>
              {p.status === "active" && (
                <button className="btn-primary">Refill</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <PrescriptionModal onClose={() => setShowAddModal(false)} />
      )}
    </motion.div>
  );
};

const PrescriptionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    medicine: "",
    dosage: "",
    quantity: "",
    refills: "0",
    doctor: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New prescription:", formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <h2>New Prescription</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                placeholder="Enter patient ID"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Medicine</label>
              <input
                type="text"
                value={formData.medicine}
                onChange={(e) =>
                  setFormData({ ...formData, medicine: e.target.value })
                }
                placeholder="Medicine name"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Dosage Instructions</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                placeholder="e.g., 1 tablet every 6 hours"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Quantity"
                required
              />
            </div>

            <div className="form-group">
              <label>Refills</label>
              <input
                type="number"
                value={formData.refills}
                onChange={(e) =>
                  setFormData({ ...formData, refills: e.target.value })
                }
                placeholder="Number of refills"
              />
            </div>

            <div className="form-group full-width">
              <label>Prescribing Doctor</label>
              <input
                type="text"
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                placeholder="Doctor's name"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Additional Notes</label>
              <textarea
                rows="3"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Prescription
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PrescriptionsPage;
