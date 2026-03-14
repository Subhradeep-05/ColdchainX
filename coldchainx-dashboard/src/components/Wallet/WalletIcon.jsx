import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";
import "./WalletIcon.css";

const WalletIcon = ({ balance = 2450 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const transactions = [
    {
      id: 1,
      type: "received",
      amount: "+2,500",
      from: "Shipment #234",
      time: "2 min ago",
      status: "completed",
    },
    {
      id: 2,
      type: "sent",
      amount: "-850",
      to: "Carbon Credit",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: 3,
      type: "received",
      amount: "+150",
      from: "Staking Rewards",
      time: "5 hours ago",
      status: "pending",
    },
    {
      id: 4,
      type: "sent",
      amount: "-2,000",
      to: "Fleet Payment",
      time: "1 day ago",
      status: "completed",
    },
  ];

  return (
    <>
      {/* Wallet Icon Button */}
      <motion.button
        className="wallet-icon-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="wallet-icon-container">
          <Wallet size={24} className="wallet-icon" />
          <span className="wallet-badge">{balance}</span>
        </div>
      </motion.button>

      {/* Wallet Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="wallet-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="wallet-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                className="wallet-modal-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>

              <div className="wallet-modal-header">
                <div className="wallet-header-icon">
                  <Wallet size={32} />
                </div>
                <h2>My Wallet</h2>
                <p className="wallet-address">0x7b3c...8f2d4a</p>
              </div>

              <div className="wallet-balance-card">
                <div className="balance-label">Total Balance</div>
                <div className="balance-amount">
                  <span className="amount">{balance.toLocaleString()}</span>
                  <span className="currency">cCX</span>
                </div>
                <div className="balance-usd">≈ $1,225.00 USD</div>
              </div>

              <div className="wallet-tabs">
                <button
                  className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`tab-btn ${activeTab === "transactions" ? "active" : ""}`}
                  onClick={() => setActiveTab("transactions")}
                >
                  Transactions
                </button>
                <button
                  className={`tab-btn ${activeTab === "send" ? "active" : ""}`}
                  onClick={() => setActiveTab("send")}
                >
                  Send
                </button>
                <button
                  className={`tab-btn ${activeTab === "receive" ? "active" : ""}`}
                  onClick={() => setActiveTab("receive")}
                >
                  Receive
                </button>
              </div>

              <div className="wallet-tab-content">
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="overview-tab"
                    >
                      <div className="stats-grid">
                        <div className="stat-card">
                          <TrendingUp size={20} />
                          <div>
                            <span className="stat-label">Total Received</span>
                            <span className="stat-value positive">+12,450</span>
                          </div>
                        </div>
                        <div className="stat-card">
                          <TrendingDown size={20} />
                          <div>
                            <span className="stat-label">Total Sent</span>
                            <span className="stat-value negative">-8,200</span>
                          </div>
                        </div>
                      </div>

                      <div className="quick-actions">
                        <h4>Quick Actions</h4>
                        <div className="action-buttons">
                          <button
                            className="action-btn"
                            onClick={() => setActiveTab("send")}
                          >
                            <Send size={18} />
                            <span>Send</span>
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => setActiveTab("receive")}
                          >
                            <Download size={18} />
                            <span>Receive</span>
                          </button>
                          <button className="action-btn">
                            <QrCode size={18} />
                            <span>Scan</span>
                          </button>
                          <button className="action-btn">
                            <History size={18} />
                            <span>History</span>
                          </button>
                        </div>
                      </div>

                      <div className="recent-transactions-preview">
                        <h4>Recent Transactions</h4>
                        {transactions.slice(0, 3).map((tx) => (
                          <div
                            key={tx.id}
                            className={`preview-item ${tx.type}`}
                          >
                            <div className="preview-icon">
                              {tx.type === "received" ? (
                                <ArrowDownLeft size={14} />
                              ) : (
                                <ArrowUpRight size={14} />
                              )}
                            </div>
                            <div className="preview-details">
                              <span className="preview-desc">
                                {tx.from || tx.to}
                              </span>
                              <span className="preview-time">{tx.time}</span>
                            </div>
                            <span className={`preview-amount ${tx.type}`}>
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "transactions" && (
                    <motion.div
                      key="transactions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="transactions-tab"
                    >
                      <div className="transactions-header">
                        <h4>All Transactions</h4>
                        <button className="filter-btn">Filter</button>
                      </div>
                      <div className="transactions-list">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className={`transaction-item ${tx.status}`}
                          >
                            <div className="transaction-icon-wrapper">
                              {tx.type === "received" ? (
                                <ArrowDownLeft size={16} />
                              ) : (
                                <ArrowUpRight size={16} />
                              )}
                            </div>
                            <div className="transaction-info">
                              <div className="transaction-main">
                                <span className="transaction-desc">
                                  {tx.from || tx.to}
                                </span>
                                <span
                                  className={`transaction-amount ${tx.type}`}
                                >
                                  {tx.amount}
                                </span>
                              </div>
                              <div className="transaction-meta">
                                <span className="transaction-time">
                                  {tx.time}
                                </span>
                                <span
                                  className={`transaction-status ${tx.status}`}
                                >
                                  {tx.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "send" && (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="send-tab"
                    >
                      <div className="send-form">
                        <div className="form-group">
                          <label>Recipient Address</label>
                          <input
                            type="text"
                            placeholder="Enter wallet address"
                          />
                        </div>
                        <div className="form-group">
                          <label>Amount (cCX)</label>
                          <input type="number" placeholder="0.00" />
                        </div>
                        <div className="form-group">
                          <label>Network Fee</label>
                          <div className="fee-options">
                            <button className="fee-option active">Low</button>
                            <button className="fee-option">Medium</button>
                            <button className="fee-option">High</button>
                          </div>
                        </div>
                        <button className="send-submit-btn">
                          <Send size={18} />
                          Send Transaction
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "receive" && (
                    <motion.div
                      key="receive"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="receive-tab"
                    >
                      <div className="qrcode-container">
                        <div className="qrcode-placeholder">
                          <QrCode size={120} />
                        </div>
                        <p className="receive-address">
                          0x7b3c8f9a2e5d1c4b6a8f9e2d3c5b7a1c9e8f2d4a
                        </p>
                        <button className="copy-btn">Copy Address</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="wallet-modal-footer">
                <button className="footer-btn">
                  <CreditCard size={16} />
                  <span>Buy cCX</span>
                </button>
                <button className="footer-btn">
                  <History size={16} />
                  <span>Export</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default WalletIcon;
