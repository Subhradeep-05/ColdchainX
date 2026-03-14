import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Calendar,
  Package,
  Truck,
  Users,
  TrendingUp,
  TrendingDown,
  Leaf,
  DollarSign,
  FileText,
  Filter,
  CheckCircle,
  AlertCircle,
  Activity,
  XCircle,
  Award,
} from "lucide-react";
import "./Pages.css";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("shipments");
  const [dateRange, setDateRange] = useState("month");

  const reports = {
    shipments: {
      title: "Shipment Report",
      data: [
        { month: "Jan", total: 145, delivered: 138, delayed: 7 },
        { month: "Feb", total: 162, delivered: 155, delayed: 7 },
        { month: "Mar", total: 158, delivered: 150, delayed: 8 },
        { month: "Apr", total: 171, delivered: 164, delayed: 7 },
        { month: "May", total: 184, delivered: 175, delayed: 9 },
        { month: "Jun", total: 192, delivered: 182, delayed: 10 },
      ],
      summary: {
        total: 1012,
        avgDelivery: "94.2%",
        avgDelay: "5.8%",
        totalDelayed: 48,
      },
    },
    inventory: {
      title: "Inventory Report",
      data: [
        { category: "Analgesics", stock: 12500, sold: 3420, reorder: 5000 },
        { category: "Antibiotics", stock: 8900, sold: 2100, reorder: 3000 },
        { category: "Vaccines", stock: 3450, sold: 890, reorder: 2000 },
        { category: "Insulin", stock: 2300, sold: 650, reorder: 1000 },
        { category: "Other", stock: 5670, sold: 1230, reorder: 2000 },
      ],
      summary: {
        totalValue: "₹45.2L",
        lowStock: 3,
        expiringSoon: 8,
        turnover: "23%",
      },
    },
    carbon: {
      title: "Carbon Footprint Report",
      data: [
        { month: "Jan", emissions: 210, offset: 45 },
        { month: "Feb", emissions: 225, offset: 52 },
        { month: "Mar", emissions: 240, offset: 58 },
        { month: "Apr", emissions: 235, offset: 62 },
        { month: "May", emissions: 245, offset: 68 },
        { month: "Jun", emissions: 230, offset: 72 },
      ],
      summary: {
        total: "1385 tons",
        average: "230.8 tons",
        offset: "357 tons",
        reduction: "15.3%",
      },
    },
    financial: {
      title: "Financial Report",
      data: [
        { month: "Jan", revenue: 425000, expenses: 320000, profit: 105000 },
        { month: "Feb", revenue: 452000, expenses: 335000, profit: 117000 },
        { month: "Mar", revenue: 468000, expenses: 348000, profit: 120000 },
        { month: "Apr", revenue: 485000, expenses: 360000, profit: 125000 },
        { month: "May", revenue: 502000, expenses: 375000, profit: 127000 },
        { month: "Jun", revenue: 525000, expenses: 390000, profit: 135000 },
      ],
      summary: {
        totalRevenue: "₹28.57L",
        totalExpenses: "₹21.28L",
        totalProfit: "₹7.29L",
        margin: "25.5%",
      },
    },
  };

  const currentReport = reports[reportType];

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            className="date-selector"
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <button
              className={`btn-${dateRange === "week" ? "primary" : "secondary"}`}
              onClick={() => setDateRange("week")}
            >
              Week
            </button>
            <button
              className={`btn-${dateRange === "month" ? "primary" : "secondary"}`}
              onClick={() => setDateRange("month")}
            >
              Month
            </button>
            <button
              className={`btn-${dateRange === "quarter" ? "primary" : "secondary"}`}
              onClick={() => setDateRange("quarter")}
            >
              Quarter
            </button>
            <button
              className={`btn-${dateRange === "year" ? "primary" : "secondary"}`}
              onClick={() => setDateRange("year")}
            >
              Year
            </button>
          </div>
          <button className="btn-primary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div
        className="report-nav"
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          className={`btn-${reportType === "shipments" ? "primary" : "secondary"}`}
          onClick={() => setReportType("shipments")}
        >
          <Package size={16} />
          Shipments
        </button>
        <button
          className={`btn-${reportType === "inventory" ? "primary" : "secondary"}`}
          onClick={() => setReportType("inventory")}
        >
          <FileText size={16} />
          Inventory
        </button>
        <button
          className={`btn-${reportType === "carbon" ? "primary" : "secondary"}`}
          onClick={() => setReportType("carbon")}
        >
          <Leaf size={16} />
          Carbon
        </button>
        <button
          className={`btn-${reportType === "financial" ? "primary" : "secondary"}`}
          onClick={() => setReportType("financial")}
        >
          <DollarSign size={16} />
          Financial
        </button>
      </div>

      <motion.div
        key={reportType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {reportType === "shipments" && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(52, 152, 219, 0.1)",
                    color: "#3498db",
                  }}
                >
                  <Package size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Shipments</div>
                  <div className="stat-value">
                    {currentReport.summary.total}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(46, 204, 113, 0.1)",
                    color: "#2ecc71",
                  }}
                >
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Delivery Rate</div>
                  <div className="stat-value">
                    {currentReport.summary.avgDelivery}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(231, 76, 60, 0.1)",
                    color: "#e74c3c",
                  }}
                >
                  <AlertCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Delayed</div>
                  <div className="stat-value">
                    {currentReport.summary.totalDelayed}
                  </div>
                </div>
              </div>
            </>
          )}

          {reportType === "inventory" && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(52, 152, 219, 0.1)",
                    color: "#3498db",
                  }}
                >
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Value</div>
                  <div className="stat-value">
                    {currentReport.summary.totalValue}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(241, 196, 15, 0.1)",
                    color: "#f39c12",
                  }}
                >
                  <AlertCircle size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Low Stock</div>
                  <div className="stat-value">
                    {currentReport.summary.lowStock}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(231, 76, 60, 0.1)",
                    color: "#e74c3c",
                  }}
                >
                  <Calendar size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Expiring Soon</div>
                  <div className="stat-value">
                    {currentReport.summary.expiringSoon}
                  </div>
                </div>
              </div>
            </>
          )}

          {reportType === "carbon" && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(52, 152, 219, 0.1)",
                    color: "#3498db",
                  }}
                >
                  <Leaf size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Total Emissions</div>
                  <div className="stat-value">
                    {currentReport.summary.total}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(46, 204, 113, 0.1)",
                    color: "#2ecc71",
                  }}
                >
                  <TrendingDown size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Carbon Offset</div>
                  <div className="stat-value">
                    {currentReport.summary.offset}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(241, 196, 15, 0.1)",
                    color: "#f39c12",
                  }}
                >
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Reduction</div>
                  <div className="stat-value">
                    {currentReport.summary.reduction}
                  </div>
                </div>
              </div>
            </>
          )}

          {reportType === "financial" && (
            <>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(52, 152, 219, 0.1)",
                    color: "#3498db",
                  }}
                >
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Revenue</div>
                  <div className="stat-value">
                    {currentReport.summary.totalRevenue}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(231, 76, 60, 0.1)",
                    color: "#e74c3c",
                  }}
                >
                  <TrendingDown size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Expenses</div>
                  <div className="stat-value">
                    {currentReport.summary.totalExpenses}
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div
                  className="stat-icon"
                  style={{
                    background: "rgba(46, 204, 113, 0.1)",
                    color: "#2ecc71",
                  }}
                >
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-label">Profit</div>
                  <div className="stat-value">
                    {currentReport.summary.totalProfit}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="table-container">
          <h2>{currentReport.title}</h2>
          <table className="data-table">
            <thead>
              <tr>
                {Object.keys(currentReport.data[0]).map((key) => (
                  <th key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentReport.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="cards-grid"
          style={{ marginTop: "2rem", gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div className="info-card">
            <h3>Summary</h3>
            {Object.entries(currentReport.summary).map(([key, value]) => (
              <div
                key={key}
                className="detail-row"
                style={{ marginTop: "0.5rem" }}
              >
                <span className="detail-label">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="detail-value">
                  <strong>{value}</strong>
                </span>
              </div>
            ))}
          </div>

          <div className="info-card">
            <h3>Export Options</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <button
                className="btn-secondary"
                style={{ justifyContent: "flex-start" }}
              >
                <FileText size={16} /> Export as PDF
              </button>
              <button
                className="btn-secondary"
                style={{ justifyContent: "flex-start" }}
              >
                <Download size={16} /> Export as CSV
              </button>
              <button
                className="btn-secondary"
                style={{ justifyContent: "flex-start" }}
              >
                <BarChart3 size={16} /> View Charts
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportsPage;
