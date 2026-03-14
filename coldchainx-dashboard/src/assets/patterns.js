// SVG Pattern Definitions for background decorations

export const gridPattern = {
  backgroundImage: `
    radial-gradient(circle at 1px 1px, var(--nude-200) 1px, transparent 0)
  `,
  backgroundSize: "40px 40px",
  opacity: 0.3,
};

export const dotsPattern = {
  backgroundImage: `
    radial-gradient(var(--nude-300) 2px, transparent 2px)
  `,
  backgroundSize: "30px 30px",
  opacity: 0.2,
};

export const wavesPattern = {
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      var(--nude-100) 0px,
      var(--nude-100) 2px,
      transparent 2px,
      transparent 8px
    )
  `,
  backgroundSize: "20px 20px",
  opacity: 0.1,
};

export const diagonalLinesPattern = {
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      var(--nude-200) 0px,
      var(--nude-200) 2px,
      transparent 2px,
      transparent 12px
    )
  `,
  opacity: 0.15,
};

export const crossPattern = {
  backgroundImage: `
    linear-gradient(45deg, var(--nude-200) 1px, transparent 1px),
    linear-gradient(-45deg, var(--nude-200) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
  opacity: 0.1,
};

export const hexagonPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 20 L55 40 L30 55 L5 40 L5 20 Z' stroke='%23e8bcac' fill='none' stroke-width='0.5' opacity='0.2' /%3E%3C/svg%3E`;

export const circuitPattern = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L30 10 M30 10 L30 30 M30 30 L50 30 M50 30 L50 50 M50 50 L70 50 M70 50 L70 70 M70 70 L90 70' stroke='%23da9a85' fill='none' stroke-width='1' opacity='0.15' /%3E%3Ccircle cx='20' cy='20' r='2' fill='%23c97c64' opacity='0.2' /%3E%3Ccircle cx='40' cy='40' r='2' fill='%23c97c64' opacity='0.2' /%3E%3Ccircle cx='60' cy='60' r='2' fill='%23c97c64' opacity='0.2' /%3E%3Ccircle cx='80' cy='80' r='2' fill='%23c97c64' opacity='0.2' /%3E%3C/svg%3E`;

export const leafPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15 Q35 25 30 35 Q25 25 30 15' stroke='%23a69284' fill='none' stroke-width='0.5' opacity='0.15' /%3E%3C/svg%3E`;

export const medicalPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='4' stroke='%23b15f49' fill='none' stroke-width='1' opacity='0.1' /%3E%3Cpath d='M30 20 L30 40 M20 30 L40 30' stroke='%23b15f49' stroke-width='1' opacity='0.1' /%3E%3C/svg%3E`;

// Function to apply pattern to any element
export const applyPattern = (element, pattern, additionalStyles = {}) => {
  if (typeof pattern === "string" && pattern.startsWith("data:image")) {
    // For SVG patterns
    return {
      backgroundImage: `url("${pattern}")`,
      backgroundRepeat: "repeat",
      ...additionalStyles,
    };
  } else {
    // For CSS patterns
    return {
      ...pattern,
      ...additionalStyles,
    };
  }
};

// Pre-defined section backgrounds
export const sectionBackgrounds = {
  hero: {
    background: `linear-gradient(135deg, var(--cream) 0%, var(--sand) 100%)`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("${circuitPattern}")`,
      opacity: 0.3,
      pointerEvents: "none",
    },
  },

  metrics: {
    background: `linear-gradient(135deg, var(--nude-50) 0%, var(--cream) 100%)`,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: dotsPattern.backgroundImage,
      backgroundSize: dotsPattern.backgroundSize,
      opacity: 0.2,
      pointerEvents: "none",
    },
  },

  tracking: {
    background: `linear-gradient(135deg, var(--cream) 0%, var(--sand) 100%)`,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: wavesPattern.backgroundImage,
      backgroundSize: wavesPattern.backgroundSize,
      opacity: 0.15,
      pointerEvents: "none",
    },
  },

  carbon: {
    background: `linear-gradient(135deg, var(--nude-50) 0%, var(--cream) 100%)`,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("${leafPattern}")`,
      opacity: 0.15,
      pointerEvents: "none",
    },
  },

  ai: {
    background: `linear-gradient(135deg, var(--cream) 0%, var(--sand) 100%)`,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: circuitPattern,
      opacity: 0.15,
      pointerEvents: "none",
    },
  },

  shipments: {
    background: `linear-gradient(135deg, var(--nude-50) 0%, var(--cream) 100%)`,
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: medicalPattern,
      opacity: 0.1,
      pointerEvents: "none",
    },
  },
};

// Card pattern styles
export const cardPatterns = {
  default: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(233, 188, 172, 0.03) 10px,
        rgba(233, 188, 172, 0.03) 20px
      )`,
      pointerEvents: "none",
      transform: "rotate(30deg)",
    },
  },

  premium: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(201, 124, 100, 0.2)",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background:
        "linear-gradient(90deg, var(--nude-300), var(--nude-500), var(--nude-300))",
      borderRadius: "3px 3px 0 0",
    },
  },

  glass: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 32px 0 rgba(166, 146, 132, 0.2)",
  },
};

// Gradient combinations
export const gradients = {
  nudeSunset:
    "linear-gradient(135deg, var(--nude-300), var(--nude-500), var(--nude-700))",
  nudeLight: "linear-gradient(135deg, var(--nude-50), var(--nude-200))",
  nudeWarm: "linear-gradient(135deg, var(--nude-100), var(--nude-300))",
  nudeDeep: "linear-gradient(135deg, var(--nude-600), var(--nude-800))",
  creamToSand: "linear-gradient(135deg, var(--cream), var(--sand))",
  nudeGlow:
    "radial-gradient(circle at 30% 30%, var(--nude-200), transparent 70%)",
};

// Usage example in a component:
/*
import { dotsPattern, applyPattern } from '../assets/patterns'

const MyComponent = () => {
  return (
    <div style={applyPattern(dotsPattern, { padding: '20px' })}>
      Content with pattern background
    </div>
  )
}
*/
