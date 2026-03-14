const { ethers } = require("ethers");
const MedicineShipment = require("../build/contracts/MedicineShipment.json");
const IPFSManager = require("./ipfs-upload");
const AES256Encryption = require("./encrypt");
require("dotenv").config();

class IoTSimulator {
  constructor(contractAddress, provider) {
    this.provider = new ethers.providers.JsonRpcProvider(provider);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      contractAddress,
      MedicineShipment.abi,
      this.wallet,
    );

    this.ipfs = new IPFSManager(
      process.env.IPFS_PROJECT_ID,
      process.env.IPFS_PROJECT_SECRET,
    );

    this.encryption = new AES256Encryption();
    this.shipmentData = new Map();
  }

  // Generate random temperature (normal range: 2-8°C)
  generateTemperature() {
    const baseTemp = 2 + Math.random() * 6; // 2-8°C
    const random = Math.random();

    if (random < 0.8) {
      return baseTemp; // Normal
    } else if (random < 0.95) {
      return baseTemp + Math.random() * 2; // Warning (8-10°C)
    } else {
      return baseTemp + Math.random() * 5; // Critical (10-13°C)
    }
  }

  // Generate humidity (normal: 40-60%)
  generateHumidity() {
    return 40 + Math.random() * 20;
  }

  // Start monitoring a shipment
  async monitorShipment(shipmentId, duration, interval = 300) {
    console.log(`\n🚀 Starting monitoring for Shipment #${shipmentId}`);
    console.log(`Duration: ${duration} seconds, Interval: ${interval} seconds`);

    const readings = [];
    const startTime = Date.now();

    while (Date.now() - startTime < duration * 1000) {
      try {
        // Generate sensor readings
        const temperature = this.generateTemperature();
        const humidity = this.generateHumidity();
        const location = this.getRandomLocation();

        console.log(`\n📡 Reading at ${new Date().toLocaleTimeString()}`);
        console.log(`   Temperature: ${temperature.toFixed(2)}°C`);
        console.log(`   Humidity: ${humidity.toFixed(2)}%`);
        console.log(`   Location: ${location}`);

        // Record on blockchain
        const tx = await this.contract.recordTemperature(
          shipmentId,
          Math.floor(temperature * 100), // Store as integer to save gas
          Math.floor(humidity * 100),
          location,
        );

        await tx.wait();
        console.log(`   ✅ Recorded on blockchain: ${tx.hash}`);

        // Store reading for IPFS batch upload
        readings.push({
          timestamp: Date.now(),
          temperature,
          humidity,
          location,
        });

        // Upload to IPFS every 10 readings
        if (readings.length >= 10) {
          await this.uploadBatchToIPFS(shipmentId, readings);
          readings.length = 0; // Clear readings
        }
      } catch (error) {
        console.error(`❌ Error recording temperature:`, error.message);
      }

      // Wait for next interval
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }

    // Upload remaining readings
    if (readings.length > 0) {
      await this.uploadBatchToIPFS(shipmentId, readings);
    }

    console.log(`\n✅ Monitoring completed for Shipment #${shipmentId}`);
  }

  // Upload batch of readings to IPFS
  async uploadBatchToIPFS(shipmentId, readings) {
    try {
      console.log(`\n📤 Uploading ${readings.length} readings to IPFS...`);

      const result = await this.ipfs.uploadSensorData(
        shipmentId,
        readings,
        process.env.ENCRYPTION_KEY,
      );

      console.log(`   ✅ Uploaded to IPFS: ${result.cid}`);

      // Update smart contract with IPFS hash
      const tx = await this.contract.uploadIPFSHash(shipmentId, result.cid);
      await tx.wait();

      console.log(`   ✅ IPFS hash recorded on blockchain`);

      // Store for reference
      if (!this.shipmentData.has(shipmentId)) {
        this.shipmentData.set(shipmentId, []);
      }
      this.shipmentData.get(shipmentId).push({
        cid: result.cid,
        count: readings.length,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error(`❌ Error uploading to IPFS:`, error.message);
    }
  }

  // Get random location for simulation
  getRandomLocation() {
    const locations = [
      "Mumbai Warehouse",
      "Delhi Distribution Center",
      "Chennai Cold Storage",
      "Bangalore Transit Hub",
      "Kolkata Port",
      "Hyderabad Facility",
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  // Get monitoring summary
  getSummary(shipmentId) {
    const data = this.shipmentData.get(shipmentId);
    if (!data) return null;

    return {
      shipmentId,
      totalBatches: data.length,
      totalReadings: data.reduce((sum, batch) => sum + batch.count, 0),
      ipfsHashes: data.map((d) => d.cid),
      lastUpdate: new Date().toISOString(),
    };
  }
}

// Run simulation
async function main() {
  const simulator = new IoTSimulator(
    process.env.CONTRACT_ADDRESS,
    "https://polygon-amoy.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
  );

  // Monitor shipment for 1 hour with 30-second intervals
  await simulator.monitorShipment(1, 3600, 30);

  // Get summary
  const summary = simulator.getSummary(1);
  console.log("\n📊 Monitoring Summary:");
  console.log(JSON.stringify(summary, null, 2));
}

// Export for use in frontend
module.exports = IoTSimulator;
