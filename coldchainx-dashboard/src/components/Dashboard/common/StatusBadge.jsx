import React from "react";
import "./Common.css";

const StatusBadge = ({ status, size = "medium" }) => {
  const getStatusClass = (status) => {
    const statusMap = {
      pending_distributor: "pending",
      with_shipment: "accepted",
      in_transit: "in-transit",
      delivered: "delivered",
      verified: "verified",
      rejected: "rejected",
      Created: "created",
      InTransit: "in-transit",
      Delivered: "delivered",
      Verified: "verified",
      Rejected: "rejected",
    };
    return statusMap[status] || "default";
  };

  const getDisplayText = (status) => {
    return status?.replace(/_/g, " ") || status;
  };

  return (
    <span className={`status-badge ${getStatusClass(status)} ${size}`}>
      {getDisplayText(status)}
    </span>
  );
};

export default StatusBadge;
