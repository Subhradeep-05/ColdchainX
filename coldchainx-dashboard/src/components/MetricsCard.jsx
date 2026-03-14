import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import "./MetricsCard.css";

const MetricsCard = ({ title, value, unit = "", change, icon, warning }) => {
  const IconComponent = Icons[icon];

  return (
    <motion.div
      className={`metrics-card ${warning ? "warning" : ""}`}
      whileHover={{ y: -5, boxShadow: "var(--shadow-xl)" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-header">
        <div className="card-icon">
          <IconComponent size={24} />
        </div>
        <span
          className={`card-change ${change.startsWith("+") ? "positive" : "negative"}`}
        >
          {change}
        </span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value">
          {value}
          {unit && <span className="card-unit">{unit}</span>}
        </div>
      </div>

      <div className="card-footer">
        <span className="trend-indicator">vs last month</span>
      </div>

      <div className="card-shine"></div>
    </motion.div>
  );
};

export default MetricsCard;
