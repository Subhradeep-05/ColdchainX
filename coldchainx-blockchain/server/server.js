const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Import Models
const User = require("./models/User");
const Notification = require("./models/Notification");
const Medicine = require("./models/Medicine");
const ShipmentRequest = require("./models/ShipmentRequest");
const TemperatureReading = require("./models/TemperatureReading"); // Add this

// Import Routes
const notificationRoutes = require("./routes/notifications");
const medicineRoutes = require("./routes/medicine");
const shipmentRoutes = require("./routes/shipments");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});

// Make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Register Routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/shipments", shipmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// SIGNUP Endpoint
app.post("/api/signup", async (req, res) => {
  try {
    console.log("📝 Signup request received for:", req.body.email);

    const { email, password, role, profileCid, ...profileData } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      role,
      profileCid,
      ...profileData,
    });

    await user.save();
    console.log("✅ User saved to MongoDB with CID:", profileCid);

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profileCid: user.profileCid,
        companyName: user.companyName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ error: error.message });
  }
});

// LOGIN Endpoint
app.post("/api/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt for:", req.body.email);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    console.log("✅ Login successful for:", email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profileCid: user.profileCid,
        companyName: user.companyName,
        phone: user.phone,
        licenseNumber: user.licenseNumber,
        registrationDate: user.registrationDate,
        ...(user.role === "shipment" && {
          fleetSize: user.fleetSize,
          insuranceProvider: user.insuranceProvider,
        }),
        ...(user.role === "distributor" && {
          warehouseLocations: user.warehouseLocations,
          storageCapacity: user.storageCapacity,
        }),
        ...(user.role === "hospital" && {
          hospitalType: user.hospitalType,
          bedCapacity: user.bedCapacity,
        }),
        ...(user.role === "pharmacy" && {
          pharmacistLicense: user.pharmacistLicense,
          pharmacyType: user.pharmacyType,
        }),
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// VERIFY Token Endpoint
app.get("/api/verify", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profileCid: user.profileCid,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ============ TEMPERATURE MONITORING ENDPOINTS ============

// POST /api/temperature - Receive temperature data from ESP32
app.post("/api/temperature", async (req, res) => {
  try {
    const { shipmentId, temperature, humidity, timestamp, deviceId } = req.body;

    console.log(
      `🌡️ Temperature reading received for shipment ${shipmentId}: ${temperature}°C`,
    );

    const reading = new TemperatureReading({
      shipmentId,
      temperature,
      humidity: humidity || null,
      timestamp: new Date(),
      deviceId: deviceId || "esp32-001",
    });

    await reading.save();

    // Emit real-time update via Socket.IO to all users tracking this shipment
    if (req.io) {
      req.io.to(`shipment-${shipmentId}`).emit("temperature_update", {
        shipmentId,
        temperature,
        humidity,
        timestamp: reading.timestamp,
        _id: reading._id,
      });

      // Check for temperature alerts
      if (temperature > 8 || temperature < 2) {
        // Find all users associated with this shipment
        const shipment = await ShipmentRequest.findOne({
          shipmentId: parseInt(shipmentId),
        });
        if (shipment) {
          const alertUsers = [
            shipment.distributorId,
            shipment.shipmentProviderId,
            shipment.hospitalId,
            shipment.pharmacyId,
          ].filter((id) => id);

          // Create alert notification
          for (const userId of alertUsers) {
            const notification = new Notification({
              userId,
              type: "temperature_alert",
              title: "⚠️ Temperature Alert",
              message: `Shipment #${shipmentId} temperature is ${
                temperature > 8 ? "too high" : "too low"
              }: ${temperature}°C`,
              data: {
                shipmentId,
                temperature,
                threshold: temperature > 8 ? "above 8°C" : "below 2°C",
              },
            });
            await notification.save();

            req.io.to(userId.toString()).emit("new_notification", notification);
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Temperature recorded successfully",
      id: reading._id,
    });
  } catch (error) {
    console.error("❌ Error saving temperature:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/temperature/:shipmentId - Get all readings for a shipment
app.get("/api/temperature/:shipmentId", async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { limit = 1000 } = req.query;

    const readings = await TemperatureReading.find({
      shipmentId,
    })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Calculate statistics
    const temps = readings.map((r) => r.temperature);
    const stats = {
      count: readings.length,
      average:
        temps.length > 0
          ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
          : 0,
      max: temps.length > 0 ? Math.max(...temps).toFixed(2) : 0,
      min: temps.length > 0 ? Math.min(...temps).toFixed(2) : 0,
      alerts: readings.filter((r) => r.temperature > 8 || r.temperature < 2)
        .length,
    };

    res.json({
      success: true,
      readings: readings.reverse(), // Return in chronological order
      stats,
    });
  } catch (error) {
    console.error("❌ Error fetching temperature data:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/temperature/:shipmentId/stats - Get only statistics
app.get("/api/temperature/:shipmentId/stats", async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const readings = await TemperatureReading.find({ shipmentId });

    const temps = readings.map((r) => r.temperature);
    const stats = {
      count: readings.length,
      average:
        temps.length > 0
          ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
          : 0,
      max: temps.length > 0 ? Math.max(...temps).toFixed(2) : 0,
      min: temps.length > 0 ? Math.min(...temps).toFixed(2) : 0,
      alerts: readings.filter((r) => r.temperature > 8 || r.temperature < 2)
        .length,
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/temperature/:shipmentId - Delete all readings for a shipment
app.delete("/api/temperature/:shipmentId", async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const result = await TemperatureReading.deleteMany({ shipmentId });

    // Notify via socket
    if (req.io) {
      req.io.to(`shipment-${shipmentId}`).emit("temperature_data_deleted", {
        shipmentId,
        count: result.deletedCount,
      });
    }

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} temperature readings`,
      count: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Error deleting temperature data:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/temperature/live/:shipmentId - SSE endpoint for real-time updates (alternative to Socket.IO)
app.get("/api/temperature/live/:shipmentId", (req, res) => {
  const { shipmentId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: "connected", shipmentId })}\n\n`);

  // Store client for later updates
  const clientId = Date.now();
  const clients = global.sseClients || {};
  if (!global.sseClients) global.sseClients = {};
  global.sseClients[clientId] = { res, shipmentId };

  // Remove client on close
  req.on("close", () => {
    delete global.sseClients[clientId];
  });
});

// ============ SOCKET.IO CONNECTION HANDLER ============
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  const userId = socket.handshake.auth.userId;
  if (userId) {
    socket.join(userId.toString());
    console.log(`👤 User ${userId} joined their room`);
  }

  // Join shipment room for real-time temperature updates
  socket.on("join_shipment", (shipmentId) => {
    socket.join(`shipment-${shipmentId}`);
    console.log(`📦 Socket ${socket.id} joined shipment room: ${shipmentId}`);
  });

  socket.on("leave_shipment", (shipmentId) => {
    socket.leave(`shipment-${shipmentId}`);
    console.log(`📦 Socket ${socket.id} left shipment room: ${shipmentId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST  http://localhost:${PORT}/api/signup`);
  console.log(`   POST  http://localhost:${PORT}/api/login`);
  console.log(`   GET   http://localhost:${PORT}/api/verify`);
  console.log(`   GET   http://localhost:${PORT}/api/health`);
  console.log(`   GET   http://localhost:${PORT}/api/medicines/search`);
  console.log(`   GET   http://localhost:${PORT}/api/medicines`);
  console.log(`   POST  http://localhost:${PORT}/api/medicines`);
  console.log(`   GET   http://localhost:${PORT}/api/shipments/available`);
  console.log(`   GET   http://localhost:${PORT}/api/shipments/my-shipments`);
  console.log(`   POST  http://localhost:${PORT}/api/shipments/create`);
  console.log(`   POST  http://localhost:${PORT}/api/shipments/accept/:id`);
  console.log(
    `   POST  http://localhost:${PORT}/api/shipments/start-transit/:id`,
  );
  console.log(`   POST  http://localhost:${PORT}/api/shipments/deliver/:id`);
  console.log(`   POST  http://localhost:${PORT}/api/shipments/verify/:id`);
  console.log(`   GET   http://localhost:${PORT}/api/notifications`);
  console.log(`   POST  http://localhost:${PORT}/api/notifications/read/:id`);
  console.log(`   🌡️  TEMPERATURE MONITORING:`);
  console.log(`   POST  http://localhost:${PORT}/api/temperature`);
  console.log(`   GET   http://localhost:${PORT}/api/temperature/:shipmentId`);
  console.log(
    `   GET   http://localhost:${PORT}/api/temperature/:shipmentId/stats`,
  );
  console.log(`   DELETE http://localhost:${PORT}/api/temperature/:shipmentId`);
  console.log(
    `   GET   http://localhost:${PORT}/api/temperature/live/:shipmentId (SSE)`,
  );
  console.log(`🔌 Socket.IO server running`);
});
