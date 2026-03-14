import React from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Calendar, MoreVertical } from "lucide-react";
import "./ShipmentList.css";

const ShipmentList = () => {
  const shipments = [
    {
      id: "SHP-001",
      product: "Vaccines",
      origin: "Mumbai",
      destination: "Delhi",
      status: "In Transit",
      date: "2024-01-15",
    },
    {
      id: "SHP-002",
      product: "Insulin",
      origin: "Chennai",
      destination: "Bangalore",
      status: "Delivered",
      date: "2024-01-14",
    },
    {
      id: "SHP-003",
      product: "Antibiotics",
      origin: "Kolkata",
      destination: "Hyderabad",
      status: "Processing",
      date: "2024-01-15",
    },
    {
      id: "SHP-004",
      product: "Vaccines",
      origin: "Mumbai",
      destination: "Pune",
      status: "In Transit",
      date: "2024-01-15",
    },
    {
      id: "SHP-005",
      product: "Pain Killers",
      origin: "Delhi",
      destination: "Lucknow",
      status: "Delayed",
      date: "2024-01-14",
    },
  ];

  return (
    <motion.div
      className="shipment-list-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="shipment-list-header">
        <h2 className="shipment-list-title">
          <Package size={24} />
          Recent Shipments
        </h2>
        <button className="filter-btn">Filter</button>
      </div>

      <div className="shipment-table">
        <div className="table-header">
          <div className="col-id">ID</div>
          <div className="col-product">Product</div>
          <div className="col-route">Route</div>
          <div className="col-status">Status</div>
          <div className="col-date">Date</div>
          <div className="col-actions"></div>
        </div>

        <div className="table-body">
          {shipments.map((shipment, index) => (
            <motion.div
              key={shipment.id}
              className="table-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            >
              <div className="col-id">
                <span className="shipment-id">{shipment.id}</span>
              </div>
              <div className="col-product">{shipment.product}</div>
              <div className="col-route">
                <div className="route-info">
                  <MapPin size={14} />
                  <span>
                    {shipment.origin} → {shipment.destination}
                  </span>
                </div>
              </div>
              <div className="col-status">
                <span
                  className={`status-badge ${shipment.status.toLowerCase().replace(" ", "-")}`}
                >
                  {shipment.status}
                </span>
              </div>
              <div className="col-date">
                <div className="date-info">
                  <Calendar size={14} />
                  <span>{shipment.date}</span>
                </div>
              </div>
              <div className="col-actions">
                <button className="action-icon">
                  <MoreVertical size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button className="load-more-btn">Load More Shipments</button>
    </motion.div>
  );
};

export default ShipmentList;
