import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Package, Calendar, Thermometer } from "lucide-react";
import api from "../../../services/api";
import "./Modals.css";

const MedicineSearchModal = ({
  isOpen,
  onClose,
  onSelect,
  onSubmit,
  selectedMedicine,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shipmentDetails, setShipmentDetails] = useState({
    quantity: "",
    batchNumber: "",
    expiryDate: "",
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.searchMedicines(searchQuery);
      if (response.success) {
        setSearchResults(response.medicines);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedicine = (medicine) => {
    onSelect(medicine);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = () => {
    onSubmit(shipmentDetails);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="modal medicine-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="modal-header">
              <h2>Create Shipment</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {!selectedMedicine ? (
                <>
                  <div className="search-section">
                    <h3>Search Medicine</h3>
                    <div className="search-box">
                      <input
                        type="text"
                        placeholder="Search by name, generic name, or manufacturer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <button onClick={handleSearch} disabled={loading}>
                        <Search size={18} />
                      </button>
                    </div>

                    {loading && <div className="loading">Searching...</div>}

                    <div className="search-results">
                      {searchResults.map((medicine) => (
                        <div
                          key={medicine._id}
                          className="medicine-item"
                          onClick={() => handleSelectMedicine(medicine)}
                        >
                          <Package size={20} />
                          <div className="medicine-info">
                            <h4>{medicine.name}</h4>
                            <p>{medicine.genericName}</p>
                            <small>Manufacturer: {medicine.manufacturer}</small>
                            <div className="medicine-tags">
                              <span className="tag">{medicine.dosageForm}</span>
                              {medicine.strength && (
                                <span className="tag">{medicine.strength}</span>
                              )}
                              <span
                                className={`tag storage ${medicine.storageTemp}`}
                              >
                                {medicine.storageTemp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="selected-medicine">
                    <h3>Selected Medicine</h3>
                    <div className="medicine-details">
                      <h4>{selectedMedicine.name}</h4>
                      <p>Manufacturer: {selectedMedicine.manufacturer}</p>
                      <p>Storage: {selectedMedicine.storageTemp}</p>
                    </div>
                  </div>

                  <div className="shipment-details-form">
                    <h3>Shipment Details</h3>

                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        placeholder="Enter quantity"
                        value={shipmentDetails.quantity}
                        onChange={(e) =>
                          setShipmentDetails({
                            ...shipmentDetails,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Batch Number *</label>
                      <input
                        type="text"
                        placeholder="Enter batch number"
                        value={shipmentDetails.batchNumber}
                        onChange={(e) =>
                          setShipmentDetails({
                            ...shipmentDetails,
                            batchNumber: e.target.value,
                          })
                        }
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
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="back-btn" onClick={() => onSelect(null)}>
                      Back
                    </button>
                    <button
                      className="submit-btn"
                      onClick={handleSubmit}
                      disabled={
                        !shipmentDetails.quantity ||
                        !shipmentDetails.batchNumber ||
                        !shipmentDetails.expiryDate
                      }
                    >
                      Create Shipment
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MedicineSearchModal;
