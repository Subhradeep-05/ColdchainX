import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Edit2,
  Save,
  Shield,
  Award,
  Package,
  Truck,
  Pill,
  Users,
  Thermometer,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../../components/context/AuthContext";
import "./Pages.css";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+1234567890",
    companyName: user?.companyName || "MediCorp",
    licenseNumber: user?.licenseNumber || "LIC-2024-001",
    registrationDate: user?.registrationDate || "2024-01-15",
    role: user?.role || "distributor",
    ...user,
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call to update profile
  };

  const getRoleSpecificInfo = () => {
    switch (profile.role) {
      case "shipment":
        return (
          <>
            <div className="info-item">
              <Truck size={18} />
              <div>
                <span className="label">Fleet Size</span>
                <span className="value">
                  {profile.fleetSize || "12 vehicles"}
                </span>
              </div>
            </div>
            <div className="info-item">
              <Shield size={18} />
              <div>
                <span className="label">Insurance Provider</span>
                <span className="value">
                  {profile.insuranceProvider || "SafeFleet Insurance"}
                </span>
              </div>
            </div>
          </>
        );
      case "distributor":
        return (
          <>
            <div className="info-item">
              <Building2 size={18} />
              <div>
                <span className="label">Warehouse Locations</span>
                <span className="value">
                  {profile.warehouseLocations || "3 locations"}
                </span>
              </div>
            </div>
            <div className="info-item">
              <Package size={18} />
              <div>
                <span className="label">Storage Capacity</span>
                <span className="value">
                  {profile.storageCapacity || "500 tons"}
                </span>
              </div>
            </div>
          </>
        );
      case "hospital":
        return (
          <>
            <div className="info-item">
              <Building2 size={18} />
              <div>
                <span className="label">Hospital Type</span>
                <span className="value">
                  {profile.hospitalType || "Private"}
                </span>
              </div>
            </div>
            <div className="info-item">
              <Users size={18} />
              <div>
                <span className="label">Bed Capacity</span>
                <span className="value">
                  {profile.bedCapacity || "200 beds"}
                </span>
              </div>
            </div>
          </>
        );
      case "pharmacy":
        return (
          <>
            <div className="info-item">
              <FileText size={18} />
              <div>
                <span className="label">Pharmacist License</span>
                <span className="value">
                  {profile.pharmacistLicense || "PH-2024-001"}
                </span>
              </div>
            </div>
            <div className="info-item">
              <Pill size={18} />
              <div>
                <span className="label">Pharmacy Type</span>
                <span className="value">
                  {profile.pharmacyType || "Retail"}
                </span>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Profile</h1>
        <button
          className="btn-primary"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div
        className="profile-header"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "2rem",
          padding: "2rem",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--nude-300), var(--nude-500))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={40} style={{ color: "white" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            {profile.fullName}
          </h2>
          <p
            style={{
              display: "inline-block",
              padding: "0.25rem 1rem",
              background: "rgba(201,124,100,0.1)",
              borderRadius: "100px",
              color: "var(--nude-600)",
            }}
          >
            {profile.role}
          </p>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
      >
        <div className="info-card">
          <h3>Personal Information</h3>
          <div className="info-item">
            <Mail size={18} />
            <div>
              <span className="label">Email</span>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              ) : (
                <span className="value">{profile.email}</span>
              )}
            </div>
          </div>

          <div className="info-item">
            <Phone size={18} />
            <div>
              <span className="label">Phone</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                />
              ) : (
                <span className="value">{profile.phone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Business Information</h3>
          <div className="info-item">
            <Building2 size={18} />
            <div>
              <span className="label">Company</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) =>
                    setProfile({ ...profile, companyName: e.target.value })
                  }
                />
              ) : (
                <span className="value">{profile.companyName}</span>
              )}
            </div>
          </div>

          <div className="info-item">
            <FileText size={18} />
            <div>
              <span className="label">License Number</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.licenseNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, licenseNumber: e.target.value })
                  }
                />
              ) : (
                <span className="value">{profile.licenseNumber}</span>
              )}
            </div>
          </div>

          <div className="info-item">
            <Calendar size={18} />
            <div>
              <span className="label">Registered</span>
              <span className="value">
                {new Date(profile.registrationDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {getRoleSpecificInfo()}
        </div>
      </div>

      <div className="info-card" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Award size={24} style={{ color: "var(--nude-600)" }} />
          <div>
            <span className="label">IPFS Profile CID</span>
            <p
              style={{
                fontFamily: "monospace",
                background: "var(--nude-100)",
                padding: "0.5rem",
                borderRadius: "8px",
                marginTop: "0.5rem",
              }}
            >
              {user?.profileCid || "QmProfileHash123456789"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
