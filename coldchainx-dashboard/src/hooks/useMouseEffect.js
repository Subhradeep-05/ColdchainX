import { useEffect } from "react";

const useMouseEffect = () => {
  useEffect(() => {
    const glow = document.getElementById("mouse-glow");

    const handleMouseMove = (e) => {
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    };

    const handleMouseLeave = () => {
      if (glow) {
        glow.style.opacity = "0";
      }
    };

    const handleMouseEnter = () => {
      if (glow) {
        glow.style.opacity = "1";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);
};

export default useMouseEffect;
