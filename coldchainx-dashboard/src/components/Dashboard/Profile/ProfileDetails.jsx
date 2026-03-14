import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Award,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ShipmentProfile from "./ShipmentProfile";
import HospitalProfile from "./HospitalProfile";
import PharmacyProfile from "./PharmacyProfile";
import DistributorProfile from "./DistributorProfile";
import "./ProfileDetails.css";

const ProfileDetails = ({ user }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState(user);

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const getRoleSpecificComponent = () => {
    switch (user?.role) {
      case "shipment":
        return <ShipmentProfile user={user} isEditing={isEditing} />;
      case "distributor":
        return <DistributorProfile user={user} isEditing={isEditing} />;
      case "hospital":
        return <HospitalProfile user={user} isEditing={isEditing} />;
      case "pharmacy":
        return <PharmacyProfile user={user} isEditing={isEditing} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="profile-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-large">
            {user?.fullName?.charAt(0) || user?.name?.charAt(0)}
          </div>
        </div>

        <div className="profile-header-content">
          <div className="profile-title-section">
            <div>
              <h1>{user?.fullName || user?.name}</h1>
              <p className="profile-role-badge">{user?.role}</p>
            </div>
            <button
              className={`edit-profile-btn ${isEditing ? "saving" : ""}`}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Active</span>
              <span className="stat-value">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Today"}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shipments</span>
              <span className="stat-value">24</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card personal-info">
          <h3>Personal Information</h3>
          <div className="info-item">
            <Mail size={18} />
            <div>
              <span className="label">Email Address</span>
              <span className="value">{user?.email}</span>
            </div>
          </div>
          <div className="info-item">
            <Phone size={18} />
            <div>
              <span className="label">Phone Number</span>
              {isEditing ? (
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  className="edit-input"
                  placeholder="Enter phone number"
                />
              ) : (
                <span className="value">{user?.phone || "Not provided"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-card business-info">
          <h3>Business Information</h3>
          <div className="info-item">
            <Building2 size={18} />
            <div>
              <span className="label">Company Name</span>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user?.companyName}
                  className="edit-input"
                  placeholder="Enter company name"
                />
              ) : (
                <span className="value">{user?.companyName}</span>
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
                  defaultValue={user?.licenseNumber}
                  className="edit-input"
                  placeholder="Enter license number"
                />
              ) : (
                <span className="value">{user?.licenseNumber}</span>
              )}
            </div>
          </div>
          <div className="info-item">
            <Calendar size={18} />
            <div>
              <span className="label">Registration Date</span>
              <span className="value">
                {new Date(
                  user?.registrationDate || Date.now(),
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {getRoleSpecificComponent()}
      </div>

      <div className="ipfs-info-card">
        <Award size={20} />
        <div>
          <span className="label">IPFS Storage</span>
          <span className="value cid">{user?.profileCid}</span>
          <p className="ipfs-note">
            Your profile data is encrypted and stored on IPFS
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileDetails;
