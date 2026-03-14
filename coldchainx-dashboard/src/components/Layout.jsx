import React, { useState } from "react";
import Navbar from "./Navbar";
import AuthModal from "./Auth/AuthModal";
import useMouseEffect from "../hooks/useMouseEffect";
import "./Layout.css";

const Layout = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  useMouseEffect();

  return (
    <div className="layout">
      <Navbar onLoginClick={() => setShowAuthModal(true)} />
      <main className="main-content">{children}</main>
      <div className="mouse-glow" id="mouse-glow"></div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Layout;
