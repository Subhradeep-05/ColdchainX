import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  MessageCircle,
} from "lucide-react";
import "./Pages.css";

const RequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: "supply",
      from: "City Hospital",
      items: [
        { name: "Paracetamol 500mg", quantity: 500 },
        { name: "Amoxicillin 250mg", quantity: 200 },
        { name: "Insulin 100IU", quantity: 50 },
      ],
      priority: "urgent",
      status: "pending",
      date: "2024-03-15",
      notes: "Emergency supply needed",
      requester: "Dr. Williams",
    },
    {
      id: 2,
      type: "quotation",
      from: "HealthFirst Pharmacy",
      items: [
        { name: "Ibuprofen 400mg", quantity: 1000 },
        { name: "Antibiotics", quantity: 500 },
      ],
      priority: "normal",
      status: "approved",
      date: "2024-03-14",
      notes: "Monthly supply order",
      requester: "Sarah Johnson",
    },
    {
      id: 3,
      type: "shipment",
      from: "MediLogistics",
      items: [
        { name: "Vaccines", quantity: 200 },
        { name: "Cold Storage Boxes", quantity: 10 },
      ],
      priority: "high",
      status: "in-progress",
      date: "2024-03-13",
      notes: "Temperature controlled shipment",
      requester: "Mike Wilson",
    },
    {
      id: 4,
      type: "supply",
      from: "General Hospital",
      items: [
        { name: "Surgical Masks", quantity: 1000 },
        { name: "Gloves", quantity: 2000 },
        { name: "Syringes", quantity: 500 },
      ],
      priority: "normal",
      status: "rejected",
      date: "2024-03-12",
      notes: "Regular supply order",
      requester: "Dr. Chen",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    total: requests.length,
  };

  const filteredRequests = requests.filter(
    (r) => filter === "all" || r.status === filter || r.priority === filter,
  );

  const handleApprove = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)),
    );
    setSelectedRequest(null);
  };

  const handleReject = (requestId) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)),
    );
    setSelectedRequest(null);
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Requests</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="btn-secondary"
            style={{ padding: "0.5rem 1rem" }}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(241, 196, 15, 0.1)", color: "#f39c12" }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats.approved}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(155, 89, 182, 0.1)", color: "#9b59b6" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {filteredRequests.map((request) => (
          <div key={request.id} className={`info-card ${request.priority}`}>
            <div className="card-header">
              <div>
                <h3>{request.from}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--taupe)" }}>
                  {request.type} request
                </p>
              </div>
              <span className={`status-badge ${request.status}`}>
                {request.status}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <User size={14} className="detail-label" />
                <span>{request.requester}</span>
              </div>
              <div className="detail-row">
                <Calendar size={14} className="detail-label" />
                <span>{new Date(request.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <AlertCircle size={14} className="detail-label" />
                <span
                  style={{
                    color:
                      request.priority === "urgent"
                        ? "#e74c3c"
                        : request.priority === "high"
                          ? "#f39c12"
                          : "#3498db",
                  }}
                >
                  {request.priority} priority
                </span>
              </div>
            </div>

            <details style={{ margin: "1rem 0" }}>
              <summary style={{ cursor: "pointer", color: "var(--nude-600)" }}>
                View Items ({request.items.length})
              </summary>
              <div style={{ marginTop: "0.5rem" }}>
                {request.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.5rem",
                      borderBottom: "1px solid var(--nude-200)",
                    }}
                  >
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                  </div>
                ))}
              </div>
            </details>

            {request.notes && (
              <div
                style={{
                  padding: "0.5rem",
                  background: "var(--nude-50)",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                }}
              >
                <MessageCircle size={14} style={{ marginRight: "0.5rem" }} />
                <span style={{ fontSize: "0.9rem" }}>{request.notes}</span>
              </div>
            )}

            <div className="card-footer">
              {request.status === "pending" && (
                <>
                  <button
                    className="btn-success"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleReject(request.id)}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </>
              )}
              {request.status === "approved" && (
                <button className="btn-primary">Process Request</button>
              )}
              {request.status === "rejected" && (
                <button className="btn-secondary">View Details</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Request Details</h2>
            {/* Request details content */}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default RequestsPage;
