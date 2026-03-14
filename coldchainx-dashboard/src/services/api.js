const API_URL = "http://localhost:5000/api";

class ApiService {
  // ============ AUTH APIs ============
  async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");
      return data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      return data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Token verification failed");
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  }

  // ============ MEDICINE APIs ============
  async searchMedicines(query) {
    const response = await fetch(
      `${API_URL}/medicines/search?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      },
    );
    return response.json();
  }

  async getAllMedicines() {
    const response = await fetch(`${API_URL}/medicines`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getMedicineById(id) {
    const response = await fetch(`${API_URL}/medicines/${id}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async createMedicine(data) {
    const response = await fetch(`${API_URL}/medicines`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updateMedicine(id, data) {
    const response = await fetch(`${API_URL}/medicines/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteMedicine(id) {
    const response = await fetch(`${API_URL}/medicines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    return response.json();
  }

  // ============ USER APIs ============
  async getUsersByRole(role) {
    const response = await fetch(`${API_URL}/users/role/${role}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getUserProfile(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async updateUserProfile(userId, data) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // ============ SHIPMENT APIs ============
  async createShipment(data) {
    const response = await fetch(`${API_URL}/shipments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getMyShipments() {
    const response = await fetch(`${API_URL}/shipments/my-shipments`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getAvailableShipments() {
    const response = await fetch(`${API_URL}/shipments/available`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getActiveDeliveries() {
    // ← ADDED THIS MISSING METHOD
    const response = await fetch(`${API_URL}/shipments/active-deliveries`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getShipmentRequests() {
    // ← ADDED THIS FOR COMPLETENESS
    const response = await fetch(`${API_URL}/shipments/requests`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getShipmentById(shipmentId) {
    const response = await fetch(`${API_URL}/shipments/${shipmentId}`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async acceptShipment(requestId) {
    const response = await fetch(`${API_URL}/shipments/accept/${requestId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async startTransit(requestId) {
    const response = await fetch(
      `${API_URL}/shipments/start-transit/${requestId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.getToken()}` },
      },
    );
    return response.json();
  }

  async deliverShipment(requestId) {
    const response = await fetch(`${API_URL}/shipments/deliver/${requestId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async verifyShipment(requestId, approved) {
    const response = await fetch(`${API_URL}/shipments/verify/${requestId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ approved }),
    });
    return response.json();
  }

  async updateShipmentLocation(shipmentId, location) {
    const response = await fetch(
      `${API_URL}/shipments/location/${shipmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ location }),
      },
    );
    return response.json();
  }

  async recordTemperature(shipmentId, temperature) {
    const response = await fetch(
      `${API_URL}/shipments/temperature/${shipmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ temperature }),
      },
    );
    return response.json();
  }

  // ============ NOTIFICATION APIs ============
  async getNotifications() {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getUnreadCount() {
    const response = await fetch(`${API_URL}/notifications/unread`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async markNotificationRead(notificationId) {
    const response = await fetch(
      `${API_URL}/notifications/read/${notificationId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.getToken()}` },
      },
    );
    return response.json();
  }

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async deleteNotification(notificationId) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  // Add this to your api.js file

  // ============ TEMPERATURE APIs ============
  async getTemperatureData(shipmentId, timeRange) {
    let url = `${API_URL}/temperature/${shipmentId}`;
    if (timeRange) {
      url += `?limit=${timeRange}`;
    }
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async getTemperatureStats(shipmentId) {
    const response = await fetch(`${API_URL}/temperature/${shipmentId}/stats`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  async deleteTemperatureData(shipmentId) {
    const response = await fetch(`${API_URL}/temperature/${shipmentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  // Get all temperature data (no shipment filter)
  async getAllTemperatureData() {
    try {
      const response = await fetch(`${API_URL}/temperature/all`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          "API response not OK:",
          response.status,
          response.statusText,
        );
        return { success: false, readings: [] };
      }

      const data = await response.json();
      return { success: true, readings: data.readings || data };
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      return { success: false, readings: [], error: error.message };
    }
  }

  // Delete all temperature data
  async deleteAllTemperatureData() {
    try {
      const response = await fetch(`${API_URL}/temperature/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { success: false, message: "Failed to delete data" };
      }

      const data = await response.json();
      return { success: true, ...data };
    } catch (error) {
      console.error("Error deleting temperature data:", error);
      return { success: false, error: error.message };
    }
  }

  // Add a test endpoint to verify connection
  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Health check failed:", error);
      return { success: false, error: error.message };
    }
  }

  // ============ UTILITY ============
  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  // ============ HEALTH CHECK ============
  async healthCheck() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  }
  // ============ ADD THESE METHODS TO YOUR API.JS ============

  // Get all temperature data (no shipment filter)
  async getAllTemperatureData() {
    const response = await fetch(`${API_URL}/temperature/all`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }

  // Delete all temperature data
  async deleteAllTemperatureData() {
    const response = await fetch(`${API_URL}/temperature/all`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response.json();
  }
}

export default new ApiService();
