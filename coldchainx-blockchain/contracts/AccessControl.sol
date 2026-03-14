// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AccessControlContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    struct Permission {
        address user;
        bytes32 role;
        uint256 grantedAt;
        uint256 expiresAt;
        bool active;
    }
    
    mapping(address => Permission[]) public userPermissions;
    mapping(bytes32 => uint256) public roleCount;
    
    event PermissionGranted(address indexed user, bytes32 indexed role, uint256 expiresAt);
    event PermissionRevoked(address indexed user, bytes32 indexed role);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    function grantPermission(
        address user,
        bytes32 role,
        uint256 duration
    ) external onlyRole(ADMIN_ROLE) {
        require(user != address(0), "Invalid user");
        require(!hasRole(role, user), "Already has role");
        
        _grantRole(role, user);
        
        uint256 expiresAt = duration > 0 ? block.timestamp + duration : 0;
        
        userPermissions[user].push(Permission({
            user: user,
            role: role,
            grantedAt: block.timestamp,
            expiresAt: expiresAt,
            active: true
        }));
        
        roleCount[role]++;
        
        emit PermissionGranted(user, role, expiresAt);
    }
    
    function revokePermission(address user, bytes32 role) external onlyRole(ADMIN_ROLE) {
        require(hasRole(role, user), "Does not have role");
        
        _revokeRole(role, user);
        
        Permission[] storage permissions = userPermissions[user];
        for (uint256 i = 0; i < permissions.length; i++) {
            if (permissions[i].role == role && permissions[i].active) {
                permissions[i].active = false;
                break;
            }
        }
        
        roleCount[role]--;
        
        emit PermissionRevoked(user, role);
    }
    
    function checkPermission(address user, bytes32 role) external view returns (bool) {
        return hasRole(role, user);
    }
    
    function getUserPermissions(address user) external view returns (Permission[] memory) {
        return userPermissions[user];
    }
}