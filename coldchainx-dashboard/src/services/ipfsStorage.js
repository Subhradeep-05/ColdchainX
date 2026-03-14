import ipfs from "../config/ipfs";
import encryption from "../utils/encryption";

class IPFSStorageService {
  constructor() {
    this.ipfs = ipfs;
  }

  // Store user profile on IPFS
  async storeUserProfile(userData, userId, password) {
    try {
      // Generate user-specific encryption key
      const userKey = encryption.generateUserKey(userId, password);

      // Prepare profile data for encryption
      const profileData = {
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        // Don't store password directly
        passwordHash: encryption.hashPassword(password, userId),
      };

      // Remove sensitive data from the object we'll encrypt
      delete profileData.password;
      delete profileData.confirmPassword;

      // Encrypt the profile
      const encryptedProfile = encryption.encrypt(profileData, userKey);

      // Upload to IPFS
      const result = await this.ipfs.add(encryptedProfile);

      // Pin the data
      await this.ipfs.pin.add(result.path);

      console.log(`Profile stored on IPFS with CID: ${result.path}`);

      return {
        cid: result.path.toString(),
        size: result.size,
      };
    } catch (error) {
      console.error("Error storing profile on IPFS:", error);
      throw error;
    }
  }

  // Retrieve user profile from IPFS
  async retrieveUserProfile(cid, userId, password) {
    try {
      // Download from IPFS
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid)) {
        chunks.push(chunk);
      }

      const encryptedData = Buffer.concat(chunks).toString();

      // Generate user key for decryption
      const userKey = encryption.generateUserKey(userId, password);

      // Decrypt the profile
      const decryptedProfile = encryption.decrypt(encryptedData, userKey);

      return decryptedProfile;
    } catch (error) {
      console.error("Error retrieving profile from IPFS:", error);
      throw error;
    }
  }

  // Store role-specific data
  async storeRoleData(role, data, userId, password) {
    try {
      const userKey = encryption.generateUserKey(userId, password);

      const roleData = {
        role,
        data,
        updatedAt: new Date().toISOString(),
      };

      const encryptedData = encryption.encrypt(roleData, userKey);
      const result = await this.ipfs.add(encryptedData);
      await this.ipfs.pin.add(result.path);

      return result.path.toString();
    } catch (error) {
      console.error("Error storing role data:", error);
      throw error;
    }
  }

  // Store shipment documents
  async storeShipmentDocument(shipmentId, document, userId, password) {
    try {
      const userKey = encryption.generateUserKey(userId, password);

      const documentData = {
        shipmentId,
        document,
        timestamp: new Date().toISOString(),
        uploadedBy: userId,
      };

      const encryptedData = encryption.encrypt(documentData, userKey);
      const result = await this.ipfs.add(encryptedData);
      await this.ipfs.pin.add(result.path);

      return result.path.toString();
    } catch (error) {
      console.error("Error storing shipment document:", error);
      throw error;
    }
  }

  // Store organization credentials
  async storeOrgCredentials(orgData, userId, password) {
    try {
      const userKey = encryption.generateUserKey(userId, password);

      const credentials = {
        ...orgData,
        verified: false,
        registeredAt: new Date().toISOString(),
      };

      const encryptedData = encryption.encrypt(credentials, userKey);
      const result = await this.ipfs.add(encryptedData);
      await this.ipfs.pin.add(result.path);

      return result.path.toString();
    } catch (error) {
      console.error("Error storing organization credentials:", error);
      throw error;
    }
  }

  // Update existing profile
  async updateUserProfile(cid, updatedData, userId, password) {
    try {
      // First retrieve existing profile
      const existingProfile = await this.retrieveUserProfile(
        cid,
        userId,
        password,
      );

      // Merge with new data
      const mergedProfile = {
        ...existingProfile,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };

      // Re-encrypt and store
      const userKey = encryption.generateUserKey(userId, password);
      const encryptedProfile = encryption.encrypt(mergedProfile, userKey);

      const result = await this.ipfs.add(encryptedProfile);
      await this.ipfs.pin.add(result.path);

      return {
        newCid: result.path.toString(),
        oldCid: cid,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(cid, userId, password) {
    try {
      const profile = await this.retrieveUserProfile(cid, userId, password);
      const passwordHash = encryption.hashPassword(password, userId);

      return profile.passwordHash === passwordHash;
    } catch (error) {
      console.error("Error verifying password:", error);
      return false;
    }
  }

  // Get file info from IPFS
  async getFileInfo(cid) {
    try {
      const stats = await this.ipfs.files.stat("/ipfs/" + cid);
      return stats;
    } catch (error) {
      console.error("Error getting file info:", error);
      throw error;
    }
  }
}

export default new IPFSStorageService();
