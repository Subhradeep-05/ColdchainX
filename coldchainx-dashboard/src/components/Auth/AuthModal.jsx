import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Login from "./Login";
import SignIn from "./SignIn";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState("login");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="modal-close" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="auth-modal-content">
              <AnimatePresence mode="wait">
                {authMode === "login" ? (
                  <Login
                    key="login"
                    onToggle={() => setAuthMode("signin")}
                    onSuccess={() => {
                      onClose();
                    }}
                    isModal={true}
                  />
                ) : (
                  <SignIn
                    key="signin"
                    onToggle={() => setAuthMode("login")}
                    onSuccess={() => {
                      onClose();
                    }}
                    isModal={true}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
