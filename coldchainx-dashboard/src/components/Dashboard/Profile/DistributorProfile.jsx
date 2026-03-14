import React from "react";
import { Warehouse, Package, Globe, Clock } from "lucide-react";

const DistributorProfile = ({ user, isEditing }) => {
  return (
    <div className="profile-card">
      <h3>
        <span>Distribution Network</span>
        <Globe size={18} className="text-nude-600" />
      </h3>

      <div className="info-item">
        <Warehouse size={18} />
        <div>
          <span className="label">Warehouse Locations</span>
          {isEditing ? (
            <input
              type="text"
              defaultValue={user?.warehouseLocations}
              className="edit-input"
              placeholder="Number of warehouses"
            />
          ) : (
            <span className="value">
              {user?.warehouseLocations || "3"} warehouses
            </span>
          )}
        </div>
      </div>

      <div className="info-item">
        <Package size={18} />
        <div>
          <span className="label">Storage Capacity</span>
          {isEditing ? (
            <input
              type="text"
              defaultValue={user?.storageCapacity}
              className="edit-input"
              placeholder="Total capacity"
            />
          ) : (
            <span className="value">{user?.storageCapacity || "500"} tons</span>
          )}
        </div>
      </div>

      <div className="info-item">
        <Globe size={18} />
        <div>
          <span className="label">Distribution Regions</span>
          <span className="value">Western India, Southern India</span>
        </div>
      </div>

      <div className="info-item">
        <Clock size={18} />
        <div>
          <span className="label">Avg. Delivery Time</span>
          <span className="value">24-48 hours</span>
        </div>
      </div>
    </div>
  );
};

export default DistributorProfile;
