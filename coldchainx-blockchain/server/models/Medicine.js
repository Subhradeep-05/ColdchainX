const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genericName: String,
  manufacturer: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "antibiotic",
      "analgesic",
      "antiviral",
      "vaccine",
      "insulin",
      "other",
    ],
    required: true,
  },
  dosageForm: { type: String, required: true }, // tablet, injection, syrup, etc.
  strength: String, // e.g., "500mg"
  storageTemp: {
    type: String,
    enum: ["2-8°C", "15-25°C", "-20°C"],
    required: true,
  },
  requiresPrescription: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Medicine", medicineSchema);
