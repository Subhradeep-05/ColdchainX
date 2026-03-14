const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");
const authMiddleware = require("../middleware/auth");

// GET /api/medicines/search - Search medicines
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;

    let filter = {};
    if (query && query.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { genericName: { $regex: query, $options: "i" } },
          { manufacturer: { $regex: query, $options: "i" } },
        ],
      };
    }

    const medicines = await Medicine.find(filter).limit(50);
    res.json({ success: true, medicines });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/medicines - Get all medicines
router.get("/", authMiddleware, async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json({ success: true, medicines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/medicines/:id - Get single medicine
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/medicines - Add new medicine
router.post("/", authMiddleware, async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/medicines/:id - Update medicine
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/medicines/:id - Delete medicine
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.json({ success: true, message: "Medicine deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
