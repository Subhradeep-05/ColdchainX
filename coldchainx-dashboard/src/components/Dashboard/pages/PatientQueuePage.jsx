import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Activity,
} from "lucide-react";
import "./Pages.css";

const PatientQueuePage = () => {
  const [queue, setQueue] = useState([
    {
      id: 1,
      name: "John Smith",
      age: 45,
      condition: "Fever",
      priority: "urgent",
      waitTime: "15 min",
      status: "waiting",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 32,
      condition: "Headache",
      priority: "normal",
      waitTime: "30 min",
      status: "waiting",
    },
    {
      id: 3,
      name: "Mike Wilson",
      age: 58,
      condition: "Diabetes",
      priority: "high",
      waitTime: "10 min",
      status: "in-progress",
    },
    {
      id: 4,
      name: "Emily Brown",
      age: 27,
      condition: "Allergy",
      priority: "normal",
      waitTime: "45 min",
      status: "waiting",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const stats = {
    total: queue.length,
    waiting: queue.filter((p) => p.status === "waiting").length,
    inProgress: queue.filter((p) => p.status === "in-progress").length,
    urgent: queue.filter((p) => p.priority === "urgent").length,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#e74c3c";
      case "high":
        return "#f39c12";
      default:
        return "#3498db";
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Patient Queue</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(52, 152, 219, 0.1)", color: "#3498db" }}
          >
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Patients</div>
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
            <div className="stat-label">Waiting</div>
            <div className="stat-value">{stats.waiting}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Urgent</div>
            <div className="stat-value">{stats.urgent}</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        {queue
          .filter((p) => filter === "all" || p.status === filter)
          .map((patient) => (
            <div key={patient.id} className="info-card">
              <div className="card-header">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <User size={20} style={{ color: "var(--nude-600)" }} />
                  <h3>{patient.name}</h3>
                </div>
                <span className={`status-badge ${patient.status}`}>
                  {patient.status}
                </span>
              </div>

              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span>{patient.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Condition:</span>
                  <span>{patient.condition}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Priority:</span>
                  <span style={{ color: getPriorityColor(patient.priority) }}>
                    {patient.priority}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Wait Time:</span>
                  <span>{patient.waitTime}</span>
                </div>
              </div>

              <div className="card-footer">
                <button className="btn-primary">Start Treatment</button>
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
};

export default PatientQueuePage;
