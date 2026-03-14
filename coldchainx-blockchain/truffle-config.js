const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },

    // Polygon Amoy Testnet
    polygon_amoy: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC,
          },
          providerOrUrl: `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          addressIndex: 0,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/60'/0'/0/",
        }),
      network_id: 80002,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 3000000,
      gasPrice: 30000000000, // 30 Gwei
    },

    // Polygon Mainnet
    polygon_mainnet: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC,
          },
          providerOrUrl: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          addressIndex: 0,
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/60'/0'/0/",
        }),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false,
      gas: 5000000,
      gasPrice: 50000000000, // 50 Gwei
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "istanbul",
      },
    },
  },

  // Contract verification on Polygonscan
  plugins: ["truffle-plugin-verify"],

  api_keys: {
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  },
};
