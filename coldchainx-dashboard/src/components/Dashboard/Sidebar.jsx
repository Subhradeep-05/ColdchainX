import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Leaf,
  Wallet,
  Cpu,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Truck,
  Building2,
  Pill,
  Shield,
  Users,
  Thermometer,
  ClipboardList,
  BarChart3,
  Bell,
  Calendar,
  FileText, // Added missing import
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  // Debug logs
  console.log("Sidebar - User role:", user?.role);
  console.log("Sidebar - Active tab:", activeTab);

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ];

    switch (user?.role) {
      case "distributor":
        return [
          ...baseItems,
          { id: "medicine-catalog", label: "Medicine Catalog", icon: Package },
          { id: "create-shipment", label: "Create Shipment", icon: Truck },
          { id: "outgoing", label: "Outgoing Shipments", icon: Package },
          { id: "inventory", label: "Inventory", icon: ClipboardList },
          { id: "requests", label: "Requests", icon: Bell },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "carbon", label: "Carbon Footprint", icon: Leaf },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "shipment":
        return [
          ...baseItems,
          { id: "available", label: "Available Shipments", icon: Package },
          { id: "my-shipments", label: "My Shipments", icon: Truck },
          {
            id: "active-deliveries",
            label: "Active Deliveries",
            icon: Calendar,
          },
          {
            id: "temperature",
            label: "Temperature Monitor",
            icon: Thermometer,
          },
          { id: "routes", label: "Route Planner", icon: Users },
          { id: "carbon", label: "Carbon Footprint", icon: Leaf },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "hospital":
        return [
          ...baseItems,
          { id: "incoming", label: "Incoming Shipments", icon: Package },
          { id: "verify", label: "Verify Shipments", icon: Shield },
          { id: "inventory", label: "Medicine Inventory", icon: ClipboardList },
          { id: "patients", label: "Patient Queue", icon: Users },
          { id: "requests", label: "Request Supplies", icon: Bell },
          { id: "carbon", label: "Carbon Footprint", icon: Leaf },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "profile", label: "Profile", icon: User },
        ];

      case "pharmacy":
        return [
          ...baseItems,
          { id: "incoming", label: "Incoming Shipments", icon: Package },
          { id: "verify", label: "Verify Medicines", icon: Shield },
          { id: "inventory", label: "Inventory", icon: ClipboardList },
          { id: "dispensing", label: "Dispensing", icon: Pill },
          { id: "prescriptions", label: "Prescriptions", icon: FileText }, // Now FileText is defined
          { id: "cold-storage", label: "Cold Storage", icon: Thermometer },
          { id: "carbon", label: "Carbon Footprint", icon: Leaf },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "profile", label: "Profile", icon: User },
        ];

      default:
        return [
          ...baseItems,
          { id: "shipments", label: "Shipments", icon: Package },
          { id: "carbon", label: "Carbon Footprint", icon: Leaf },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "ai", label: "AI Insights", icon: Cpu },
          { id: "profile", label: "Profile", icon: User },
        ];
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "shipment":
        return <Truck size={24} />;
      case "distributor":
        return <Building2 size={24} />;
      case "hospital":
        return <Shield size={24} />;
      case "pharmacy":
        return <Pill size={24} />;
      default:
        return <User size={24} />;
    }
  };

  const menuItems = getMenuItems();

  const handleTabClick = (tabId) => {
    console.log("Tab clicked:", tabId);
    setActiveTab(tabId);
  };

  return (
    <motion.aside
      className={`sidebar ${isOpen ? "open" : "closed"}`}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <Package size={32} />
          {isOpen && (
            <span>
              coldchain<span className="gradient-text">X</span>
            </span>
          )}
        </div>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="user-profile">
        <div className="avatar">{getRoleIcon()}</div>
        {isOpen && (
          <div className="user-info">
            <span className="name">{user?.fullName || user?.name}</span>
            <span className="role">{user?.role}</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabClick(item.id)}
              title={!isOpen ? item.label : ""}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </button>
        <button className="nav-item logout" onClick={logout}>
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
