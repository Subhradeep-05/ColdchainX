const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: [
      "new_shipment_request",
      "shipment_accepted",
      "shipment_picked_up",
      "shipment_delivered",
      "temperature_alert",
      "verification_needed",
      "shipment_verified",
      "shipment_rejected",
    ],
    required: true,
  },
  title: String,
  message: String,
  data: {
    shipmentId: Number,
    shipmentRequestId: mongoose.Schema.Types.ObjectId,
    medicineName: String,
    fromUser: String,
    toUser: String,
    quantity: Number,
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
