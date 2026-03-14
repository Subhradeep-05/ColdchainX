import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAuthForm } from "../../hooks/useAuth";
import RoleSelector from "./RoleSelector";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Calendar,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Database,
  Shield,
} from "lucide-react";
import "./SignIn.css";

const roles = [
  { id: "shipment", name: "Shipment Provider" },
  { id: "distributor", name: "Distributor" },
  { id: "hospital", name: "Hospital" },
  { id: "pharmacy", name: "Pharmacy" },
];

const SignIn = ({ onToggle, onSuccess, isModal = false }) => {
  const { signIn } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [ipfsStatus, setIpfsStatus] = useState(null);

  const {
    formData,
    errors,
    loading,
    handleChange,
    setErrors,
    validateEmail,
    validatePhone,
    validateLicense,
  } = useAuthForm({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNumber: "",
    registrationDate: "",
    password: "",
    confirmPassword: "",
    // Role-specific fields
    fleetSize: "",
    insuranceProvider: "",
    warehouseLocations: "",
    storageCapacity: "",
    hospitalType: "",
    bedCapacity: "",
    pharmacistLicense: "",
    pharmacyType: "",
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Invalid phone number (10 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    else if (!validateLicense(formData.licenseNumber))
      newErrors.licenseNumber = "License number must be at least 5 characters";
    if (!formData.registrationDate)
      newErrors.registrationDate = "Registration date is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // Validate role-specific fields
    if (selectedRole === "shipment") {
      if (!formData.fleetSize) newErrors.fleetSize = "Fleet size is required";
      if (!formData.insuranceProvider)
        newErrors.insuranceProvider = "Insurance provider is required";
    } else if (selectedRole === "distributor") {
      if (!formData.warehouseLocations)
        newErrors.warehouseLocations = "Warehouse locations is required";
      if (!formData.storageCapacity)
        newErrors.storageCapacity = "Storage capacity is required";
    } else if (selectedRole === "hospital") {
      if (!formData.hospitalType)
        newErrors.hospitalType = "Hospital type is required";
      if (!formData.bedCapacity)
        newErrors.bedCapacity = "Bed capacity is required";
    } else if (selectedRole === "pharmacy") {
      if (!formData.pharmacistLicense)
        newErrors.pharmacistLicense = "Pharmacist license is required";
      if (!formData.pharmacyType)
        newErrors.pharmacyType = "Pharmacy type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (step === 2) {
      isValid = validateStep2();
    } else if (step === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIpfsStatus("encrypting");

    // Prepare user data for IPFS storage
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      licenseNumber: formData.licenseNumber,
      registrationDate: formData.registrationDate,
      role: selectedRole,
      // Role-specific data
      ...(selectedRole === "shipment" && {
        fleetSize: formData.fleetSize,
        insuranceProvider: formData.insuranceProvider,
      }),
      ...(selectedRole === "distributor" && {
        warehouseLocations: formData.warehouseLocations,
        storageCapacity: formData.storageCapacity,
      }),
      ...(selectedRole === "hospital" && {
        hospitalType: formData.hospitalType,
        bedCapacity: formData.bedCapacity,
      }),
      ...(selectedRole === "pharmacy" && {
        pharmacistLicense: formData.pharmacistLicense,
        pharmacyType: formData.pharmacyType,
      }),
    };

    setIpfsStatus("uploading");

    const result = await signIn({
      ...userData,
      password: formData.password,
    });

    if (result.success) {
      setIpfsStatus("success");
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1000);
    } else {
      setIpfsStatus("error");
      alert("Error creating account: " + result.error);
    }
  };

  const getRoleSpecificFields = () => {
    switch (selectedRole) {
      case "shipment":
        return (
          <>
            <div className="form-group">
              <label>Fleet Size *</label>
              <input
                type="number"
                name="fleetSize"
                placeholder="Number of vehicles"
                value={formData.fleetSize}
                onChange={handleChange}
                className={errors.fleetSize ? "error" : ""}
              />
              {errors.fleetSize && (
                <span className="error-text">{errors.fleetSize}</span>
              )}
            </div>
            <div className="form-group">
              <label>Insurance Provider *</label>
              <input
                type="text"
                name="insuranceProvider"
                placeholder="Insurance company name"
                value={formData.insuranceProvider}
                onChange={handleChange}
                className={errors.insuranceProvider ? "error" : ""}
              />
              {errors.insuranceProvider && (
                <span className="error-text">{errors.insuranceProvider}</span>
              )}
            </div>
          </>
        );

      case "distributor":
        return (
          <>
            <div className="form-group">
              <label>Warehouse Locations *</label>
              <input
                type="text"
                name="warehouseLocations"
                placeholder="Number of warehouses"
                value={formData.warehouseLocations}
                onChange={handleChange}
                className={errors.warehouseLocations ? "error" : ""}
              />
              {errors.warehouseLocations && (
                <span className="error-text">{errors.warehouseLocations}</span>
              )}
            </div>
            <div className="form-group">
              <label>Storage Capacity (tons) *</label>
              <input
                type="number"
                name="storageCapacity"
                placeholder="Total capacity"
                value={formData.storageCapacity}
                onChange={handleChange}
                className={errors.storageCapacity ? "error" : ""}
              />
              {errors.storageCapacity && (
                <span className="error-text">{errors.storageCapacity}</span>
              )}
            </div>
          </>
        );

      case "hospital":
        return (
          <>
            <div className="form-group">
              <label>Hospital Type *</label>
              <select
                name="hospitalType"
                value={formData.hospitalType}
                onChange={handleChange}
                className={errors.hospitalType ? "error" : ""}
              >
                <option value="">Select type</option>
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="teaching">Teaching</option>
                <option value="specialty">Specialty</option>
              </select>
              {errors.hospitalType && (
                <span className="error-text">{errors.hospitalType}</span>
              )}
            </div>
            <div className="form-group">
              <label>Bed Capacity *</label>
              <input
                type="number"
                name="bedCapacity"
                placeholder="Number of beds"
                value={formData.bedCapacity}
                onChange={handleChange}
                className={errors.bedCapacity ? "error" : ""}
              />
              {errors.bedCapacity && (
                <span className="error-text">{errors.bedCapacity}</span>
              )}
            </div>
          </>
        );

      case "pharmacy":
        return (
          <>
            <div className="form-group">
              <label>Pharmacist License *</label>
              <input
                type="text"
                name="pharmacistLicense"
                placeholder="Head pharmacist license"
                value={formData.pharmacistLicense}
                onChange={handleChange}
                className={errors.pharmacistLicense ? "error" : ""}
              />
              {errors.pharmacistLicense && (
                <span className="error-text">{errors.pharmacistLicense}</span>
              )}
            </div>
            <div className="form-group">
              <label>Pharmacy Type *</label>
              <select
                name="pharmacyType"
                value={formData.pharmacyType}
                onChange={handleChange}
                className={errors.pharmacyType ? "error" : ""}
              >
                <option value="">Select type</option>
                <option value="retail">Retail</option>
                <option value="hospital">Hospital-based</option>
                <option value="compounding">Compounding</option>
                <option value="online">Online</option>
              </select>
              {errors.pharmacyType && (
                <span className="error-text">{errors.pharmacyType}</span>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderIpfsStatus = () => {
    if (!ipfsStatus) return null;

    const statusConfig = {
      encrypting: {
        icon: <Lock size={16} />,
        text: "Encrypting data...",
        color: "#f39c12",
      },
      uploading: {
        icon: <Database size={16} />,
        text: "Uploading to IPFS...",
        color: "#3498db",
      },
      success: {
        icon: <CheckCircle size={16} />,
        text: "Data stored securely on IPFS!",
        color: "#27ae60",
      },
      error: {
        icon: <Shield size={16} />,
        text: "Error storing data",
        color: "#e74c3c",
      },
    };

    const config = statusConfig[ipfsStatus];

    return (
      <motion.div
        className={`ipfs-status ${ipfsStatus}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: `${config.color}10`, color: config.color }}
      >
        {config.icon}
        <span>{config.text}</span>
      </motion.div>
    );
  };

  return (
    <div className={`signin-container ${isModal ? "modal-view" : ""}`}>
      <div className="signin-card">
        <div className="signin-header">
          <h2 className="signin-title">Create Account</h2>
          <p className="signin-subtitle">
            Join coldchainX to start managing your supply chain
          </p>
        </div>

        <div className="progress-steps">
          <div
            className={`step ${step >= 1 ? "active" : ""} ${
              step > 1 ? "completed" : ""
            }`}
          >
            <span className="step-number">
              {step > 1 ? <CheckCircle size={16} /> : "1"}
            </span>
            <span className="step-label">Role</span>
          </div>
          <div className={`step-line ${step > 1 ? "active" : ""}`}></div>
          <div
            className={`step ${step >= 2 ? "active" : ""} ${
              step > 2 ? "completed" : ""
            }`}
          >
            <span className="step-number">
              {step > 2 ? <CheckCircle size={16} /> : "2"}
            </span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={`step-line ${step > 2 ? "active" : ""}`}></div>
          <div
            className={`step ${step >= 3 ? "active" : ""} ${
              step > 3 ? "completed" : ""
            }`}
          >
            <span className="step-number">
              {step > 3 ? <CheckCircle size={16} /> : "3"}
            </span>
            <span className="step-label">Details</span>
          </div>
          <div className={`step-line ${step > 3 ? "active" : ""}`}></div>
          <div className={`step ${step >= 4 ? "active" : ""}`}>
            <span className="step-number">4</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RoleSelector
                onSelect={handleRoleSelect}
                selectedRole={selectedRole}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              className="signin-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="form-section-title">Personal Information</h3>

              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                  />
                </div>
                {errors.fullName && (
                  <span className="error-text">{errors.fullName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10 digit number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                    />
                  </div>
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              className="signin-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="form-section-title">Business Information</h3>

              <div className="form-group">
                <label>Company / Organization Name *</label>
                <div className="input-wrapper">
                  <Building2 size={18} className="input-icon" />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={errors.companyName ? "error" : ""}
                  />
                </div>
                {errors.companyName && (
                  <span className="error-text">{errors.companyName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>License Number *</label>
                  <div className="input-wrapper">
                    <FileText size={18} className="input-icon" />
                    <input
                      type="text"
                      name="licenseNumber"
                      placeholder="Business license"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={errors.licenseNumber ? "error" : ""}
                    />
                  </div>
                  {errors.licenseNumber && (
                    <span className="error-text">{errors.licenseNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Registration Date</label>
                  <div className="input-wrapper">
                    <Calendar size={18} className="input-icon" />
                    <input
                      type="date"
                      name="registrationDate"
                      value={formData.registrationDate}
                      onChange={handleChange}
                      className={errors.registrationDate ? "error" : ""}
                    />
                  </div>
                  {errors.registrationDate && (
                    <span className="error-text">
                      {errors.registrationDate}
                    </span>
                  )}
                </div>
              </div>

              {getRoleSpecificFields()}

              <h3 className="form-section-title">Security</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Password *</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className={errors.password ? "error" : ""}
                    />
                  </div>
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Confirm Password *</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? "error" : ""}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.form>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              className="review-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="form-section-title">Review Your Information</h3>

              <div className="review-grid">
                <div className="review-item">
                  <span className="review-label">Role</span>
                  <span className="review-value">
                    {roles.find((r) => r.id === selectedRole)?.name ||
                      selectedRole}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Full Name</span>
                  <span className="review-value">{formData.fullName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone</span>
                  <span className="review-value">{formData.phone}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Company</span>
                  <span className="review-value">{formData.companyName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">License</span>
                  <span className="review-value">{formData.licenseNumber}</span>
                </div>
                {selectedRole === "shipment" && (
                  <>
                    <div className="review-item">
                      <span className="review-label">Fleet Size</span>
                      <span className="review-value">{formData.fleetSize}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Insurance</span>
                      <span className="review-value">
                        {formData.insuranceProvider}
                      </span>
                    </div>
                  </>
                )}
                {selectedRole === "distributor" && (
                  <>
                    <div className="review-item">
                      <span className="review-label">Warehouses</span>
                      <span className="review-value">
                        {formData.warehouseLocations}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Capacity</span>
                      <span className="review-value">
                        {formData.storageCapacity} tons
                      </span>
                    </div>
                  </>
                )}
                {selectedRole === "hospital" && (
                  <>
                    <div className="review-item">
                      <span className="review-label">Hospital Type</span>
                      <span className="review-value">
                        {formData.hospitalType}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Bed Capacity</span>
                      <span className="review-value">
                        {formData.bedCapacity}
                      </span>
                    </div>
                  </>
                )}
                {selectedRole === "pharmacy" && (
                  <>
                    <div className="review-item">
                      <span className="review-label">Pharmacist License</span>
                      <span className="review-value">
                        {formData.pharmacistLicense}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Pharmacy Type</span>
                      <span className="review-value">
                        {formData.pharmacyType}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="ipfs-info">
                <Shield size={16} />
                <span>Your data will be encrypted and stored on IPFS</span>
              </div>

              {renderIpfsStatus()}

              <div className="terms-agreement">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span>
                    I agree to the <a href="#">Terms of Service</a> and{" "}
                    <a href="#">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={handleBack}>
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={
                    !agreedToTerms || loading || ipfsStatus === "uploading"
                  }
                >
                  {loading || ipfsStatus === "uploading"
                    ? "Processing..."
                    : "Create Account"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="signin-footer">
          <p>
            Already have an account?{" "}
            <button onClick={onToggle} className="toggle-link">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
