import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Package,
  FileText,
  User,
  AlertCircle,
} from "lucide-react";
import "./Modals.css";

const CreateShipmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    batchNumber: "",
    expiryDate: "",
    quantity: "",
    receiverAddress: "",
    estimatedDelivery: "",
    storageRequirements: "2-8°C",
    specialInstructions: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.medicineName)
      newErrors.medicineName = "Medicine name is required";
    if (!formData.batchNumber)
      newErrors.batchNumber = "Batch number is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (!formData.receiverAddress)
      newErrors.receiverAddress = "Receiver address is required";
    if (!formData.estimatedDelivery)
      newErrors.estimatedDelivery = "Estimated delivery is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
            className="modal create-shipment-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h2>Create New Shipment</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section">
                <h3>Medicine Details</h3>

                <div className="form-group">
                  <label>
                    <Package size={16} />
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleChange}
                    placeholder="e.g., Paracetamol 500mg"
                    className={errors.medicineName ? "error" : ""}
                  />
                  {errors.medicineName && (
                    <span className="error-message">
                      <AlertCircle size={12} />
                      {errors.medicineName}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FileText size={16} />
                      Batch Number *
                    </label>
                    <input
                      type="text"
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      placeholder="BATCH-001"
                      className={errors.batchNumber ? "error" : ""}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Calendar size={16} />
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={errors.expiryDate ? "error" : ""}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1000"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Receiver Details</h3>

                <div className="form-group">
                  <label>
                    <User size={16} />
                    Receiver Address *
                  </label>
                  <input
                    type="text"
                    name="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    className={errors.receiverAddress ? "error" : ""}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    Estimated Delivery *
                  </label>
                  <input
                    type="datetime-local"
                    name="estimatedDelivery"
                    value={formData.estimatedDelivery}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>

                <div className="form-group">
                  <label>Storage Requirements</label>
                  <select
                    name="storageRequirements"
                    value={formData.storageRequirements}
                    onChange={handleChange}
                  >
                    <option value="2-8°C">2-8°C (Refrigerated)</option>
                    <option value="15-25°C">15-25°C (Room Temperature)</option>
                    <option value="-20°C">-20°C (Frozen)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Instructions</label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="Any special handling instructions..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Shipment
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateShipmentModal;
