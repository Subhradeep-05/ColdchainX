const dotenv = require("dotenv");
const path = require("path");

// Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, ".env") });

// NOW check the variables after loading
console.log("🔍 Environment Check:");
console.log(
  "POLYGON_AMOY_RPC:",
  process.env.POLYGON_AMOY_RPC ? "✅ Loaded" : "❌ MISSING",
);
console.log(
  "PRIVATE_KEY:",
  process.env.PRIVATE_KEY ? "✅ Loaded" : "❌ MISSING",
);
console.log(
  "POLYGONSCAN_API_KEY:",
  process.env.POLYGONSCAN_API_KEY ? "✅ Loaded" : "❌ MISSING",
);
console.log(
  "ALCHEMY_API_KEY:",
  process.env.ALCHEMY_API_KEY ? "✅ Loaded" : "❌ MISSING",
);

if (process.env.PRIVATE_KEY) {
  console.log(
    "PRIVATE_KEY starts with:",
    process.env.PRIVATE_KEY.substring(0, 10) + "...",
  );
}
if (process.env.POLYGON_AMOY_RPC) {
  console.log("RPC URL exists, length:", process.env.POLYGON_AMOY_RPC.length);
}

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // ← ADD THIS LINE to fix stack too deep
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_amoy: {
      url: process.env.POLYGON_AMOY_RPC || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
};
