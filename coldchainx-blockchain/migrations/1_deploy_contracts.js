const MedicineShipment = artifacts.require("MedicineShipment");
const AccessControl = artifacts.require("AccessControlContract");

module.exports = async function (deployer, network, accounts) {
  console.log(`Deploying to network: ${network}`);
  console.log(`Deployer address: ${accounts[0]}`);

  // Deploy AccessControl first
  await deployer.deploy(AccessControl);
  console.log(`AccessControl deployed at: ${AccessControl.address}`);

  // Deploy MedicineShipment
  await deployer.deploy(MedicineShipment);
  console.log(`MedicineShipment deployed at: ${MedicineShipment.address}`);

  // Setup initial roles
  const medicineShipment = await MedicineShipment.deployed();
  const accessControl = await AccessControl.deployed();

  // Grant SHIPMENT_MANAGER_ROLE to deployer
  const SHIPMENT_MANAGER_ROLE = await medicineShipment.SHIPMENT_MANAGER_ROLE();
  await medicineShipment.grantRole(SHIPMENT_MANAGER_ROLE, accounts[0]);

  console.log("Initial roles configured");
};
