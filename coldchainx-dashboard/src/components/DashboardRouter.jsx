import React, { useState, useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import Sidebar from "./Dashboard/Sidebar";
import DashboardNavbar from "./Dashboard/DashboardNavbar";

// Import all page components
import DashboardHome from "./Dashboard/pages/DashboardHome";

// Distributor Pages
import MedicineCatalogPage from "./Dashboard/pages/MedicineCatalogPage";
import CreateShipmentPage from "./Dashboard/pages/CreateShipmentPage";
import OutgoingShipmentsPage from "./Dashboard/pages/OutgoingShipmentsPage";
import InventoryPage from "./Dashboard/pages/InventoryPage";
import RequestsPage from "./Dashboard/pages/RequestsPage";
import ReportsPage from "./Dashboard/pages/ReportsPage";

// Shipment Provider Pages
import AvailableShipmentsPage from "./Dashboard/pages/AvailableShipmentsPage";
import MyShipmentsPage from "./Dashboard/pages/MyShipmentsPage";
import ActiveDeliveriesPage from "./Dashboard/pages/ActiveDeliveriesPage";
import TemperatureMonitorPage from "./Dashboard/pages/TemperatureMonitorPage";
import RoutePlannerPage from "./Dashboard/pages/RoutePlannerPage";

// Hospital Pages
import IncomingShipmentsPage from "./Dashboard/pages/IncomingShipmentsPage";
import VerifyShipmentsPage from "./Dashboard/pages/VerifyShipmentsPage";
import MedicineInventoryPage from "./Dashboard/pages/MedicineInventoryPage";
import PatientQueuePage from "./Dashboard/pages/PatientQueuePage";
import RequestSuppliesPage from "./Dashboard/pages/RequestSuppliesPage";

// Pharmacy Pages
import DispensingPage from "./Dashboard/pages/DispensingPage";
import PrescriptionsPage from "./Dashboard/pages/PrescriptionsPage";
import ColdStoragePage from "./Dashboard/pages/ColdStoragePage";

// Common Pages
import CarbonFootprintPage from "./Dashboard/pages/CarbonFootprintPage";
import WalletPage from "./Dashboard/pages/WalletPage";
import ProfilePage from "./Dashboard/pages/ProfilePage";
import AIPage from "./Dashboard/pages/AIPage";

import "./Dashboard/Dashboard.css";

const DashboardRouter = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Reset to dashboard when user role changes
  useEffect(() => {
    setActiveTab("dashboard");
  }, [user?.role]);

  const renderContent = () => {
    console.log("========== RENDER CONTENT CALLED ==========");
    console.log("📌 activeTab:", activeTab);
    console.log("👤 user role:", user?.role);

    // Common pages accessible by all roles
    switch (activeTab) {
      case "dashboard":
        console.log("✅ Rendering DashboardHome (common)");
        return <DashboardHome />;

      case "carbon":
        console.log("✅ Rendering CarbonFootprintPage (common)");
        return <CarbonFootprintPage />;

      case "wallet":
        console.log("✅ Rendering WalletPage (common)");
        return <WalletPage />;

      case "profile":
        console.log("✅ Rendering ProfilePage (common)");
        return <ProfilePage />;

      case "ai":
        console.log("✅ Rendering AIPage (common)");
        return <AIPage />;
    }

    // Role-specific pages
    console.log("🎯 Checking role-specific pages for role:", user?.role);

    switch (user?.role) {
      // Distributor Pages
      case "distributor":
        console.log("📦 Distributor specific page for tab:", activeTab);
        switch (activeTab) {
          case "medicine-catalog":
            console.log("✅ Rendering MedicineCatalogPage (distributor)");
            return <MedicineCatalogPage />;

          case "create-shipment":
            console.log(
              "✅ Rendering CreateShipmentPage (distributor) - THIS SHOULD SHOW",
            );
            return <CreateShipmentPage />;

          case "outgoing":
            console.log("✅ Rendering OutgoingShipmentsPage (distributor)");
            return <OutgoingShipmentsPage />;

          case "inventory":
            console.log("✅ Rendering InventoryPage (distributor)");
            return <InventoryPage />;

          case "requests":
            console.log("✅ Rendering RequestsPage (distributor)");
            return <RequestsPage />;

          case "reports":
            console.log("✅ Rendering ReportsPage (distributor)");
            return <ReportsPage />;

          default:
            console.log(
              "⚠️ No match for distributor tab:",
              activeTab,
              "- falling back to DashboardHome",
            );
            return <DashboardHome />;
        }

      // Shipment Provider Pages
      case "shipment":
        console.log("🚚 Shipment Provider specific page for tab:", activeTab);
        switch (activeTab) {
          case "available":
            console.log("✅ Rendering AvailableShipmentsPage (shipment)");
            return <AvailableShipmentsPage />;

          case "my-shipments":
            console.log("✅ Rendering MyShipmentsPage (shipment)");
            return <MyShipmentsPage />;

          case "active-deliveries":
            console.log("✅ Rendering ActiveDeliveriesPage (shipment)");
            return <ActiveDeliveriesPage />;

          case "temperature":
            console.log("✅ Rendering TemperatureMonitorPage (shipment)");
            return <TemperatureMonitorPage />;

          case "routes":
            console.log("✅ Rendering RoutePlannerPage (shipment)");
            return <RoutePlannerPage />;

          default:
            console.log(
              "⚠️ No match for shipment tab:",
              activeTab,
              "- falling back to DashboardHome",
            );
            return <DashboardHome />;
        }

      // Hospital Pages
      case "hospital":
        console.log("🏥 Hospital specific page for tab:", activeTab);
        switch (activeTab) {
          case "incoming":
            console.log("✅ Rendering IncomingShipmentsPage (hospital)");
            return <IncomingShipmentsPage />;

          case "verify":
            console.log("✅ Rendering VerifyShipmentsPage (hospital)");
            return <VerifyShipmentsPage />;

          case "inventory":
            console.log("✅ Rendering MedicineInventoryPage (hospital)");
            return <MedicineInventoryPage />;

          case "patients":
            console.log("✅ Rendering PatientQueuePage (hospital)");
            return <PatientQueuePage />;

          case "requests":
            console.log("✅ Rendering RequestSuppliesPage (hospital)");
            return <RequestSuppliesPage />;

          default:
            console.log(
              "⚠️ No match for hospital tab:",
              activeTab,
              "- falling back to DashboardHome",
            );
            return <DashboardHome />;
        }

      // Pharmacy Pages
      case "pharmacy":
        console.log("💊 Pharmacy specific page for tab:", activeTab);
        switch (activeTab) {
          case "incoming":
            console.log("✅ Rendering IncomingShipmentsPage (pharmacy)");
            return <IncomingShipmentsPage />;

          case "verify":
            console.log("✅ Rendering VerifyShipmentsPage (pharmacy)");
            return <VerifyShipmentsPage />;

          case "inventory":
            console.log("✅ Rendering MedicineInventoryPage (pharmacy)");
            return <MedicineInventoryPage />;

          case "dispensing":
            console.log("✅ Rendering DispensingPage (pharmacy)");
            return <DispensingPage />;

          case "prescriptions":
            console.log("✅ Rendering PrescriptionsPage (pharmacy)");
            return <PrescriptionsPage />;

          case "cold-storage":
            console.log("✅ Rendering ColdStoragePage (pharmacy)");
            return <ColdStoragePage />;

          default:
            console.log(
              "⚠️ No match for pharmacy tab:",
              activeTab,
              "- falling back to DashboardHome",
            );
            return <DashboardHome />;
        }

      default:
        console.log(
          "⚠️ No role match or unknown role:",
          user?.role,
          "- returning DashboardHome",
        );
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div
        className={`dashboard-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <DashboardNavbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        <div className="dashboard-container">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DashboardRouter;
