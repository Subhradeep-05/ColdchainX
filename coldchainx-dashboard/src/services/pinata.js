import axios from "axios";

class PinataManager {
  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY;
    this.apiSecret = import.meta.env.VITE_PINATA_SECRET;
    this.jwt = import.meta.env.VITE_PINATA_JWT;
  }

  // Upload JSON data to Pinata
  async uploadJSON(data, filename = "data.json") {
    try {
      const dataStr = typeof data === "string" ? data : JSON.stringify(data);

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([dataStr], { type: "application/json" }),
        filename,
      );

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: this.apiKey,
            pinata_secret_api_key: this.apiSecret,
          },
        },
      );

      console.log("✅ Uploaded to Pinata! CID:", response.data.IpfsHash);
      return {
        cid: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error("Pinata upload error:", error);
      throw error;
    }
  }

  // Upload encrypted user data
  async uploadUserData(userId, data) {
    const filename = `user-${userId}-${Date.now()}.json`;
    return this.uploadJSON(data, filename);
  }

  // Retrieve data from IPFS
  async getData(cid) {
    try {
      const response = await axios.get(
        `https://gateway.pinata.cloud/ipfs/${cid}`,
      );
      return response.data;
    } catch (error) {
      console.error("Pinata retrieval error:", error);
      throw error;
    }
  }

  // Upload with JWT (alternative auth method)
  async uploadWithJWT(data, filename = "data.json") {
    try {
      const dataStr = typeof data === "string" ? data : JSON.stringify(data);

      const formData = new FormData();
      formData.append(
        "file",
        new Blob([dataStr], { type: "application/json" }),
        filename,
      );

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.jwt}`,
          },
        },
      );

      return {
        cid: response.data.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
      };
    } catch (error) {
      console.error("Pinata JWT upload error:", error);
      throw error;
    }
  }
}

export default new PinataManager();
