import React from "react";
import { motion } from "framer-motion";
import { Package, Github, Twitter, Linkedin, Mail } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Package size={32} />
              <span>
                coldchain<span className="gradient-text">X</span>
              </span>
            </div>
            <p className="footer-description">
              Blockchain-powered medicine supply chain with IoT monitoring and
              AI-driven insights.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Github size={20} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Product</h3>
            <ul>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">API</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Resources</h3>
            <ul>
              <li>
                <a href="#">Documentation</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Community</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h3 className="footer-title">Company</h3>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 coldchainX. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
