import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Thermometer, BarChart3 } from "lucide-react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <span className="badge-icon">⚡</span>
            Blockchain-Powered Cold Chain
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Secure Medicine Supply Chain
            <span className="gradient-text"> with IoT & AI</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time monitoring, carbon footprint tracking, and
            blockchain-secured transactions for pharmaceutical supply chains.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="primary-btn">
              Launch Dashboard
              <ArrowRight size={20} />
            </button>
            <button className="secondary-btn">Watch Demo</button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="stat-item">
              <div className="stat-icon">
                <Shield size={24} />
              </div>
              <div>
                <div className="stat-value">100%</div>
                <div className="stat-label">Secure Blockchain</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Thermometer size={24} />
              </div>
              <div>
                <div className="stat-value">24/7</div>
                <div className="stat-label">IoT Monitoring</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="stat-value">45%</div>
                <div className="stat-label">Less Carbon</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="visual-container">
            <div className="floating-card card-1">
              <Thermometer size={24} />
              <span>2-8°C</span>
            </div>
            <div className="floating-card card-2">
              <Shield size={24} />
              <span>Verified</span>
            </div>
            <div className="floating-card card-3">
              <BarChart3 size={24} />
              <span>245 tons</span>
            </div>
            <div className="visual-gradient"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
