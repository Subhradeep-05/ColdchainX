import React from "react";
import { motion } from "framer-motion";
import { Package, Truck, Building2, Pill, ArrowRight } from "lucide-react";
import "./RoleSelector.css";

const roles = [
  {
    id: "shipment",
    name: "Shipment Provider",
    icon: Package,
    description: "Manage medicine shipments and tracking",
    color: "var(--nude-500)",
    requirements: ["Shipping License", "Fleet Details", "Insurance"],
  },
  {
    id: "distributor",
    name: "Distributor",
    icon: Truck,
    description: "Distribute medicines to hospitals & pharmacies",
    color: "var(--nude-600)",
    requirements: [
      "Distribution License",
      "Warehouse Details",
      "Storage Capacity",
    ],
  },
  {
    id: "hospital",
    name: "Hospital",
    icon: Building2,
    description: "Receive and manage medicine inventory",
    color: "var(--nude-700)",
    requirements: ["Hospital Registration", "Pharmacy License", "Cold Storage"],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: Pill,
    description: "Dispense medicines to patients",
    color: "var(--nude-500)",
    requirements: [
      "Pharmacy License",
      "Storage Permit",
      "Qualified Pharmacist",
    ],
  },
];

const RoleSelector = ({ onSelect, selectedRole }) => {
  return (
    <div className="role-selector">
      <h2 className="selector-title">Choose Your Role</h2>
      <p className="selector-subtitle">
        Select the type of account you want to create
      </p>

      <div className="roles-grid">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              className={`role-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(role.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="role-icon"
                style={{ background: `${role.color}20`, color: role.color }}
              >
                <Icon size={32} />
              </div>

              <h3 className="role-name">{role.name}</h3>
              <p className="role-description">{role.description}</p>

              <div className="role-requirements">
                <span className="requirements-label">Requirements:</span>
                <ul className="requirements-list">
                  {role.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {isSelected && (
                <motion.div
                  className="selected-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
