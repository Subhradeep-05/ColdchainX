import React from "react";
import { motion } from "framer-motion";
import {
  Pill,
  FileText,
  Users,
  Package,
  Building2, // Add this!
  Thermometer,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PharmacyProfile = ({ user, isEditing }) => {
  return (
    <motion.div
      className="profile-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>Pharmacy Details</h3>

      <div className="info-grid">
        <div className="info-item">
          <FileText size={18} />
          <div>
            <span className="label">Pharmacist License</span>
            {isEditing ? (
              <input
                type="text"
                defaultValue={user?.pharmacistLicense}
                placeholder="License number"
              />
            ) : (
              <span className="value">
                {user?.pharmacistLicense || "PH-2024-001"}
              </span>
            )}
          </div>
        </div>

        <div className="info-item">
          <Building2 size={18} />
          <div>
            <span className="label">Pharmacy Type</span>
            {isEditing ? (
              <select defaultValue={user?.pharmacyType}>
                <option value="retail">Retail Pharmacy</option>
                <option value="hospital">Hospital Pharmacy</option>
                <option value="compounding">Compounding Pharmacy</option>
                <option value="online">Online Pharmacy</option>
              </select>
            ) : (
              <span className="value">{user?.pharmacyType || "Retail"}</span>
            )}
          </div>
        </div>

        <div className="info-item">
          <Users size={18} />
          <div>
            <span className="label">Staff Pharmacists</span>
            <span className="value">3 full-time</span>
          </div>
        </div>

        <div className="info-item">
          <Package size={18} />
          <div>
            <span className="label">Inventory SKUs</span>
            <span className="value">~2,500 items</span>
          </div>
        </div>

        <div className="info-item">
          <Thermometer size={18} />
          <div>
            <span className="label">Cold Storage</span>
            <span className="value">2 units (2-8°C)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PharmacyProfile;
