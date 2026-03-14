import React, { createContext, useState, useContext, useEffect } from "react";
import blockchain from "../../services/blockchain";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [network, setNetwork] = useState("");
  const [chainId, setChainId] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const walletData = await blockchain.connectWallet();
      setAddress(walletData.address);
      setChainId(walletData.chainId);
      setNetwork(walletData.network);

      const bal = await blockchain.getBalance();
      setBalance(bal);

      const txs = await blockchain.getTransactionHistory();
      setTransactions(txs);

      setConnected(true);

      // Set up balance refresh interval
      const interval = setInterval(async () => {
        const newBalance = await blockchain.getBalance();
        setBalance(newBalance);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    blockchain.disconnect();
    setConnected(false);
    setAddress("");
    setBalance("0");
    setNetwork("");
    setChainId("");
    setTransactions([]);
  };

  const refreshBalance = async () => {
    if (connected) {
      const bal = await blockchain.getBalance();
      setBalance(bal);
    }
  };

  const formatBalance = (bal) => {
    return parseFloat(bal).toFixed(4);
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const value = {
    connected,
    address,
    balance,
    formattedBalance: formatBalance(balance),
    shortAddress: formatAddress(address),
    network,
    chainId,
    loading,
    transactions,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
