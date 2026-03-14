import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Package,
  Leaf,
  Wallet,
  Cpu,
  LogIn,
  Database,
  User,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import "./Navbar.css";

const Navbar = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: Package, href: "#" },
    { name: "Shipments", icon: Package, href: "#" },
    { name: "Carbon Footprint", icon: Leaf, href: "#" },
    { name: "Wallet", icon: Wallet, href: "#" },
    { name: "AI Insights", icon: Cpu, href: "#" },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container container">
        <div className="nav-logo">
          <motion.div
            className="logo-icon"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Package size={32} />
          </motion.div>
          <span className="logo-text">
            coldchain<span className="gradient-text">X</span>
          </span>
        </div>

        <div className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="nav-link"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </motion.a>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              {/* IPFS Status Indicator */}
              <div className="ipfs-status" title="Data stored on IPFS">
                <Database size={16} />
                <span className="status-dot"></span>
              </div>

              {/* User Menu */}
              <div className="user-menu-container">
                <motion.button
                  className="user-menu-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={18} />
                  <span className="user-name">{user.name}</span>
                </motion.button>

                {showUserMenu && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="user-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      <span className="user-role">{user.role}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="#" className="dropdown-item">
                      Profile
                    </a>
                    <a href="#" className="dropdown-item">
                      Settings
                    </a>
                    <a href="#" className="dropdown-item">
                      My Shipments
                    </a>
                    <div className="dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <motion.button
              className="login-nav-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoginClick}
            >
              <LogIn size={18} />
              <span>Login</span>
            </motion.button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
