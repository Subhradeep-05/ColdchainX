import React from "react";
import { motion } from "framer-motion";
import { Package, Calendar, MoreVertical } from "lucide-react";
import StatusBadge from "./StatusBadge";
import "./Common.css";

const ShipmentTable = ({ shipments, onRowClick, showActions = true }) => {
  return (
    <div className="shipment-table-container">
      <table className="shipment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicine</th>
            <th>Batch</th>
            <th>Quantity</th>
            <th>From → To</th>
            <th>Status</th>
            <th>Date</th>
            {showActions && <th></th>}
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment, index) => (
            <motion.tr
              key={shipment._id || shipment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onRowClick?.(shipment)}
              className={onRowClick ? "clickable" : ""}
            >
              <td className="shipment-id">
                #{shipment.shipmentId || shipment.id}
              </td>
              <td className="medicine-name">{shipment.medicineName}</td>
              <td>{shipment.batchNumber}</td>
              <td>{shipment.quantity}</td>
              <td className="route">
                <span className="from">
                  {shipment.from || shipment.distributorName || "N/A"}
                </span>
                <span className="arrow">→</span>
                <span className="to">
                  {shipment.to ||
                    shipment.hospitalId ||
                    shipment.pharmacyId ||
                    "N/A"}
                </span>
              </td>
              <td>
                <StatusBadge status={shipment.status} size="small" />
              </td>
              <td className="date">
                <Calendar size={14} />
                <span>
                  {new Date(
                    shipment.createdAt || shipment.date,
                  ).toLocaleDateString()}
                </span>
              </td>
              {showActions && (
                <td className="actions">
                  <button className="more-btn">
                    <MoreVertical size={16} />
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>

      {shipments.length === 0 && (
        <div className="empty-table">
          <Package size={48} />
          <p>No shipments found</p>
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;
