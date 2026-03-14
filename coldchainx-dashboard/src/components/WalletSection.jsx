import React from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react";
import "./WalletSection.css";

const WalletSection = () => {
  return (
    <motion.div
      className="wallet-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="wallet-header">
        <h2 className="wallet-title">
          <Wallet size={24} />
          Wallet
        </h2>
        <span className="wallet-badge">Connected</span>
      </div>

      <div className="wallet-balance">
        <span className="balance-label">Total Balance</span>
        <div className="balance-amount">
          <span className="amount">45,892</span>
          <span className="currency">cCX</span>
        </div>
      </div>

      <div className="wallet-actions">
        <button className="action-btn send">
          <ArrowUpRight size={20} />
          Send
        </button>
        <button className="action-btn receive">
          <ArrowDownLeft size={20} />
          Receive
        </button>
      </div>

      <div className="recent-transactions">
        <h3 className="transactions-title">Recent Transactions</h3>

        <div className="transaction-list">
          <div className="transaction-item">
            <div className="transaction-icon">
              <ArrowDownLeft size={16} />
            </div>
            <div className="transaction-details">
              <span className="transaction-type">
                Received from Shipment #234
              </span>
              <span className="transaction-date">2 min ago</span>
            </div>
            <span className="transaction-amount positive">+2,500</span>
          </div>

          <div className="transaction-item">
            <div className="transaction-icon">
              <ArrowUpRight size={16} />
            </div>
            <div className="transaction-details">
              <span className="transaction-type">Carbon Credit Purchase</span>
              <span className="transaction-date">1 hour ago</span>
            </div>
            <span className="transaction-amount negative">-850</span>
          </div>

          <div className="transaction-item">
            <div className="transaction-icon">
              <CreditCard size={16} />
            </div>
            <div className="transaction-details">
              <span className="transaction-type">Staked for rewards</span>
              <span className="transaction-date">5 hours ago</span>
            </div>
            <span className="transaction-amount positive">+150</span>
          </div>
        </div>
      </div>

      <button className="view-all-transactions">View All Transactions</button>
    </motion.div>
  );
};

export default WalletSection;
