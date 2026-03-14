import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Shield,
} from "lucide-react";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, getUserProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const data = await getUserProfile();
    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={40} />
        </div>
        <div className="profile-title">
          <h2>{user?.name}</h2>
          <span className="profile-role">{user?.role}</span>
        </div>
      </div>

      <div className="profile-info">
        <div className="info-group">
          <label>
            <Mail size={16} /> Email
          </label>
          <p>{user?.email}</p>
        </div>

        <div className="info-group">
          <label>
            <Phone size={16} /> Phone
          </label>
          <p>{user?.phone}</p>
        </div>

        <div className="info-group">
          <label>
            <Building2 size={16} /> Company
          </label>
          <p>{user?.company}</p>
        </div>

        <div className="info-group">
          <label>
            <FileText size={16} /> License Number
          </label>
          <p>{profile?.licenseNumber}</p>
        </div>

        <div className="info-group">
          <label>
            <Calendar size={16} /> Registered
          </label>
          <p>{new Date(profile?.registrationDate).toLocaleDateString()}</p>
        </div>

        <div className="info-group">
          <label>
            <Shield size={16} /> IPFS CID
          </label>
          <p className="cid">{user?.profileCid}</p>
        </div>

        {profile?.role === "shipment" && (
          <>
            <div className="info-group">
              <label>Fleet Size</label>
              <p>{profile.fleetSize}</p>
            </div>
            <div className="info-group">
              <label>Insurance Provider</label>
              <p>{profile.insuranceProvider}</p>
            </div>
          </>
        )}

        {/* Add other role-specific fields */}
      </div>

      <div className="profile-footer">
        <button className="edit-btn" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
        <p className="ipfs-info">Data encrypted and stored on IPFS</p>
      </div>
    </motion.div>
  );
};

export default UserProfile;
