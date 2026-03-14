const MedicineShipment = artifacts.require("MedicineShipment");

contract("MedicineShipment", (accounts) => {
  const [admin, hospital, pharmacy, distributor] = accounts;

  let instance;

  before(async () => {
    instance = await MedicineShipment.deployed();
  });

  it("should register a hospital", async () => {
    const encryptedProfile = "eyJzYWx0Ijoi..."; // Base64 encrypted profile

    await instance.registerOrganization("HOSPITAL", encryptedProfile, {
      from: hospital,
    });

    const isVerified = await instance.verifiedOrganizations(hospital);
    assert.equal(isVerified, true, "Hospital should be verified");
  });

  it("should create a new shipment", async () => {
    const medicine = {
      name: "Paracetamol",
      batchNumber: "BATCH001",
      expiryDate: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
      quantity: 1000,
      manufacturer: "PharmaCorp",
      dosage: "500mg",
      storageRequirements: "2-8°C",
    };

    const encryptedDetails = "eyJpdiI6I..."; // Base64 encrypted details

    const result = await instance.createShipment(
      medicine,
      hospital,
      Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      encryptedDetails,
      { from: distributor },
    );

    const shipmentId = result.logs[0].args.shipmentId.toNumber();
    assert(shipmentId > 0, "Shipment ID should be > 0");

    const shipment = await instance.getShipment(shipmentId);
    assert.equal(shipment.medicineName, "Paracetamol", "Medicine name matches");
  });

  it("should record temperature data", async () => {
    const shipmentId = 1;

    await instance.recordTemperature(
      shipmentId,
      450, // 4.5°C * 100
      5500, // 55% * 100
      "Mumbai Warehouse",
      { from: distributor },
    );

    const history = await instance.getTemperatureHistory(shipmentId);
    assert(history.temperatures.length > 0, "Should have temperature readings");
  });
});
