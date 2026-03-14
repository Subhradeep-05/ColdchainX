import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    this.socket = io("http://localhost:5000", {
      auth: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Generic on/off methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    this.socket?.off(event, callback);
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }

  // Specific notification method
  onNewNotification(callback) {
    this.on("new_notification", callback);
  }

  // Shipment specific methods
  onShipmentUpdated(callback) {
    this.on("shipment_updated", callback);
  }

  onNewShipment(callback) {
    this.on("new_shipment_created", callback);
  }

  onTemperatureAlert(callback) {
    this.on("temperature_alert", callback);
  }
}

export default new SocketService();
