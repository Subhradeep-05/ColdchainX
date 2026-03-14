const { ethers } = require("ethers");
const MedicineShipment = require("../artifacts/contracts/MedicineShipment.sol/MedicineShipment.json");
const mongoose = require("mongoose");
const Notification = require("../server/models/Notification");
const User = require("../server/models/User");
require("dotenv").config();

async function listenToEvents() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ALCHEMY_API_URL,
  );
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    MedicineShipment.abi,
    provider,
  );

  // Listen for ShipmentCreated events
  contract.on("ShipmentCreated", async (shipmentId, creator, medicineName) => {
    console.log(`New shipment created: ${shipmentId}`);

    // Find all potential receivers in MongoDB
    const receivers = await User.find({
      role: { $in: ["hospital", "pharmacy"] },
    });

    // Create notifications for all eligible receivers
    for (const receiver of receivers) {
      const notification = new Notification({
        userId: receiver._id,
        type: "shipment_available",
        title: "New Shipment Available",
        message: `A new shipment of ${medicineName} is available`,
        data: { shipmentId: shipmentId.toNumber(), creator },
      });
      await notification.save();
    }
  });

  // Listen for ShipmentRequestAccepted events
  contract.on(
    "ShipmentRequestAccepted",
    async (shipmentId, accepter, signature) => {
      console.log(`Shipment ${shipmentId} accepted by ${accepter}`);
      // Update MongoDB records
    },
  );
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  listenToEvents();
});
