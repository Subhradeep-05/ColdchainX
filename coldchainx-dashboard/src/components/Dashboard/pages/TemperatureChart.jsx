import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Thermometer } from "lucide-react";
import "./Pages.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const TemperatureChart = ({
  data,
  loading,
  title = "Temperature Monitoring",
  isLive = true,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && isLive) {
      const chart = chartRef.current;
      if (chart.data.labels.length > 0) {
        chart.update("active");
      }
    }
  }, [data, isLive]);

  if (loading) {
    return (
      <div
        className="chart-loading"
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="chart-empty"
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "rgba(255,255,255,0.5)",
          borderRadius: "12px",
        }}
      >
        <Thermometer
          size={48}
          style={{ color: "var(--nude-300)", marginBottom: "1rem" }}
        />
        <p>No temperature data available</p>
        <p className="text-muted" style={{ color: "var(--taupe)" }}>
          Connect your ESP32 sensor to start monitoring
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((d) => d.temperature),
        borderColor: "rgb(201, 124, 100)",
        backgroundColor: "rgba(201, 124, 100, 0.1)",
        tension: 0.2,
        fill: true,
        pointRadius: data.length > 100 ? 1 : 3,
        pointHoverRadius: 6,
        pointBackgroundColor: data.map((d) =>
          d.temperature > 8
            ? "#e74c3c"
            : d.temperature < 2
              ? "#e74c3c"
              : d.temperature > 5
                ? "#f39c12"
                : "#27ae60",
        ),
        pointBorderColor: "white",
        borderWidth: 2,
      },
      {
        label: "Upper Limit (8°C)",
        data: data.map(() => 8),
        borderColor: "rgba(231, 76, 60, 0.5)",
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Lower Limit (2°C)",
        data: data.map(() => 2),
        borderColor: "rgba(52, 152, 219, 0.5)",
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isLive ? 300 : 0,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + "°C";
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.max(0, Math.min(...data.map((d) => d.temperature)) - 2),
        max: Math.max(10, Math.max(...data.map((d) => d.temperature)) + 2),
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      line: {
        borderJoinStyle: "round",
      },
    },
  };

  return (
    <div
      className="chart-container"
      style={{
        height: "400px",
        padding: "1rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
      }}
    >
      {isLive && data.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            background: "#27ae60",
            color: "white",
            padding: "0.25rem 0.75rem",
            borderRadius: "100px",
            fontSize: "0.8rem",
            display: "flex",
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
        </div>
      )}
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default TemperatureChart;
