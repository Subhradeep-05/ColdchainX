// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MedicineShipment is AccessControl, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    bytes32 public constant SHIPMENT_MANAGER_ROLE = keccak256("SHIPMENT_MANAGER_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    bytes32 public constant PHARMACY_ROLE = keccak256("PHARMACY_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    
    Counters.Counter private _shipmentIds;
    
    enum ShipmentStatus { Created, InTransit, Delivered, Verified, Rejected }
    enum TemperatureStatus { Normal, Warning, Critical }
    
    struct Shipment {
        uint256 id;
        address creator;
        string medicineName;
        string batchNumber;
        uint256 expiryDate;
        uint256 quantity;
        address sender;
        address receiver;
        address currentHolder;
        ShipmentStatus status;
        uint256 createdAt;
        uint256 estimatedDelivery;
        uint256 actualDelivery;
        string ipfsHash;
        TemperatureStatus tempStatus;
        uint256 lastTemperature;
        uint256 lastUpdate;
    }
    
    struct TemperatureReading {
        uint256 timestamp;
        uint256 temperature;
        address reportedBy;
    }
    
    // New struct for shipment requests
    struct ShipmentRequest {
        uint256 shipmentId;
        address requester;
        address targetParty;
        string encryptedDetails;
        uint256 requestedAt;
        bool accepted;
        bool rejected;
    }
    
    mapping(uint256 => Shipment) public shipments;
    mapping(uint256 => TemperatureReading[]) public shipmentTemperatures;
    mapping(address => bool) public verifiedOrganizations;
    
    // New mappings for requests
    mapping(uint256 => ShipmentRequest) public shipmentRequests;
    mapping(address => uint256[]) public userRequests;
    
    event ShipmentCreated(uint256 indexed shipmentId, address indexed creator, string medicineName);
    event ShipmentStatusUpdated(uint256 indexed shipmentId, ShipmentStatus status);
    event TemperatureRecorded(uint256 indexed shipmentId, uint256 temperature, uint256 timestamp);
    event OrganizationVerified(address indexed organization, string role);
    event ShipmentDelivered(uint256 indexed shipmentId, address indexed receiver);
    event IPFSUploaded(uint256 indexed shipmentId, string ipfsHash);
    
    // New events for requests
    event ShipmentRequested(uint256 indexed shipmentId, address indexed requester, address indexed targetParty);
    event ShipmentRequestAccepted(uint256 indexed shipmentId, address indexed accepter, bytes signature);
    event ShipmentRequestRejected(uint256 indexed shipmentId, address indexed rejecter);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SHIPMENT_MANAGER_ROLE, msg.sender);
    }
    
    function registerOrganization(string memory role) external {
        if (keccak256(bytes(role)) == keccak256(bytes("HOSPITAL"))) {
            _grantRole(HOSPITAL_ROLE, msg.sender);
        } else if (keccak256(bytes(role)) == keccak256(bytes("PHARMACY"))) {
            _grantRole(PHARMACY_ROLE, msg.sender);
        } else if (keccak256(bytes(role)) == keccak256(bytes("DISTRIBUTOR"))) {
            _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        } else {
            revert("Invalid role");
        }
        
        verifiedOrganizations[msg.sender] = true;
        emit OrganizationVerified(msg.sender, role);
    }
    
    function createShipment(
        string memory medicineName,
        string memory batchNumber,
        uint256 expiryDate,
        uint256 quantity,
        address receiver,
        uint256 estimatedDelivery
    ) external returns (uint256) {
        require(verifiedOrganizations[msg.sender], "Organization not verified");
        require(receiver != address(0), "Invalid receiver");
        require(estimatedDelivery > block.timestamp, "Invalid delivery time");
        
        _shipmentIds.increment();
        uint256 newShipmentId = _shipmentIds.current();
        
        Shipment storage shipment = shipments[newShipmentId];
        shipment.id = newShipmentId;
        shipment.creator = msg.sender;
        shipment.medicineName = medicineName;
        shipment.batchNumber = batchNumber;
        shipment.expiryDate = expiryDate;
        shipment.quantity = quantity;
        shipment.sender = msg.sender;
        shipment.receiver = receiver;
        shipment.currentHolder = msg.sender;
        shipment.status = ShipmentStatus.Created;
        shipment.createdAt = block.timestamp;
        shipment.estimatedDelivery = estimatedDelivery;
        shipment.tempStatus = TemperatureStatus.Normal;
        shipment.lastUpdate = block.timestamp;
        
        emit ShipmentCreated(newShipmentId, msg.sender, medicineName);
        
        return newShipmentId;
    }
    
    function startShipment(uint256 shipmentId) external {
        Shipment storage shipment = shipments[shipmentId];
        require(shipment.creator == msg.sender, "Not authorized");
        require(shipment.status == ShipmentStatus.Created, "Invalid status");
        
        shipment.status = ShipmentStatus.InTransit;
        shipment.lastUpdate = block.timestamp;
        
        emit ShipmentStatusUpdated(shipmentId, ShipmentStatus.InTransit);
    }
    
    function recordTemperature(
        uint256 shipmentId,
        uint256 temperature
    ) external {
        Shipment storage shipment = shipments[shipmentId];
        require(shipment.status == ShipmentStatus.InTransit, "Not in transit");
        
        shipmentTemperatures[shipmentId].push(TemperatureReading({
            timestamp: block.timestamp,
            temperature: temperature,
            reportedBy: msg.sender
        }));
        
        shipment.lastTemperature = temperature;
        shipment.lastUpdate = block.timestamp;
        
        if (temperature > 800) {
            shipment.tempStatus = TemperatureStatus.Critical;
        } else if (temperature > 500) {
            shipment.tempStatus = TemperatureStatus.Warning;
        } else {
            shipment.tempStatus = TemperatureStatus.Normal;
        }
        
        emit TemperatureRecorded(shipmentId, temperature, block.timestamp);
    }
    
    function uploadIPFSHash(uint256 shipmentId, string memory ipfsHash) external {
        Shipment storage shipment = shipments[shipmentId];
        require(shipment.creator == msg.sender || 
                hasRole(SHIPMENT_MANAGER_ROLE, msg.sender), "Not authorized");
        
        shipment.ipfsHash = ipfsHash;
        
        emit IPFSUploaded(shipmentId, ipfsHash);
    }
    
    function deliverShipment(uint256 shipmentId) external {
        Shipment storage shipment = shipments[shipmentId];
        require(shipment.receiver == msg.sender, "Only receiver can confirm");
        require(shipment.status == ShipmentStatus.InTransit, "Not in transit");
        
        shipment.status = ShipmentStatus.Delivered;
        shipment.actualDelivery = block.timestamp;
        shipment.currentHolder = msg.sender;
        
        emit ShipmentDelivered(shipmentId, msg.sender);
        emit ShipmentStatusUpdated(shipmentId, ShipmentStatus.Delivered);
    }
    
    function verifyShipment(uint256 shipmentId, bool approved) external {
        Shipment storage shipment = shipments[shipmentId];
        require(shipment.receiver == msg.sender, "Not receiver");
        require(shipment.status == ShipmentStatus.Delivered, "Not delivered");
        
        shipment.status = approved ? ShipmentStatus.Verified : ShipmentStatus.Rejected;
        
        emit ShipmentStatusUpdated(shipmentId, shipment.status);
    }
    
    // New function to request shipment access
    function requestShipmentAccess(
        uint256 shipmentId,
        address targetParty,
        string memory encryptedDetails
    ) external {
        require(hasRole(HOSPITAL_ROLE, msg.sender) || hasRole(PHARMACY_ROLE, msg.sender), "Not authorized");
        require(shipments[shipmentId].status == ShipmentStatus.Created, "Invalid status");
        
        shipmentRequests[shipmentId] = ShipmentRequest({
            shipmentId: shipmentId,
            requester: msg.sender,
            targetParty: targetParty,
            encryptedDetails: encryptedDetails,
            requestedAt: block.timestamp,
            accepted: false,
            rejected: false
        });
        
        userRequests[targetParty].push(shipmentId);
        emit ShipmentRequested(shipmentId, msg.sender, targetParty);
    }
    
    // New function to accept shipment request
    function acceptShipment(uint256 shipmentId, bytes memory signature) external {
        ShipmentRequest storage request = shipmentRequests[shipmentId];
        require(request.targetParty == msg.sender, "Not authorized");
        require(!request.accepted && !request.rejected, "Already processed");
        
        // Verify signature (would need to implement signature verification)
        request.accepted = true;
        shipments[shipmentId].status = ShipmentStatus.InTransit;
        
        emit ShipmentRequestAccepted(shipmentId, msg.sender, signature);
    }
    
    // New function to reject shipment request
    function rejectShipment(uint256 shipmentId) external {
        ShipmentRequest storage request = shipmentRequests[shipmentId];
        require(request.targetParty == msg.sender, "Not authorized");
        require(!request.accepted && !request.rejected, "Already processed");
        
        request.rejected = true;
        
        emit ShipmentRequestRejected(shipmentId, msg.sender);
    }
    
    // New function to get user's requests
    function getUserRequests(address user) external view returns (uint256[] memory) {
        return userRequests[user];
    }
    
    // New function to get request details
    function getShipmentRequest(uint256 shipmentId) external view returns (ShipmentRequest memory) {
        return shipmentRequests[shipmentId];
    }
    
    // GETTER FUNCTIONS (existing ones remain the same)
    function getShipmentCreator(uint256 shipmentId) external view returns (address) {
        return shipments[shipmentId].creator;
    }
    
    function getShipmentMedicineName(uint256 shipmentId) external view returns (string memory) {
        return shipments[shipmentId].medicineName;
    }
    
    function getShipmentBatchNumber(uint256 shipmentId) external view returns (string memory) {
        return shipments[shipmentId].batchNumber;
    }
    
    function getShipmentExpiryDate(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].expiryDate;
    }
    
    function getShipmentQuantity(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].quantity;
    }
    
    function getShipmentSender(uint256 shipmentId) external view returns (address) {
        return shipments[shipmentId].sender;
    }
    
    function getShipmentReceiver(uint256 shipmentId) external view returns (address) {
        return shipments[shipmentId].receiver;
    }
    
    function getShipmentCurrentHolder(uint256 shipmentId) external view returns (address) {
        return shipments[shipmentId].currentHolder;
    }
    
    function getShipmentStatus(uint256 shipmentId) external view returns (ShipmentStatus) {
        return shipments[shipmentId].status;
    }
    
    function getShipmentCreatedAt(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].createdAt;
    }
    
    function getShipmentEstimatedDelivery(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].estimatedDelivery;
    }
    
    function getShipmentActualDelivery(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].actualDelivery;
    }
    
    function getShipmentIPFS(uint256 shipmentId) external view returns (string memory) {
        return shipments[shipmentId].ipfsHash;
    }
    
    function getShipmentTempStatus(uint256 shipmentId) external view returns (TemperatureStatus) {
        return shipments[shipmentId].tempStatus;
    }
    
    function getShipmentLastTemperature(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].lastTemperature;
    }
    
    function getShipmentLastUpdate(uint256 shipmentId) external view returns (uint256) {
        return shipments[shipmentId].lastUpdate;
    }
    
    function getShipmentCount() external view returns (uint256) {
        return _shipmentIds.current();
    }
    
    function getTemperatureCount(uint256 shipmentId) external view returns (uint256) {
        return shipmentTemperatures[shipmentId].length;
    }
    
    function getTemperatureTimestamp(uint256 shipmentId, uint256 index) external view returns (uint256) {
        require(index < shipmentTemperatures[shipmentId].length, "Index out of bounds");
        return shipmentTemperatures[shipmentId][index].timestamp;
    }
    
    function getTemperatureValue(uint256 shipmentId, uint256 index) external view returns (uint256) {
        require(index < shipmentTemperatures[shipmentId].length, "Index out of bounds");
        return shipmentTemperatures[shipmentId][index].temperature;
    }
    
    function getTemperatureReporter(uint256 shipmentId, uint256 index) external view returns (address) {
        require(index < shipmentTemperatures[shipmentId].length, "Index out of bounds");
        return shipmentTemperatures[shipmentId][index].reportedBy;
    }
}