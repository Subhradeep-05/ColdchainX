import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Shield,
  Truck,
  Building2,
  Pill,
} from "lucide-react";
import "./Login.css";

const roles = [
  { id: "shipment", name: "Shipment Provider", icon: Truck },
  { id: "distributor", name: "Distributor", icon: Building2 },
  { id: "hospital", name: "Hospital", icon: Shield },
  { id: "pharmacy", name: "Pharmacy", icon: Pill },
];

const Login = ({ onToggle, onSuccess, isModal = false }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "shipment",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.role,
      );

      if (result.success) {
        onSuccess && onSuccess();
      } else {
        setErrors({ general: result.error || "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isModal ? "modal-view" : ""}`}>
      <div className="login-card">
        <div className="login-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="login-logo"
          >
            <span className="gradient-text">coldchainX</span>
          </motion.div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your dashboard</p>
        </div>

        {errors.general && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errors.general}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Select Role</label>
            <div className="role-select-wrapper">
              <User size={18} className="select-icon" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={onToggle} className="toggle-link">
              Create Account
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="credentials-grid">
            <div className="cred-item">
              <Truck size={14} />
              <div>
                <span className="cred-role">Shipment:</span>
                <span className="cred-value">shipment@demo.com / pass123</span>
              </div>
            </div>
            <div className="cred-item">
              <Shield size={14} />
              <div>
                <span className="cred-role">Hospital:</span>
                <span className="cred-value">hospital@demo.com / pass123</span>
              </div>
            </div>
            <div className="cred-item">
              <Building2 size={14} />
              <div>
                <span className="cred-role">Distributor:</span>
                <span className="cred-value">
                  distributor@demo.com / pass123
                </span>
              </div>
            </div>
            <div className="cred-item">
              <Pill size={14} />
              <div>
                <span className="cred-role">Pharmacy:</span>
                <span className="cred-value">pharmacy@demo.com / pass123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
