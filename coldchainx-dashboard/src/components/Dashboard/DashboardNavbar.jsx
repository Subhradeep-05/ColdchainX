import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  X,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Package,
  Truck,
  Building2,
  Pill,
  Shield,
  Database,
  Thermometer,
  Calendar,
  Users, // ← ADDED THIS MISSING IMPORT
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import WalletIcon from "../Wallet/WalletIcon";
import "./DashboardNavbar.css";

const DashboardNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Role-based quick actions
  const getRoleSpecificSearch = () => {
    switch (user?.role) {
      case "distributor":
        return "Search medicines, batches, shipments...";
      case "shipment":
        return "Search shipments by ID, destination...";
      case "hospital":
        return "Search incoming shipments, medicines...";
      case "pharmacy":
        return "Search inventory, prescriptions...";
      default:
        return "Search...";
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setShowSearchResults(false);
      return;
    }

    // Mock search results - replace with actual API call
    const mockResults = [
      {
        id: 1,
        type: "medicine",
        name: "Paracetamol 500mg",
        details: "Batch: BATCH001",
      },
      {
        id: 2,
        type: "shipment",
        name: "Shipment #1234",
        details: "To: City Hospital",
      },
      {
        id: 3,
        type: "batch",
        name: "BATCH002",
        details: "Expires: 2025-12-31",
      },
    ];
    setSearchResults(mockResults);
    setShowSearchResults(true);
  };

  const notifications = [
    {
      id: 1,
      text: "New shipment request: Paracetamol",
      time: "5 min ago",
      type: "request",
    },
    {
      id: 2,
      text: "Shipment #567 delivered",
      time: "1 hour ago",
      type: "success",
    },
    {
      id: 3,
      text: "Temperature alert: Shipment #234",
      time: "3 hours ago",
      type: "alert",
    },
  ];

  const getRoleIcon = () => {
    switch (user?.role) {
      case "shipment":
        return <Truck size={20} />;
      case "distributor":
        return <Building2 size={20} />;
      case "hospital":
        return <Shield size={20} />;
      case "pharmacy":
        return <Pill size={20} />;
      default:
        return <User size={20} />;
    }
  };

  return (
    <nav className="dashboard-navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={getRoleSpecificSearch()}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <X size={16} />
            </button>
          )}

          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                className="search-results"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {searchResults.map((result) => (
                  <div key={result.id} className="search-result-item">
                    {result.type === "medicine" && <Package size={14} />}
                    {result.type === "shipment" && <Truck size={14} />}
                    {result.type === "batch" && <Database size={14} />}
                    <div className="result-info">
                      <span className="result-name">{result.name}</span>
                      <span className="result-details">{result.details}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="nav-right">
        {/* Role-specific quick actions */}
        {user?.role === "distributor" && (
          <button className="quick-action-btn" title="Medicine Catalog">
            <Package size={18} />
          </button>
        )}
        {user?.role === "hospital" && (
          <button className="quick-action-btn" title="Patient Queue">
            <Users size={18} /> {/* This now works! */}
          </button>
        )}
        {user?.role === "pharmacy" && (
          <button className="quick-action-btn" title="Inventory">
            <Database size={18} />
          </button>
        )}
        {user?.role === "shipment" && (
          <button className="quick-action-btn" title="Route Planner">
            <Calendar size={18} />
          </button>
        )}

        <WalletIcon balance={2450} />

        <div className="notifications">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="notifications-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button>Mark all as read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.type}`}
                    >
                      <div className="notification-content">
                        <p>{notif.text}</p>
                        <span className="time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <button>View all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="profile-menu">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">{getRoleIcon()}</div>
            <div className="profile-info">
              <span className="profile-name">
                {user?.fullName || user?.name}
              </span>
              <span className="profile-role">{user?.role}</span>
            </div>
            <ChevronDown
              size={16}
              className={`arrow ${showProfileMenu ? "rotated" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="dropdown-user-info">
                  <div className="user-avatar-large">{getRoleIcon()}</div>
                  <div className="user-details">
                    <span className="user-fullname">
                      {user?.fullName || user?.name}
                    </span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
                <button className="dropdown-item">
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={logout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
