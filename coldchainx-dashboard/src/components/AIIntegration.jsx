import React from "react";
import { motion } from "framer-motion";
import { Cpu, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import "./AIIntegration.css";

const AIIntegration = () => {
  return (
    <motion.div
      className="ai-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="ai-header">
        <h2 className="ai-title">
          <Cpu size={24} />
          AI Insights
        </h2>
        <span className="ai-badge">Live</span>
      </div>

      <div className="ai-predictions">
        <div className="prediction-item">
          <div className="prediction-icon">
            <TrendingUp size={20} />
          </div>
          <div className="prediction-content">
            <span className="prediction-label">Demand Forecast</span>
            <span className="prediction-value">+23% next week</span>
          </div>
        </div>

        <div className="prediction-item warning">
          <div className="prediction-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="prediction-content">
            <span className="prediction-label">Risk Alert</span>
            <span className="prediction-value">
              Temperature fluctuation predicted
            </span>
          </div>
        </div>

        <div className="prediction-item">
          <div className="prediction-icon">
            <Zap size={20} />
          </div>
          <div className="prediction-content">
            <span className="prediction-label">Optimization</span>
            <span className="prediction-value">Route efficiency +15%</span>
          </div>
        </div>
      </div>

      <div className="ai-recommendations">
        <h3 className="recommendations-title">Smart Recommendations</h3>

        <ul className="recommendations-list">
          <li>
            <span className="bullet"></span>
            Adjust temperature for Shipment #2389
          </li>
          <li>
            <span className="bullet"></span>
            Consider consolidating Mumbai deliveries
          </li>
          <li>
            <span className="bullet"></span>
            Carbon credit opportunity detected
          </li>
        </ul>
      </div>

      <button className="analyze-btn">Run Full Analysis</button>
    </motion.div>
  );
};

export default AIIntegration;
