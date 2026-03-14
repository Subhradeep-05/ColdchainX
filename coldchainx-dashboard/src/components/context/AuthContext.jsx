import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../../services/api";
import filebase from "../../services/filebase";
import encryption from "../../utils/encryption";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profileCid, setProfileCid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await api.verifyToken(token);
          if (data.success) {
            setUser(data.user);
            setRole(data.user.role);
            setProfileCid(data.user.profileCid);
          } else {
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const signIn = async (userData) => {
    try {
      setLoading(true);

      // Generate unique user ID
      const userId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      // Prepare profile data for IPFS
      const profileData = {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        companyName: userData.companyName,
        licenseNumber: userData.licenseNumber,
        registrationDate: userData.registrationDate,
        role: userData.role,
        userId,
        createdAt: new Date().toISOString(),
        // Role-specific data
        ...(userData.role === "shipment" && {
          fleetSize: userData.fleetSize,
          insuranceProvider: userData.insuranceProvider,
        }),
        ...(userData.role === "distributor" && {
          warehouseLocations: userData.warehouseLocations,
          storageCapacity: userData.storageCapacity,
        }),
        ...(userData.role === "hospital" && {
          hospitalType: userData.hospitalType,
          bedCapacity: userData.bedCapacity,
        }),
        ...(userData.role === "pharmacy" && {
          pharmacistLicense: userData.pharmacistLicense,
          pharmacyType: userData.pharmacyType,
        }),
      };

      // Encrypt profile
      const userKey = encryption.generateUserKey(userId, userData.password);
      const encryptedProfile = encryption.encrypt(profileData, userKey);

      // Upload to Filebase
      const filename = `profile-${userId}-${Date.now()}.json`;
      const ipfsResult = await filebase.uploadJSON(encryptedProfile, filename);

      // Send to MongoDB
      const result = await api.signup({
        email: userData.email,
        password: userData.password,
        role: userData.role,
        profileCid: ipfsResult.cid,
        fullName: userData.fullName,
        phone: userData.phone,
        companyName: userData.companyName,
        licenseNumber: userData.licenseNumber,
        registrationDate: userData.registrationDate,
        ...(userData.role === "shipment" && {
          fleetSize: userData.fleetSize,
          insuranceProvider: userData.insuranceProvider,
        }),
        ...(userData.role === "distributor" && {
          warehouseLocations: userData.warehouseLocations,
          storageCapacity: userData.storageCapacity,
        }),
        ...(userData.role === "hospital" && {
          hospitalType: userData.hospitalType,
          bedCapacity: userData.bedCapacity,
        }),
        ...(userData.role === "pharmacy" && {
          pharmacistLicense: userData.pharmacistLicense,
          pharmacyType: userData.pharmacyType,
        }),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Save token and user
      localStorage.setItem("token", result.token);
      setToken(result.token);
      setUser(result.user);
      setRole(result.user.role);
      setProfileCid(result.user.profileCid);

      return { success: true, user: result.user };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      const result = await api.login(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      localStorage.setItem("token", result.token);
      setToken(result.token);
      setUser(result.user);
      setRole(result.user.role);
      setProfileCid(result.user.profileCid);

      return { success: true, user: result.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRole(null);
    setProfileCid(null);
  };

  const value = {
    user,
    role,
    profileCid,
    loading,
    signIn,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
