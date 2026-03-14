const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Authentication
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["shipment", "distributor", "hospital", "pharmacy"],
    },

    // IPFS Storage
    profileCid: {
      type: String,
      required: true,
    },

    // Personal Information
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    // Business Information
    companyName: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: String,
      required: true,
    },

    // Role-specific fields - Shipment Provider
    fleetSize: {
      type: String,
      default: null,
    },
    insuranceProvider: {
      type: String,
      default: null,
    },

    // Role-specific fields - Distributor
    warehouseLocations: {
      type: String,
      default: null,
    },
    storageCapacity: {
      type: String,
      default: null,
    },

    // Role-specific fields - Hospital
    hospitalType: {
      type: String,
      enum: ["government", "private", "teaching", "specialty", null],
      default: null,
    },
    bedCapacity: {
      type: String,
      default: null,
    },

    // Role-specific fields - Pharmacy
    pharmacistLicense: {
      type: String,
      default: null,
    },
    pharmacyType: {
      type: String,
      enum: ["retail", "hospital", "compounding", "online", null],
      default: null,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Add index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Method to return user without sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model("User", userSchema);
