const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/auth");

// Get user notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.post("/read/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
router.post("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true },
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
