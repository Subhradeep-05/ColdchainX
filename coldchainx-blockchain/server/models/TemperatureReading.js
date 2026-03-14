const mongoose = require("mongoose");

const temperatureReadingSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      index: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    deviceId: {
      type: String,
      default: "esp32-001",
    },
    location: {
      type: String,
      default: null,
    },
    batteryLevel: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for efficient queries
temperatureReadingSchema.index({ shipmentId: 1, timestamp: -1 });

module.exports = mongoose.model("TemperatureReading", temperatureReadingSchema);
    