import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Thermometer,
  Pill,
  AlertCircle,
  CheckCircle,
  X,
  Save,
} from "lucide-react";
import api from "../../../services/api";
import "./Pages.css";

const MedicineCatalogPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      const response = await api.searchMedicines("");
      if (response.success) {
        setMedicines(response.medicines);
      }
    } catch (error) {
      console.error("Error loading medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(
    (med) =>
      med.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = [
    {
      label: "Total Medicines",
      value: medicines.length,
      icon: Package,
      color: "#3498db",
    },
    {
      label: "Low Stock",
      value: medicines.filter((m) => m.stock < 100).length,
      icon: AlertCircle,
      color: "#f39c12",
    },
    {
      label: "Expiring Soon",
      value: medicines.filter((m) => {
        const expiry = new Date(m.expiryDate);
        const now = new Date();
        const diff = expiry - now;
        return diff < 30 * 24 * 60 * 60 * 1000; // 30 days
      }).length,
      icon: AlertCircle,
      color: "#e74c3c",
    },
  ];

  const handleDelete = async (medicineId) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        // await api.deleteMedicine(medicineId);
        setMedicines(medicines.filter((m) => m._id !== medicineId));
      } catch (error) {
        console.error("Error deleting medicine:", error);
      }
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Medicine Catalog</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{ background: `${stat.color}20`, color: stat.color }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} style={{ color: "var(--taupe)" }} />
          <input
            type="text"
            placeholder="Search by medicine name, manufacturer, or generic name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="cards-grid">
        {filteredMedicines.map((medicine) => (
          <div key={medicine._id} className="info-card">
            <div className="card-header">
              <h3>{medicine.name}</h3>
              <span
                className={`card-badge ${medicine.storageTemp === "2-8°C" ? "medium" : "low"}`}
              >
                {medicine.storageTemp}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">Manufacturer</span>
                <span className="detail-value">{medicine.manufacturer}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Generic Name</span>
                <span className="detail-value">
                  {medicine.genericName || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dosage Form</span>
                <span className="detail-value">{medicine.dosageForm}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Strength</span>
                <span className="detail-value">
                  {medicine.strength || "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock</span>
                <span className="detail-value">
                  {medicine.stock || 0} units
                </span>
              </div>
              {medicine.expiryDate && (
                <div className="detail-row">
                  <span className="detail-label">Expiry</span>
                  <span className="detail-value">
                    {new Date(medicine.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="card-footer">
              <button
                className="card-btn"
                onClick={() => setSelectedMedicine(medicine)}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                className="card-btn"
                style={{ background: "#e74c3c" }}
                onClick={() => handleDelete(medicine._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <MedicineModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSave={loadMedicines}
        />
      )}

      {selectedMedicine && (
        <MedicineModal
          mode="edit"
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onSave={loadMedicines}
        />
      )}
    </motion.div>
  );
};

const MedicineModal = ({ mode, medicine, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    medicine || {
      name: "",
      genericName: "",
      manufacturer: "",
      category: "other",
      dosageForm: "tablet",
      strength: "",
      storageTemp: "15-25°C",
      requiresPrescription: true,
      stock: 0,
      expiryDate: "",
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (mode === "edit" && medicine) {
        // Update existing medicine
        response = await api.updateMedicine(medicine._id, formData);
        console.log("Update response:", response);
      } else {
        // Create new medicine
        response = await api.createMedicine(formData);
        console.log("Create response:", response);
      }

      if (response.success) {
        onSave(); // This reloads the list
        onClose();
      } else {
        alert("Error: " + (response.error || "Failed to save medicine"));
      }
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert("Error saving medicine: " + error.message);
    }
  };

  const categories = [
    "antibiotic",
    "analgesic",
    "antiviral",
    "vaccine",
    "insulin",
    "other",
  ];

  const dosageForms = [
    "tablet",
    "capsule",
    "injection",
    "syrup",
    "cream",
    "inhaler",
    "drops",
  ];

  const storageTemps = ["2-8°C", "15-25°C", "-20°C"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "700px" }}
      >
        <div className="modal-header">
          <h2>{mode === "edit" ? "Edit Medicine" : "Add New Medicine"}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Medicine Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>

            <div className="form-group">
              <label>Generic Name</label>
              <input
                type="text"
                value={formData.genericName}
                onChange={(e) =>
                  setFormData({ ...formData, genericName: e.target.value })
                }
                placeholder="e.g., Acetaminophen"
              />
            </div>

            <div className="form-group">
              <label>Manufacturer *</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) =>
                  setFormData({ ...formData, manufacturer: e.target.value })
                }
                placeholder="e.g., PharmaCorp"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dosage Form</label>
              <select
                value={formData.dosageForm}
                onChange={(e) =>
                  setFormData({ ...formData, dosageForm: e.target.value })
                }
              >
                {dosageForms.map((form) => (
                  <option key={form} value={form}>
                    {form.charAt(0).toUpperCase() + form.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Strength</label>
              <input
                type="text"
                value={formData.strength}
                onChange={(e) =>
                  setFormData({ ...formData, strength: e.target.value })
                }
                placeholder="e.g., 500mg"
              />
            </div>

            <div className="form-group">
              <label>Storage Temp</label>
              <select
                value={formData.storageTemp}
                onChange={(e) =>
                  setFormData({ ...formData, storageTemp: e.target.value })
                }
              >
                {storageTemps.map((temp) => (
                  <option key={temp} value={temp}>
                    {temp}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Initial Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label>Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={formData.requiresPrescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requiresPrescription: e.target.checked,
                  })
                }
              />
              Requires Prescription
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              {mode === "edit" ? "Update Medicine" : "Add Medicine"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MedicineCatalogPage;
