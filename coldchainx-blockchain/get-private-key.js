const { ethers } = require("ethers");

// Your seed phrase
const mnemonic =
  "decide uncle improve fatigue memory invite isolate dash again pony rebuild wash";

try {
  const wallet = ethers.Wallet.fromPhrase(mnemonic);
  console.log("✅ SUCCESS!");
  console.log("========================");
  console.log("Address:     ", wallet.address);
  console.log("Private Key: ", wallet.privateKey);
  console.log("========================");
  console.log("\n📝 Add this to your .env file:");
  console.log(`PRIVATE_KEY=${wallet.privateKey}`);
} catch (error) {
  console.error("Error:", error.message);
}
