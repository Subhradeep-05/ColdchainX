import React from "react";
import { motion } from "framer-motion";
import { Leaf, TrendingDown, Award } from "lucide-react";
import "./CarbonFootprint.css";

const CarbonFootprint = () => {
  return (
    <motion.div
      className="carbon-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="carbon-header">
        <h2 className="carbon-title">
          <Leaf size={24} />
          Carbon Footprint
        </h2>
        <span className="carbon-badge">Offset 45%</span>
      </div>

      <div className="carbon-stats">
        <div className="carbon-main-stat">
          <span className="stat-label">Total Emissions</span>
          <div className="stat-value-group">
            <span className="stat-number">245</span>
            <span className="stat-unit">tons CO₂</span>
          </div>
        </div>

        <div className="carbon-progress">
          <div className="progress-item">
            <div className="progress-label">
              <span>Transport</span>
              <span>156 tons</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "64%" }}
                transition={{ duration: 1, delay: 0.2 }}
              ></motion.div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-label">
              <span>Storage</span>
              <span>89 tons</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "36%" }}
                transition={{ duration: 1, delay: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="carbon-metrics">
          <div className="metric-item">
            <TrendingDown size={20} />
            <div>
              <span className="metric-label">Reduction</span>
              <span className="metric-value">18%</span>
            </div>
          </div>
          <div className="metric-item">
            <Award size={20} />
            <div>
              <span className="metric-label">Credits Earned</span>
              <span className="metric-value">124</span>
            </div>
          </div>
        </div>
      </div>

      <div className="carbon-actions">
        <button className="offset-btn">Offset More</button>
      </div>
    </motion.div>
  );
};

export default CarbonFootprint;
