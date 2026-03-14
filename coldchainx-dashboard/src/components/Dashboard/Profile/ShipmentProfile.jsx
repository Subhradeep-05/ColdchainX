import React from "react";
import { Package, Shield, Truck, MapPin, Calendar } from "lucide-react";

const ShipmentProfile = ({ user, isEditing }) => {
  return (
    <div className="profile-card">
      <h3>
        <span>Fleet Information</span>
        <Truck size={18} className="text-nude-600" />
      </h3>

      <div className="info-item">
        <Package size={18} />
        <div>
          <span className="label">Fleet Size</span>
          {isEditing ? (
            <input
              type="number"
              defaultValue={user?.fleetSize}
              className="edit-input"
              placeholder="Number of vehicles"
            />
          ) : (
            <span className="value">{user?.fleetSize || "0"} vehicles</span>
          )}
        </div>
      </div>

      <div className="info-item">
        <Shield size={18} />
        <div>
          <span className="label">Insurance Provider</span>
          {isEditing ? (
            <input
              type="text"
              defaultValue={user?.insuranceProvider}
              className="edit-input"
              placeholder="Insurance company"
            />
          ) : (
            <span className="value">
              {user?.insuranceProvider || "Not specified"}
            </span>
          )}
        </div>
      </div>

      <div className="info-item">
        <MapPin size={18} />
        <div>
          <span className="label">Service Areas</span>
          <span className="value">Mumbai, Delhi, Bangalore</span>
        </div>
      </div>

      <div className="info-item">
        <Calendar size={18} />
        <div>
          <span className="label">Next Maintenance</span>
          <span className="value">2024-06-15</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentProfile;
