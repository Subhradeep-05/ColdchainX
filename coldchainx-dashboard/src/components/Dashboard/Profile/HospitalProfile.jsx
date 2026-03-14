import React from "react";
import { Building2, Thermometer, Users, Activity } from "lucide-react";

const HospitalProfile = ({ user, isEditing }) => {
  return (
    <div className="profile-card">
      <h3>
        <span>Hospital Details</span>
        <Building2 size={18} className="text-nude-600" />
      </h3>

      <div className="info-item">
        <Building2 size={18} />
        <div>
          <span className="label">Hospital Type</span>
          {isEditing ? (
            <select defaultValue={user?.hospitalType} className="edit-input">
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="teaching">Teaching</option>
              <option value="specialty">Specialty</option>
            </select>
          ) : (
            <span className="value">{user?.hospitalType || "Private"}</span>
          )}
        </div>
      </div>

      <div className="info-item">
        <Users size={18} />
        <div>
          <span className="label">Bed Capacity</span>
          {isEditing ? (
            <input
              type="number"
              defaultValue={user?.bedCapacity}
              className="edit-input"
              placeholder="Number of beds"
            />
          ) : (
            <span className="value">{user?.bedCapacity || "200"} beds</span>
          )}
        </div>
      </div>

      <div className="info-item">
        <Thermometer size={18} />
        <div>
          <span className="label">Cold Storage Units</span>
          <span className="value">4 units (2-8°C)</span>
        </div>
      </div>

      <div className="info-item">
        <Activity size={18} />
        <div>
          <span className="label">Monthly Patients</span>
          <span className="value">~3,500</span>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
