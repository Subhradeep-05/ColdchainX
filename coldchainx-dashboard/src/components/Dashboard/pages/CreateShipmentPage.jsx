import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  Truck,
  Calendar,
  Thermometer,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import "./Pages.css";

const CreateShipmentPage = () => {
  console.log("🔥 CreateShipmentPage component is rendering!");
  console.log("📦 Component loaded at:", new Date().toLocaleTimeString());

  const [step, setStep] = useState(1);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [shipmentDetails, setShipmentDetails] = useState({
    quantity: "",
    batchNumber: "",
    expiryDate: "",
    storageTemp: "",
    destinationType: "hospital",
    destinationId: "",
    specialInstructions: "",
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🔄 CreateShipmentPage useEffect triggered");
    console.log("Current step:", step);
  }, [step]);

  useEffect(() => {
    if (shipmentDetails.destinationType) {
      loadDestinations();
    }
  }, [shipmentDetails.destinationType]);

  const loadDestinations = async () => {
    console.log(
      "📡 Loading destinations for type:",
      shipmentDetails.destinationType,
    );
    try {
      const response = await api.getUsersByRole(
        shipmentDetails.destinationType,
      );
      if (response.success) {
        console.log("✅ Destinations loaded:", response.users);
        setDestinations(response.users);
      }
    } catch (error) {
      console.error("Error loading destinations:", error);
    }
  };

  const searchMedicines = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    console.log("🔍 Searching medicines for:", searchQuery);
    try {
      const response = await api.searchMedicines(searchQuery);
      if (response.success) {
        console.log("✅ Search results:", response.medicines);
        setSearchResults(response.medicines);
      }
    } catch (error) {
      console.error("Error searching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    console.log("📦 Creating shipment with data:", {
      medicineId: selectedMedicine._id,
      medicineName: selectedMedicine.name,
      ...shipmentDetails,
    });
    try {
      const shipmentData = {
        medicineId: selectedMedicine._id,
        medicineName: selectedMedicine.name,
        ...shipmentDetails,
      };

      const response = await api.createShipment(shipmentData);
      if (response.success) {
        console.log("✅ Shipment created successfully:", response.shipment);
        socketService.emit("new_shipment_created", response.shipment);
        // Reset form
        setStep(1);
        setSelectedMedicine(null);
        setShipmentDetails({
          quantity: "",
          batchNumber: "",
          expiryDate: "",
          storageTemp: "",
          destinationType: "hospital",
          destinationId: "",
          specialInstructions: "",
        });
        alert("Shipment created successfully!");
      }
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Create New Shipment</h1>
        <div
          className="progress-steps"
          style={{ display: "flex", gap: "2rem" }}
        >
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            1. Select Medicine
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            2. Shipment Details
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            3. Review & Create
          </div>
        </div>
      </div>

      {step === 1 && (
        <motion.div
          className="form-container"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <h2 className="form-title">Search Medicine</h2>

          <div className="search-section" style={{ marginBottom: "2rem" }}>
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter medicine name, generic name, or manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMedicines()}
              />
              <button onClick={searchMedicines} disabled={loading}>
                <Search size={18} />
                Search
              </button>
            </div>
          </div>

          <div className="cards-grid">
            {searchResults.map((medicine) => (
              <div
                key={medicine._id}
                className={`info-card ${selectedMedicine?._id === medicine._id ? "selected" : ""}`}
                onClick={() => setSelectedMedicine(medicine)}
                style={{
                  cursor: "pointer",
                  border:
                    selectedMedicine?._id === medicine._id
                      ? "2px solid var(--nude-500)"
                      : "",
                }}
              >
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
                    <span className="detail-value">
                      {medicine.manufacturer}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Dosage Form</span>
                    <span className="detail-value">{medicine.dosageForm}</span>
                  </div>
                  {medicine.strength && (
                    <div className="detail-row">
                      <span className="detail-label">Strength</span>
                      <span className="detail-value">{medicine.strength}</span>
                    </div>
                  )}
                </div>

                {selectedMedicine?._id === medicine._id && (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      color: "var(--nude-600)",
                    }}
                  >
                    <CheckCircle size={20} /> Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              disabled={!selectedMedicine}
              onClick={() => setStep(2)}
            >
              Next: Shipment Details
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
          <h2 className="form-title">Shipment Details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                value={shipmentDetails.quantity}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    quantity: e.target.value,
                  })
                }
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="form-group">
              <label>Batch Number *</label>
              <input
                type="text"
                value={shipmentDetails.batchNumber}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    batchNumber: e.target.value,
                  })
                }
                placeholder="Enter batch number"
                required
              />
            </div>

            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                value={shipmentDetails.expiryDate}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    expiryDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Storage Temperature</label>
              <select
                value={shipmentDetails.storageTemp}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    storageTemp: e.target.value,
                  })
                }
              >
                <option value="2-8°C">2-8°C (Refrigerated)</option>
                <option value="15-25°C">15-25°C (Room Temperature)</option>
                <option value="-20°C">-20°C (Frozen)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Destination Type</label>
              <select
                value={shipmentDetails.destinationType}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    destinationType: e.target.value,
                  })
                }
              >
                <option value="hospital">Hospital</option>
                <option value="pharmacy">Pharmacy</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Select Destination</label>
              <select
                value={shipmentDetails.destinationId}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    destinationId: e.target.value,
                  })
                }
                required
              >
                <option value="">Choose destination...</option>
                {destinations.map((dest) => (
                  <option key={dest._id} value={dest._id}>
                    {dest.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Special Instructions</label>
              <textarea
                rows="3"
                value={shipmentDetails.specialInstructions}
                onChange={(e) =>
                  setShipmentDetails({
                    ...shipmentDetails,
                    specialInstructions: e.target.value,
                  })
                }
                placeholder="Any special handling instructions..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={
                !shipmentDetails.quantity ||
                !shipmentDetails.batchNumber ||
                !shipmentDetails.expiryDate ||
                !shipmentDetails.destinationId
              }
              onClick={() => setStep(3)}
            >
              Next: Review
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          className="form-container"
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <h2 className="form-title">Review Shipment</h2>

          <div className="review-section" style={{ marginBottom: "2rem" }}>
            <h3>Medicine Details</h3>
            <div className="detail-row">
              <strong>Name:</strong> {selectedMedicine?.name}
            </div>
            <div className="detail-row">
              <strong>Manufacturer:</strong> {selectedMedicine?.manufacturer}
            </div>
            <div className="detail-row">
              <strong>Storage:</strong> {shipmentDetails.storageTemp}
            </div>
          </div>

          <div className="review-section" style={{ marginBottom: "2rem" }}>
            <h3>Shipment Details</h3>
            <div className="detail-row">
              <strong>Quantity:</strong> {shipmentDetails.quantity}
            </div>
            <div className="detail-row">
              <strong>Batch Number:</strong> {shipmentDetails.batchNumber}
            </div>
            <div className="detail-row">
              <strong>Expiry Date:</strong>{" "}
              {new Date(shipmentDetails.expiryDate).toLocaleDateString()}
            </div>
          </div>

          <div className="review-section" style={{ marginBottom: "2rem" }}>
            <h3>Destination</h3>
            <div className="detail-row">
              <strong>Type:</strong> {shipmentDetails.destinationType}
            </div>
            <div className="detail-row">
              <strong>Destination:</strong>{" "}
              {
                destinations.find(
                  (d) => d._id === shipmentDetails.destinationId,
                )?.companyName
              }
            </div>
          </div>

          {shipmentDetails.specialInstructions && (
            <div className="review-section" style={{ marginBottom: "2rem" }}>
              <h3>Special Instructions</h3>
              <p>{shipmentDetails.specialInstructions}</p>
            </div>
          )}

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn-primary" onClick={handleCreateShipment}>
              Create Shipment
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CreateShipmentPage;
