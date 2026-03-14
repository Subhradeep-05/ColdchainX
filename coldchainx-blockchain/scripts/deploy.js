const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MedicineShipment contract to Polygon Amoy...");

  const MedicineShipment = await hre.ethers.getContractFactory(
    "MedicineShipment",
  );
  const medicineShipment = await MedicineShipment.deploy();

  await medicineShipment.waitForDeployment();
  const address = await medicineShipment.getAddress();

  console.log("✅ Contract deployed successfully!");
  console.log("📝 CONTRACT ADDRESS:", address);
  console.log(
    "🔗 View on Polygonscan: https://amoy.polygonscan.com/address/" + address,
  );

  // Save address to .env for frontend
  console.log("\n📌 Add this to your frontend .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${address}`);

  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n👤 Deployer address:", deployer.address);
}

main().catch(console.error);
