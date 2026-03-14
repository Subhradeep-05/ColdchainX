import { useState } from "react";

export const useAuthForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validateLicense = (license) => {
    return license && license.length >= 5;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    handleChange,
    validateEmail,
    validatePhone,
    validateLicense,
  };
};
