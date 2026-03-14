const { create } = require("ipfs-http-client");
const AES256Encryption = require("./encrypt");

class IPFSManager {
  constructor(projectId, projectSecret) {
    // Connect to IPFS (use Infura or local node)
    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    this.ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    this.encryption = new AES256Encryption();
  }

  // Upload encrypted sensor data to IPFS
  async uploadSensorData(shipmentId, sensorReadings, encryptionKey) {
    try {
      // Prepare data package
      const dataPackage = {
        shipmentId: shipmentId,
        timestamp: Date.now(),
        readings: sensorReadings,
        metadata: {
          deviceType: "IoT Sensor",
          sensorCount: sensorReadings.length,
          encryption: "AES-256-GCM",
        },
      };

      // Convert to JSON string
      const jsonData = JSON.stringify(dataPackage, null, 2);

      // Encrypt data
      const encryptedData = this.encryption.encrypt(jsonData, encryptionKey);

      // Upload to IPFS
      const result = await this.ipfs.add(encryptedData);

      console.log(`Data uploaded to IPFS with CID: ${result.path}`);

      // Pin the data
      await this.ipfs.pin.add(result.path);

      return {
        cid: result.path,
        size: result.size,
        timestamp: dataPackage.timestamp,
      };
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw error;
    }
  }

  // Retrieve and decrypt data from IPFS
  async retrieveSensorData(cid, encryptionKey) {
    try {
      // Download from IPFS
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid)) {
        chunks.push(chunk);
      }

      const encryptedData = Buffer.concat(chunks).toString();

      // Decrypt data
      const decryptedData = this.encryption.decrypt(
        encryptedData,
        encryptionKey,
      );

      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("IPFS retrieval error:", error);
      throw error;
    }
  }

  // Upload organization profile
  async uploadProfile(organizationData, encryptionKey) {
    try {
      const encryptedProfile = this.encryption.encryptProfile(
        organizationData,
        encryptionKey,
      );

      const result = await this.ipfs.add(encryptedProfile);
      await this.ipfs.pin.add(result.path);

      return result.path;
    } catch (error) {
      console.error("Profile upload error:", error);
      throw error;
    }
  }

  // Get file info
  async getFileInfo(cid) {
    try {
      const stats = await this.ipfs.files.stat("/ipfs/" + cid);
      return stats;
    } catch (error) {
      console.error("Error getting file info:", error);
      throw error;
    }
  }
}

module.exports = IPFSManager;
