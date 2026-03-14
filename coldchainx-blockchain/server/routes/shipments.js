const express = require("express");
const router = express.Router();
const ShipmentRequest = require("../models/ShipmentRequest");
const Notification = require("../models/Notification");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ============ GET ENDPOINTS ============

// Get available shipments (for shipment providers)
router.get("/available", authMiddleware, async (req, res) => {
  try {
    const shipments = await ShipmentRequest.find({
      status: "pending_distributor",
      shipmentProviderId: { $exists: false },
    }).sort({ createdAt: -1 });
    res.json({ success: true, shipments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active deliveries (for shipment providers)
router.get("/active-deliveries", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const shipments = await ShipmentRequest.find({
      shipmentProviderId: user._id,
      status: { $in: ["with_shipment", "in_transit"] },
    }).sort({ createdAt: -1 });

    res.json({ success: true, shipments });
  } catch (error) {
    console.error("Error fetching active deliveries:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get shipment requests (for distributors)
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const shipments = await ShipmentRequest.find({
      distributorId: user._id,
      status: "pending_distributor",
    }).sort({ createdAt: -1 });

    res.json({ success: true, shipments });
  } catch (error) {
    console.error("Error fetching shipment requests:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's shipments
router.get("/my-shipments", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let query = {};

    switch (user.role) {
      case "distributor":
        query = { distributorId: user._id };
        break;
      case "shipment":
        query = { shipmentProviderId: user._id };
        break;
      case "hospital":
      case "pharmacy":
        query = {
          $or: [{ hospitalId: user._id }, { pharmacyId: user._id }],
        };
        break;
    }

    const shipments = await ShipmentRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, shipments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shipment by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const shipment = await ShipmentRequest.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found" });
    }
    res.json({ success: true, shipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ POST ENDPOINTS ============

// Create shipment request (distributor)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { medicineDetails, quantity, batchNumber, expiryDate } = req.body;
    const distributor = await User.findById(req.userId);

    const shipmentId = Math.floor(Math.random() * 1000000);

    const shipmentRequest = new ShipmentRequest({
      shipmentId,
      medicineId: medicineDetails._id,
      medicineName: medicineDetails.name,
      batchNumber,
      expiryDate,
      quantity,
      distributorId: distributor._id,
      distributorName: distributor.companyName,
      status: "pending_distributor",
      storageTemp: medicineDetails.storageTemp,
    });

    await shipmentRequest.save();

    // Notify all shipment providers
    const shipmentProviders = await User.find({ role: "shipment" });

    for (const provider of shipmentProviders) {
      const notification = new Notification({
        userId: provider._id,
        type: "new_shipment_request",
        title: "New Shipment Available",
        message: `${distributor.companyName} needs a shipment for ${medicineDetails.name}`,
        data: {
          shipmentId,
          shipmentRequestId: shipmentRequest._id,
          medicineName: medicineDetails.name,
          fromUser: distributor.companyName,
          quantity,
        },
      });
      await notification.save();
      req.io.to(provider._id.toString()).emit("new_notification", notification);
    }

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept shipment request (shipment provider)
router.post("/accept/:requestId", authMiddleware, async (req, res) => {
  try {
    const shipmentRequest = await ShipmentRequest.findById(
      req.params.requestId,
    );
    if (!shipmentRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    const provider = await User.findById(req.userId);

    shipmentRequest.shipmentProviderId = provider._id;
    shipmentRequest.status = "with_shipment";
    shipmentRequest.acceptedByDistributorAt = new Date();
    await shipmentRequest.save();

    const notification = new Notification({
      userId: shipmentRequest.distributorId,
      type: "shipment_accepted",
      title: "Shipment Accepted",
      message: `${provider.companyName} has accepted the shipment`,
      data: {
        shipmentId: shipmentRequest.shipmentId,
        medicineName: shipmentRequest.medicineName,
        fromUser: provider.companyName,
      },
    });
    await notification.save();

    req.io
      .to(shipmentRequest.distributorId.toString())
      .emit("new_notification", notification);

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start transit
router.post("/start-transit/:requestId", authMiddleware, async (req, res) => {
  try {
    const shipmentRequest = await ShipmentRequest.findById(
      req.params.requestId,
    );
    shipmentRequest.status = "in_transit";
    shipmentRequest.pickedUpByShipmentAt = new Date();
    await shipmentRequest.save();

    const notification = new Notification({
      userId: shipmentRequest.distributorId,
      type: "shipment_picked_up",
      title: "Shipment In Transit",
      message: `Shipment #${shipmentRequest.shipmentId} is now in transit`,
      data: { shipmentId: shipmentRequest.shipmentId },
    });
    await notification.save();

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update location
router.post("/location/:shipmentId", authMiddleware, async (req, res) => {
  try {
    const { location } = req.body;
    const shipmentRequest = await ShipmentRequest.findById(
      req.params.shipmentId,
    );

    shipmentRequest.currentLocation = location;
    shipmentRequest.lastUpdated = new Date();
    await shipmentRequest.save();

    // Emit location update via socket
    req.io
      .to(`shipment-${shipmentRequest.shipmentId}`)
      .emit("location_update", {
        shipmentId: shipmentRequest.shipmentId,
        location,
        timestamp: new Date(),
      });

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deliver shipment
router.post("/deliver/:requestId", authMiddleware, async (req, res) => {
  try {
    const shipmentRequest = await ShipmentRequest.findById(
      req.params.requestId,
    );
    const receiver = await User.findById(req.userId);

    shipmentRequest.status = "delivered";
    shipmentRequest.deliveredToHospitalAt = new Date();

    if (receiver.role === "hospital") {
      shipmentRequest.hospitalId = receiver._id;
    } else if (receiver.role === "pharmacy") {
      shipmentRequest.pharmacyId = receiver._id;
    }

    await shipmentRequest.save();

    const parties = [
      shipmentRequest.distributorId,
      shipmentRequest.shipmentProviderId,
    ];

    for (const partyId of parties) {
      if (partyId) {
        const notification = new Notification({
          userId: partyId,
          type: "shipment_delivered",
          title: "Shipment Delivered",
          message: `Shipment delivered to ${receiver.companyName}`,
          data: { shipmentId: shipmentRequest.shipmentId },
        });
        await notification.save();
        req.io.to(partyId.toString()).emit("new_notification", notification);
      }
    }

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify shipment
router.post("/verify/:requestId", authMiddleware, async (req, res) => {
  try {
    const { approved } = req.body;
    const shipmentRequest = await ShipmentRequest.findById(
      req.params.requestId,
    );

    shipmentRequest.status = approved ? "verified" : "rejected";
    shipmentRequest.verifiedAt = new Date();
    await shipmentRequest.save();

    const parties = [
      shipmentRequest.distributorId,
      shipmentRequest.shipmentProviderId,
    ];

    for (const partyId of parties) {
      if (partyId) {
        const notification = new Notification({
          userId: partyId,
          type: approved ? "shipment_verified" : "shipment_rejected",
          title: approved ? "Shipment Verified" : "Shipment Rejected",
          message: `Shipment #${shipmentRequest.shipmentId} has been ${
            approved ? "verified" : "rejected"
          }`,
          data: { shipmentId: shipmentRequest.shipmentId },
        });
        await notification.save();
      }
    }

    res.json({ success: true, shipmentRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
