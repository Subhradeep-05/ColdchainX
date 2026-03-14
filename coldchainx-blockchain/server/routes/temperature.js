const express = require("express");
const router = express.Router();
const TemperatureReading = require("../models/TemperatureReading");
const auth = require("../middleware/auth");
const ShipmentRequest = require("../models/ShipmentRequest");

// ============ PUBLIC ENDPOINT FOR ESP32 (NO AUTH REQUIRED) ============
// POST /api/temperature - Receive temperature data from ESP32
router.post("/", async (req, res) => {
  try {
    const {
      shipmentId,
      temperature,
      humidity,
      deviceId,
      location,
      batteryLevel,
    } = req.body;

    // Validate required fields
    if (!shipmentId || temperature === undefined) {
      return res.status(400).json({
        success: false,
        error: "shipmentId and temperature are required",
      });
    }

    // Create new temperature reading
    const reading = new TemperatureReading({
      shipmentId,
      temperature: parseFloat(temperature),
      humidity: humidity ? parseFloat(humidity) : null,
      deviceId: deviceId || "esp32-001",
      location: location || null,
      batteryLevel: batteryLevel ? parseFloat(batteryLevel) : null,
      timestamp: new Date(),
    });

    await reading.save();

    // Check if temperature is out of range (2°C - 8°C)
    const isOutOfRange = temperature < 2 || temperature > 8;

    if (isOutOfRange) {
      // You could trigger notifications here
      console.log(
        `⚠️ ALERT: Temperature out of range for shipment ${shipmentId}: ${temperature}°C`,
      );
    }

    res.status(201).json({
      success: true,
      message: "Temperature reading saved successfully",
      reading,
      alert: isOutOfRange ? "Temperature out of range" : null,
    });
  } catch (error) {
    console.error("Error saving temperature reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save temperature reading",
    });
  }
});

// ============ AUTHENTICATED ENDPOINTS FOR DASHBOARD ============

// GET /api/temperature/all - Get all temperature readings (for dashboard)
router.get("/all", auth, async (req, res) => {
  try {
    const { limit = 100, page = 1 } = req.query;

    const readings = await TemperatureReading.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await TemperatureReading.countDocuments();

    res.json({
      success: true,
      readings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching temperature readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch temperature readings",
    });
  }
});

// GET /api/temperature/shipment/:shipmentId - Get readings for specific shipment
router.get("/shipment/:shipmentId", auth, async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { limit = 100, from, to } = req.query;

    let query = { shipmentId };

    // Add date range filter if provided
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const readings = await TemperatureReading.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Calculate statistics
    const stats = {
      count: readings.length,
      average: 0,
      max: -Infinity,
      min: Infinity,
      outOfRange: 0,
    };

    if (readings.length > 0) {
      const temps = readings.map((r) => r.temperature);
      stats.average = temps.reduce((a, b) => a + b, 0) / temps.length;
      stats.max = Math.max(...temps);
      stats.min = Math.min(...temps);
      stats.outOfRange = temps.filter((t) => t < 2 || t > 8).length;
    }

    res.json({
      success: true,
      shipmentId,
      readings,
      stats,
    });
  } catch (error) {
    console.error("Error fetching shipment readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shipment readings",
    });
  }
});

// GET /api/temperature/:readingId - Get single reading by ID
router.get("/:readingId", auth, async (req, res) => {
  try {
    const reading = await TemperatureReading.findById(req.params.readingId);

    if (!reading) {
      return res.status(404).json({
        success: false,
        error: "Reading not found",
      });
    }

    res.json({
      success: true,
      reading,
    });
  } catch (error) {
    console.error("Error fetching temperature reading:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch temperature reading",
    });
  }
});

// GET /api/temperature/shipment/:shipmentId/stats - Get statistics for shipment
router.get("/shipment/:shipmentId/stats", auth, async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { from, to } = req.query;

    let query = { shipmentId };
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const readings = await TemperatureReading.find(query).sort({
      timestamp: -1,
    });

    if (readings.length === 0) {
      return res.json({
        success: true,
        shipmentId,
        stats: {
          count: 0,
          average: 0,
          max: 0,
          min: 0,
          outOfRange: 0,
          current: 0,
        },
      });
    }

    const temps = readings.map((r) => r.temperature);
    const current = readings[0]?.temperature || 0;
    const outOfRange = temps.filter((t) => t < 2 || t > 8).length;

    res.json({
      success: true,
      shipmentId,
      stats: {
        count: readings.length,
        average: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2),
        max: Math.max(...temps).toFixed(2),
        min: Math.min(...temps).toFixed(2),
        outOfRange,
        current: current.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Error calculating temperature stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate statistics",
    });
  }
});

// DELETE /api/temperature/shipment/:shipmentId - Delete all readings for a shipment
router.delete("/shipment/:shipmentId", auth, async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const result = await TemperatureReading.deleteMany({ shipmentId });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} temperature readings for shipment ${shipmentId}`,
    });
  } catch (error) {
    console.error("Error deleting temperature readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete temperature readings",
    });
  }
});

// DELETE /api/temperature/all - Delete ALL temperature readings (careful!)
router.delete("/all", auth, async (req, res) => {
  try {
    // Optional: Add admin check here
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }

    const result = await TemperatureReading.deleteMany({});

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} temperature readings`,
    });
  } catch (error) {
    console.error("Error deleting all temperature readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete temperature readings",
    });
  }
});

// DELETE /api/temperature/old - Delete readings older than specified days
router.delete("/old", auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await TemperatureReading.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} readings older than ${days} days`,
    });
  } catch (error) {
    console.error("Error deleting old readings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete old readings",
    });
  }
});

module.exports = router;
