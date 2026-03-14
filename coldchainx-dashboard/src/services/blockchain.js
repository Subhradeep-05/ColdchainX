import { ethers } from "ethers";
import MedicineShipmentABI from "../abis/MedicineShipment.json";

class BlockchainService {
  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
    this.chainId = null;
  }

  async init() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.address = await this.signer.getAddress();
    this.chainId = await window.ethereum.request({ method: "eth_chainId" });

    this.contract = new ethers.Contract(
      this.contractAddress,
      MedicineShipmentABI.abi, // Note: using .abi property
      this.signer,
    );

    // Listen for account changes
    window.ethereum.on(
      "accountsChanged",
      this.handleAccountsChanged.bind(this),
    );
    window.ethereum.on("chainChanged", this.handleChainChanged.bind(this));

    return this.address;
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.address = null;
      this.signer = null;
    } else {
      this.address = accounts[0];
    }
    window.location.reload();
  }

  handleChainChanged(chainId) {
    window.location.reload();
  }

  // ============ WALLET METHODS ============

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    await this.init();

    return {
      address: this.address,
      chainId: this.chainId,
      network: this.getNetworkName(this.chainId),
    };
  }

  async getBalance() {
    if (!this.provider || !this.address) return "0";
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  async getTransactionHistory(limit = 10) {
    if (!this.contract || !this.address) return [];

    try {
      const createdFilter = this.contract.filters.ShipmentCreated(
        null,
        this.address,
      );
      const createdEvents = await this.contract.queryFilter(
        createdFilter,
        -10000,
      );

      const deliveredFilter = this.contract.filters.ShipmentDelivered(
        null,
        this.address,
      );
      const deliveredEvents = await this.contract.queryFilter(
        deliveredFilter,
        -10000,
      );

      const transactions = [
        ...createdEvents.map((e) => ({
          id: e.transactionHash,
          type: "sent",
          amount: "Contract Creation",
          to: e.args?.receiver,
          date: new Date().toISOString(),
          status: "completed",
          hash: e.transactionHash,
        })),
        ...deliveredEvents.map((e) => ({
          id: e.transactionHash,
          type: "received",
          amount: "Shipment Received",
          from: e.args?.sender,
          date: new Date().toISOString(),
          status: "completed",
          hash: e.transactionHash,
        })),
      ];

      return transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  getNetworkName(chainId) {
    const networks = {
      "0x1": "Ethereum Mainnet",
      "0x5": "Goerli Testnet",
      "0xaa36a7": "Sepolia Testnet",
      "0x89": "Polygon Mainnet",
      "0x13881": "Polygon Mumbai",
      "0x13882": "Polygon Amoy",
    };
    return networks[chainId] || `Unknown Network (${parseInt(chainId, 16)})`;
  }

  formatAddress(address = this.address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
    this.chainId = null;
  }

  // ============ SHIPMENT METHODS ============

  async getShipment(shipmentId) {
    if (!this.contract) await this.init();
    const shipment = await this.contract.shipments(shipmentId);
    return {
      id: shipment.id.toString(),
      creator: shipment.creator,
      medicineName: shipment.medicineName,
      batchNumber: shipment.batchNumber,
      expiryDate: new Date(shipment.expiryDate * 1000).toLocaleDateString(),
      quantity: shipment.quantity.toString(),
      sender: shipment.sender,
      receiver: shipment.receiver,
      currentHolder: shipment.currentHolder,
      status: this.getStatusString(shipment.status),
      createdAt: new Date(shipment.createdAt * 1000).toLocaleString(),
      ipfsHash: shipment.ipfsHash,
    };
  }

  getStatusString(status) {
    const statuses = [
      "Created",
      "InTransit",
      "Delivered",
      "Verified",
      "Rejected",
    ];
    return statuses[status];
  }

  async createShipment(medicineData, receiver, estimatedDelivery) {
    if (!this.contract) await this.init();
    const tx = await this.contract.createShipment(
      medicineData.medicineName,
      medicineData.batchNumber,
      Math.floor(new Date(medicineData.expiryDate).getTime() / 1000),
      medicineData.quantity,
      receiver,
      Math.floor(new Date(estimatedDelivery).getTime() / 1000),
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "ShipmentCreated",
    );
    return {
      shipmentId: event?.args?.shipmentId?.toString(),
      transactionHash: receipt.hash,
    };
  }

  async recordTemperature(shipmentId, temperature) {
    if (!this.contract) await this.init();
    const tempInt = Math.floor(temperature * 100);
    const tx = await this.contract.recordTemperature(shipmentId, tempInt);
    await tx.wait();
    return tx.hash;
  }

  async deliverShipment(shipmentId) {
    if (!this.contract) await this.init();
    const tx = await this.contract.deliverShipment(shipmentId);
    await tx.wait();
    return tx.hash;
  }

  async verifyShipment(shipmentId, approved) {
    if (!this.contract) await this.init();
    const tx = await this.contract.verifyShipment(shipmentId, approved);
    await tx.wait();
    return tx.hash;
  }

  async getShipmentHistory(shipmentId) {
    if (!this.contract) await this.init();
    const filter = this.contract.filters.ShipmentStatusUpdated(shipmentId);
    const events = await this.contract.queryFilter(filter);
    return events.map((event) => ({
      status: this.getStatusString(event.args.status),
      timestamp: new Date(event.args.timestamp * 1000).toLocaleString(),
      transactionHash: event.transactionHash,
    }));
  }

  async getTemperatureHistory(shipmentId) {
    if (!this.contract) await this.init();
    const [timestamps, temperatures] =
      await this.contract.getTemperatureHistory(shipmentId);
    return timestamps.map((timestamp, i) => ({
      timestamp: new Date(timestamp * 1000).toLocaleString(),
      temperature: temperatures[i] / 100,
    }));
  }
}

export default new BlockchainService();
