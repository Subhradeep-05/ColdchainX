import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Activity,
  Calendar,
  Zap,
  Droplets,
  MapPin,
  Wifi,
  WifiOff,
  Package,
} from "lucide-react";
import api from "../../../services/api";
import socketService from "../../../services/socket";
import { useAuth } from "../../../components/context/AuthContext";
import TemperatureChart from "./TemperatureChart";
import "./Pages.css";

const TemperatureMonitorPage = () => {
  const { user } = useAuth();
  const [allReadings, setAllReadings] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]);
  const [stats, setStats] = useState({
    count: 0,
    average: 0,
    max: 0,
    min: 0,
    alerts: 0,
    current: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [viewMode, setViewMode] = useState("all");
  const [error, setError] = useState(null);

  const chartRef = useRef(null);
  const dataEndRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log("🔍 TemperatureMonitorPage mounted");
    console.log("📡 User:", user?.email);
    console.log("🔴 Live mode:", isLive);
    console.log("🔄 Auto refresh:", autoRefresh);
  }, []);

  // Socket connection setup
  useEffect(() => {
    console.log("🔌 Setting up socket connection...");

    // Check if socket is connected
    if (socketService.connected) {
      setConnectionStatus("connected");
    }

    // Socket event listeners
    socketService.on("connect", () => {
      console.log("✅ Socket connected successfully");
      setConnectionStatus("connected");
    });

    socketService.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnectionStatus("disconnected");
    });

    socketService.on("temperature_update", (data) => {
      console.log("📊 Received real-time temperature update:", data);
      handleTemperatureUpdate(data);
    });

    socketService.on("temperature_alert", (alert) => {
      console.log("⚠️ Received temperature alert:", alert);
      handleTemperatureAlert(alert);
    });

    return () => {
      console.log("🔌 Cleaning up socket listeners");
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("temperature_update");
      socketService.off("temperature_alert");
    };
  }, []);

  useEffect(() => {
    if (selectedShipment) {
      // If a specific shipment is selected, join its room
      console.log(`📦 Joining shipment room: ${selectedShipment.shipmentId}`);
      socketService.emit("join_shipment", selectedShipment.shipmentId);
      filterDataByShipment(selectedShipment.shipmentId);

      return () => {
        console.log(`📦 Leaving shipment room: ${selectedShipment.shipmentId}`);
        socketService.emit("leave_shipment", selectedShipment.shipmentId);
      };
    } else {
      // If no shipment selected, show all data
      setTemperatureData(allReadings);
      calculateStats(allReadings);
    }
  }, [selectedShipment, allReadings]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (isLive) {
        console.log("🔄 Auto-refreshing data...");
        refreshData();
      }
    }, 5000); // Refresh every 5 seconds for more real-time feel

    return () => clearInterval(interval);
  }, [autoRefresh, isLive]);

  // Auto-scroll to latest data
  useEffect(() => {
    if (dataEndRef.current && isLive && temperatureData.length > 0) {
      dataEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [temperatureData, isLive]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Loading initial data...");

      // Load shipments first
      console.log("📦 Fetching shipments...");
      const shipmentsResponse = await api.getMyShipments();
      console.log("📦 Shipments response:", shipmentsResponse);

      if (shipmentsResponse.success) {
        setShipments(shipmentsResponse.shipments || []);
      }

      // Load all temperature data
      console.log("🌡️ Fetching temperature data...");
      const tempResponse = await api.getAllTemperatureData();
      console.log("🌡️ Temperature response:", tempResponse);

      if (tempResponse.success) {
        const readings = tempResponse.readings || [];
        console.log(`✅ Found ${readings.length} temperature readings`);

        if (readings.length > 0) {
          console.log("📋 Latest reading:", readings[readings.length - 1]);
        }

        setAllReadings(readings);
        setTemperatureData(readings);
        calculateStats(readings);

        // Extract alerts
        const newAlerts = readings
          .filter((r) => r.temperature > 8 || r.temperature < 2)
          .map((r) => ({
            id: r._id,
            shipmentId: r.shipmentId,
            medicineName: r.medicineName || "Unknown",
            temperature: r.temperature,
            timestamp: r.timestamp,
            type: r.temperature > 8 ? "critical" : "warning",
          }));
        setAlerts(newAlerts.slice(-20).reverse());
        setLastUpdate(new Date());
      } else {
        setError("Failed to load temperature data");
      }
    } catch (error) {
      console.error("❌ Error loading initial data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      console.log("🔄 Refreshing data...");
      const response = await api.getAllTemperatureData();

      if (response.success) {
        const readings = response.readings || [];
        console.log(`📊 Refreshed data: ${readings.length} readings`);

        setAllReadings(readings);

        if (selectedShipment) {
          filterDataByShipment(selectedShipment.shipmentId);
        } else {
          setTemperatureData(readings);
          calculateStats(readings);
        }

        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    }
  };

  const filterDataByShipment = (shipmentId) => {
    const filtered = allReadings.filter((r) => r.shipmentId === shipmentId);
    console.log(
      `📦 Filtered data for shipment ${shipmentId}: ${filtered.length} readings`,
    );
    setTemperatureData(filtered);
    calculateStats(filtered);
  };

  const calculateStats = useCallback((data) => {
    if (data.length === 0) {
      setStats({ count: 0, average: 0, max: 0, min: 0, alerts: 0, current: 0 });
      return;
    }

    const temps = data.map((d) => d.temperature);
    const current = data[data.length - 1]?.temperature || 0;
    const alerts = data.filter(
      (d) => d.temperature > 8 || d.temperature < 2,
    ).length;

    setStats({
      count: data.length,
      average: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2),
      max: Math.max(...temps).toFixed(2),
      min: Math.min(...temps).toFixed(2),
      alerts,
      current: current.toFixed(2),
    });
  }, []);

  const handleTemperatureUpdate = (data) => {
    console.log("📈 Updating with new temperature:", data);

    setAllReadings((prev) => {
      // Check if reading already exists to avoid duplicates
      const exists = prev.some((r) => r._id === data._id);
      if (exists) return prev;

      const newReadings = [...prev, data];
      // Keep only last 1000 readings for performance
      return newReadings.length > 1000 ? newReadings.slice(-1000) : newReadings;
    });

    // Update current view if this shipment is selected or we're in all mode
    if (!selectedShipment || data.shipmentId === selectedShipment.shipmentId) {
      setTemperatureData((prev) => {
        const exists = prev.some((r) => r._id === data._id);
        if (exists) return prev;

        const newData = [...prev, data];
        return newData.length > 1000 ? newData.slice(-1000) : newData;
      });

      // Recalculate stats with the new data
      setTemperatureData((current) => {
        const newData = [...current, data];
        calculateStats(newData);
        return newData;
      });
    }

    setLastUpdate(new Date());

    // Check for alert
    if (data.temperature > 8 || data.temperature < 2) {
      const newAlert = {
        id: data._id || Date.now(),
        shipmentId: data.shipmentId,
        medicineName: data.medicineName || "Unknown",
        temperature: data.temperature,
        timestamp: data.timestamp,
        type: data.temperature > 8 ? "critical" : "warning",
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
    }
  };

  const handleTemperatureAlert = (alert) => {
    console.log("⚠️ New alert:", alert);
    setAlerts((prev) => [alert, ...prev].slice(0, 20));
  };

  const getTemperatureStatus = (temp) => {
    if (!temp) return { status: "unknown", color: "#999", text: "No data" };
    if (temp > 8 || temp < 2)
      return { status: "critical", color: "#e74c3c", text: "Critical" };
    if (temp > 5)
      return { status: "warning", color: "#f39c12", text: "Warning" };
    return { status: "normal", color: "#27ae60", text: "Normal" };
  };

  const handleDeleteAllData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL temperature data? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await api.deleteAllTemperatureData();
      if (response.success) {
        setAllReadings([]);
        setTemperatureData([]);
        setAlerts([]);
        setStats({
          count: 0,
          average: 0,
          max: 0,
          min: 0,
          alerts: 0,
          current: 0,
        });
        alert(`✅ Deleted all temperature readings`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("❌ Failed to delete data");
    }
  };

  const handleExportCSV = () => {
    if (!temperatureData.length) return;

    const headers = [
      "Timestamp",
      "Shipment ID",
      "Temperature (°C)",
      "Humidity (%)",
      "Device ID",
    ];
    const rows = temperatureData.map((d) => [
      new Date(d.timestamp).toLocaleString(),
      d.shipmentId || "N/A",
      d.temperature.toFixed(1),
      d.humidity ? d.humidity.toFixed(1) : "N/A",
      d.deviceId || "esp32-001",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `temperature-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const testConnection = async () => {
    console.log("🔍 Testing connection...");

    try {
      // Test health check
      const health = await api.healthCheck();
      console.log("Health check:", health);

      // Test temperature API
      const tempData = await api.getAllTemperatureData();
      console.log("Temperature data from API:", tempData);

      if (tempData.success && tempData.readings.length > 0) {
        alert(
          `✅ Found ${tempData.readings.length} readings. Check console for details.`,
        );
      } else {
        alert("❌ No readings found or API error. Check console.");
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert("❌ Connection test failed. Check console.");
    }
  };

  const summaryStats = [
    {
      label: "Current",
      value: stats.current ? `${stats.current}°C` : "--",
      icon: Thermometer,
      color:
        stats.current > 8
          ? "#e74c3c"
          : stats.current < 2
            ? "#e74c3c"
            : stats.current > 5
              ? "#f39c12"
              : "#27ae60",
    },
    {
      label: "Average",
      value: stats.average ? `${stats.average}°C` : "--",
      icon: Activity,
      color:
        stats.average > 8
          ? "#e74c3c"
          : stats.average > 5
            ? "#f39c12"
            : "#27ae60",
    },
    {
      label: "Maximum",
      value: stats.max ? `${stats.max}°C` : "--",
      icon: TrendingUp,
      color: stats.max > 8 ? "#e74c3c" : "#27ae60",
    },
    {
      label: "Minimum",
      value: stats.min ? `${stats.min}°C` : "--",
      icon: TrendingUp,
      color: stats.min < 2 ? "#e74c3c" : "#27ae60",
    },
    {
      label: "Readings",
      value: stats.count || 0,
      icon: Clock,
      color: "#3498db",
    },
    {
      label: "Alerts",
      value: stats.alerts || 0,
      icon: AlertCircle,
      color: stats.alerts > 0 ? "#e74c3c" : "#27ae60",
    },
  ];

  if (loading) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading temperature data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <div>
          <h1>Real-Time Temperature Monitor</h1>
          <div
            className="header-status"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginTop: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span className={`connection-badge ${connectionStatus}`}>
              {connectionStatus === "connected" ? (
                <Wifi size={14} />
              ) : (
                <WifiOff size={14} />
              )}
              {connectionStatus === "connected" ? " Live" : " Disconnected"}
            </span>
            {lastUpdate && (
              <span
                className="last-update"
                style={{ color: "var(--taupe)", fontSize: "0.9rem" }}
              >
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <span
              className="reading-count"
              style={{ color: "var(--nude-600)", fontSize: "0.9rem" }}
            >
              <Package size={14} style={{ marginRight: "0.25rem" }} />
              {temperatureData.length} readings
            </span>
            {isLive && (
              <span
                className="live-badge"
                style={{
                  background: "#27ae60",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span
                  className="live-dot"
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "white",
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                  }}
                ></span>
                LIVE
              </span>
            )}
          </div>
          {error && (
            <div style={{ color: "#e74c3c", marginTop: "0.5rem" }}>
              Error: {error}
            </div>
          )}
        </div>
        <div
          className="header-actions"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="time-range-select"
            style={{ minWidth: "120px" }}
          >
            <option value="all">All Shipments</option>
            <option value="shipment">Filter by Shipment</option>
          </select>

          {viewMode === "shipment" && (
            <select
              value={selectedShipment?.shipmentId || ""}
              onChange={(e) => {
                const shipment = shipments.find(
                  (s) => s.shipmentId === e.target.value,
                );
                setSelectedShipment(shipment);
              }}
              className="time-range-select"
              style={{ minWidth: "200px" }}
            >
              <option value="">Select Shipment</option>
              {shipments.map((s) => (
                <option key={s._id} value={s.shipmentId}>
                  {s.medicineName} - #{s.shipmentId}
                </option>
              ))}
            </select>
          )}

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="12h">Last 12 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <button
            className="btn-secondary"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>

          <button
            className="btn-secondary"
            onClick={testConnection}
            style={{ background: "#3498db", color: "white" }}
          >
            Test Connection
          </button>

          <label
            className="checkbox-label"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto
          </label>

          <label
            className="checkbox-label"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={isLive}
              onChange={(e) => setIsLive(e.target.checked)}
            />
            Live
          </label>
        </div>
      </div>

      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="stat-card"
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                className="stat-icon"
                style={{
                  background: `${stat.color}20`,
                  color: stat.color,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  display: "flex",
                }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div
                  className="stat-label"
                  style={{ fontSize: "0.85rem", color: "#666" }}
                >
                  {stat.label}
                </div>
                <div
                  className="stat-value"
                  style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-section" style={{ marginBottom: "2rem" }}>
        <TemperatureChart
          data={temperatureData}
          loading={loading}
          title={
            selectedShipment
              ? `Shipment ${selectedShipment.shipmentId}`
              : "All Shipments"
          }
          isLive={isLive}
        />
      </div>

      <div className="live-readings" style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={20} /> Live Readings
            {isLive && (
              <span
                className="live-badge"
                style={{
                  background: "#27ae60",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span className="live-dot"></span>
                LIVE
              </span>
            )}
          </h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn-secondary"
              onClick={handleExportCSV}
              disabled={!temperatureData.length}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                background: "white",
                cursor: temperatureData.length ? "pointer" : "not-allowed",
              }}
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              className="btn-danger"
              onClick={handleDeleteAllData}
              disabled={!temperatureData.length}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #e74c3c",
                borderRadius: "4px",
                background: "#e74c3c",
                color: "white",
                cursor: temperatureData.length ? "pointer" : "not-allowed",
              }}
            >
              <Trash2 size={16} /> Delete All
            </button>
          </div>
        </div>

        <div
          className="readings-scroll"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          {temperatureData.length === 0 ? (
            <div
              className="empty-message"
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--taupe)",
              }}
            >
              <Thermometer
                size={32}
                style={{ marginBottom: "1rem", opacity: 0.5 }}
              />
              <p>No temperature readings yet</p>
              <p style={{ fontSize: "0.85rem" }}>
                Connect your ESP32 to start monitoring
              </p>
            </div>
          ) : (
            temperatureData
              .slice(-20)
              .reverse()
              .map((reading, idx) => {
                const status = getTemperatureStatus(reading.temperature);
                const isNew = idx === 0 && isLive;
                return (
                  <div
                    key={reading._id || idx}
                    className={`reading-item ${isNew ? "new" : ""}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      borderBottom: "1px solid #eee",
                      animation: isNew ? "highlight 2s ease" : "none",
                      background: isNew
                        ? "rgba(201, 124, 100, 0.1)"
                        : "transparent",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Clock size={14} style={{ color: "var(--taupe)" }} />
                      <span>
                        {new Date(reading.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      {reading.shipmentId && !selectedShipment && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--nude-600)",
                            background: "var(--nude-100)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          #{reading.shipmentId}
                        </span>
                      )}
                      <span style={{ fontWeight: 600, color: status.color }}>
                        {reading.temperature.toFixed(1)}°C
                      </span>
                      {reading.humidity && (
                        <span style={{ color: "var(--taupe)" }}>
                          <Droplets
                            size={14}
                            style={{ marginRight: "0.25rem" }}
                          />
                          {reading.humidity.toFixed(1)}%
                        </span>
                      )}
                      <span
                        className={`status-badge ${status.status}`}
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          background: status.color + "20",
                          color: status.color,
                        }}
                      >
                        {status.text}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
          <div ref={dataEndRef} />
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="table-container">
          <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={20} /> Recent Alerts
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table
              className="data-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Time
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Shipment
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Temperature
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Status
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "0.75rem" }}>
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: "0.75rem" }}>#{alert.shipmentId}</td>
                    <td
                      style={{
                        padding: "0.75rem",
                        color: alert.temperature > 8 ? "#e74c3c" : "#f39c12",
                        fontWeight: 600,
                      }}
                    >
                      {alert.temperature.toFixed(1)}°C
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span
                        className={`status-badge ${alert.temperature > 8 ? "rejected" : "pending"}`}
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          background:
                            alert.temperature > 8 ? "#e74c3c20" : "#f39c1220",
                          color: alert.temperature > 8 ? "#e74c3c" : "#f39c12",
                        }}
                      >
                        {alert.temperature > 8 ? "Critical" : "Warning"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <button
                        className="btn-secondary"
                        style={{
                          padding: "0.25rem 0.5rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          background: "white",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes highlight {
            0% {
              background-color: rgba(201, 124, 100, 0.2);
            }
            100% {
              background-color: transparent;
            }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .live-dot {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            display: inline-block;
            margin-right: 0.25rem;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @media (max-width: 1200px) {
            .stats-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>
    </motion.div>
  );
};

export default TemperatureMonitorPage;
