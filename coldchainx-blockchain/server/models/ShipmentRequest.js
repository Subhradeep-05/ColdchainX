const mongoose = require("mongoose");

const shipmentRequestSchema = new mongoose.Schema({
  shipmentId: { type: Number, required: true, unique: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
  medicineName: { type: String, required: true },
  batchNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  distributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  distributorName: String,
  shipmentProviderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: [
      "pending_distributor",
      "with_shipment",
      "in_transit",
      "delivered",
      "verified",
      "rejected",
    ],
    default: "pending_distributor",
  },
  storageTemp: String,
  createdAt: { type: Date, default: Date.now },
  acceptedByDistributorAt: Date,
  pickedUpByShipmentAt: Date,
  deliveredToHospitalAt: Date,
  verifiedAt: Date,
  blockchainTxHash: String,
  ipfsHash: String,
  currentLocation: String,
  temperature: Number,
  lastUpdated: Date,
});

module.exports = mongoose.model("ShipmentRequest", shipmentRequestSchema);
