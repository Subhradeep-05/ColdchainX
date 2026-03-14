import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  History,
  QrCode,
  Send,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "../../context/WalletContext";
import "./Pages.css";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const {
    connected,
    address,
    balance,
    formattedBalance,
    shortAddress,
    network,
    chainId,
    transactions,
    loading,
    connectWallet,
    refreshBalance,
    disconnectWallet,
  } = useWallet();

  useEffect(() => {
    if (connected) {
      refreshBalance();
    }
  }, [connected]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const calculateTotals = () => {
    let sent = 0;
    let received = 0;

    transactions.forEach((tx) => {
      const amount = parseFloat(tx.amount) || 0;
      if (tx.type === "sent") {
        sent += amount;
      } else if (tx.type === "received") {
        received += amount;
      }
    });

    return { sent, received };
  };

  const totals = calculateTotals();

  const getExplorerUrl = () => {
    const explorers = {
      "0x1": "https://etherscan.io/address/",
      "0x5": "https://goerli.etherscan.io/address/",
      "0xaa36a7": "https://sepolia.etherscan.io/address/",
      "0x89": "https://polygonscan.com/address/",
      "0x13881": "https://mumbai.polygonscan.com/address/",
      "0x13882": "https://amoy.polygonscan.com/address/",
    };
    return explorers[chainId] || "https://etherscan.io/address/";
  };

  const viewOnExplorer = () => {
    const baseUrl = getExplorerUrl();
    window.open(`${baseUrl}${address}`, "_blank");
  };

  if (!connected) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="connect-wallet-prompt"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "24px",
            border: "1px solid var(--nude-200)",
            maxWidth: "500px",
            margin: "4rem auto",
          }}
        >
          <Wallet
            size={64}
            style={{ color: "var(--nude-400)", marginBottom: "1.5rem" }}
          />
          <h2 style={{ color: "var(--nude-800)", marginBottom: "1rem" }}>
            Connect Your Wallet
          </h2>
          <p
            style={{
              color: "var(--taupe)",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            Connect your MetaMask wallet to view your balance, transactions, and
            interact with the coldchainX platform.
          </p>
          <button
            className="btn-primary"
            onClick={connectWallet}
            disabled={loading}
            style={{ padding: "1rem 3rem", fontSize: "1.1rem" }}
          >
            {loading ? "Connecting..." : "Connect MetaMask"}
          </button>
          <p
            style={{
              marginTop: "2rem",
              fontSize: "0.9rem",
              color: "var(--taupe)",
            }}
          >
            Don't have MetaMask?{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--nude-600)", textDecoration: "none" }}
            >
              Install MetaMask
            </a>
          </p>
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
          <h1>Wallet</h1>
          <div
            className="network-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "var(--nude-100)",
              borderRadius: "100px",
              marginTop: "0.5rem",
            }}
          >
            <span
              className={`network-indicator ${network?.includes("Polygon") ? "polygon" : "ethereum"}`}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: network?.includes("Polygon")
                  ? "#8247e5"
                  : "#627eea",
              }}
            />
            <span style={{ color: "var(--nude-700)" }}>
              {network || "Connected"}
            </span>
          </div>
        </div>
        <button
          className="btn-secondary"
          onClick={disconnectWallet}
          style={{ padding: "0.75rem 1.5rem" }}
        >
          Disconnect
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ gridColumn: "span 2" }}>
          <div
            className="stat-icon"
            style={{
              background: "rgba(201, 124, 100, 0.1)",
              color: "var(--nude-600)",
            }}
          >
            <Wallet size={32} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">
              {formattedBalance}{" "}
              <small style={{ fontSize: "1rem", color: "var(--taupe)" }}>
                {network?.includes("Polygon") ? "POL" : "ETH"}
              </small>
            </div>
            <div
              className="stat-trend"
              style={{ fontSize: "0.9rem", color: "var(--nude-600)" }}
            >
              {shortAddress}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(46, 204, 113, 0.1)", color: "#2ecc71" }}
          >
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Received</div>
            <div className="stat-value">{totals.received.toFixed(4)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(231, 76, 60, 0.1)", color: "#e74c3c" }}
          >
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Sent</div>
            <div className="stat-value">{totals.sent.toFixed(4)}</div>
          </div>
        </div>
      </div>

      <div
        className="wallet-actions"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button
          className="action-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem",
            background: "white",
            border: "1px solid var(--nude-200)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <Send size={20} style={{ color: "var(--nude-600)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--nude-700)" }}>
            Send
          </span>
        </button>
        <button
          className="action-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem",
            background: "white",
            border: "1px solid var(--nude-200)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <Download size={20} style={{ color: "var(--nude-600)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--nude-700)" }}>
            Receive
          </span>
        </button>
        <button
          className="action-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem",
            background: "white",
            border: "1px solid var(--nude-200)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <QrCode size={20} style={{ color: "var(--nude-600)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--nude-700)" }}>
            QR Code
          </span>
        </button>
        <button
          className="action-btn"
          onClick={viewOnExplorer}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem",
            background: "white",
            border: "1px solid var(--nude-200)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <ExternalLink size={20} style={{ color: "var(--nude-600)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--nude-700)" }}>
            Explorer
          </span>
        </button>
      </div>

      <div className="form-container" style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2 className="form-title" style={{ marginBottom: 0 }}>
            Your Wallet Address
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={copyAddress}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
              }}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
        <code
          style={{
            display: "block",
            padding: "1rem",
            background: "var(--nude-100)",
            borderRadius: "12px",
            fontFamily: "monospace",
            wordBreak: "break-all",
            fontSize: "0.9rem",
          }}
        >
          {address}
        </code>
      </div>

      <div className="table-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2>
            <History size={20} /> Transaction History
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn-secondary"
              style={{ padding: "0.5rem 1rem" }}
              onClick={refreshBalance}
            >
              Refresh
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "var(--taupe)",
              background: "var(--nude-50)",
              borderRadius: "12px",
            }}
          >
            <History
              size={48}
              style={{ color: "var(--nude-300)", marginBottom: "1rem" }}
            />
            <h3 style={{ color: "var(--nude-700)", marginBottom: "0.5rem" }}>
              No Transactions Yet
            </h3>
            <p>
              Your transaction history will appear here once you start using the
              platform.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Counterparty</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.id || index}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {tx.type === "received" ? (
                        <ArrowDownLeft size={14} style={{ color: "#27ae60" }} />
                      ) : (
                        <ArrowUpRight size={14} style={{ color: "#e74c3c" }} />
                      )}
                      {tx.type === "received" ? "Received" : "Sent"}
                    </div>
                  </td>
                  <td
                    style={{
                      color: tx.type === "received" ? "#27ae60" : "#e74c3c",
                      fontWeight: "600",
                    }}
                  >
                    {tx.type === "received" ? "+" : "-"}
                    {typeof tx.amount === "number"
                      ? tx.amount.toFixed(4)
                      : tx.amount}
                  </td>
                  <td
                    style={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tx.from || tx.to || "Unknown"}
                  </td>
                  <td>{formatDate(tx.date)}</td>
                  <td>
                    <span
                      className={`status-badge ${tx.status || "completed"}`}
                    >
                      {tx.status || "completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default WalletPage;
