const crypto = require("crypto");

// AES-256 encryption for sensitive data
class AES256Encryption {
  constructor() {
    this.algorithm = "aes-256-gcm";
  }

  // Generate a secure key from password
  generateKey(password, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16);
    }

    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
    return { key, salt };
  }

  // Encrypt data
  encrypt(text, password) {
    try {
      // Generate salt and key
      const salt = crypto.randomBytes(16);
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

      // Generate IV
      const iv = crypto.randomBytes(12);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      // Get auth tag
      const authTag = cipher.getAuthTag();

      // Combine all components
      const result = {
        salt: salt.toString("hex"),
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        encryptedData: encrypted,
      };

      return Buffer.from(JSON.stringify(result)).toString("base64");
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  // Decrypt data
  decrypt(encryptedData, password) {
    try {
      // Parse encrypted data
      const data = JSON.parse(Buffer.from(encryptedData, "base64").toString());

      // Recreate key from salt
      const salt = Buffer.from(data.salt, "hex");
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

      // Get IV and auth tag
      const iv = Buffer.from(data.iv, "hex");
      const authTag = Buffer.from(data.authTag, "hex");

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt
      let decrypted = decipher.update(data.encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  // Encrypt organization profile
  encryptProfile(organizationData, password) {
    const profileString = JSON.stringify(organizationData);
    return this.encrypt(profileString, password);
  }

  // Decrypt organization profile
  decryptProfile(encryptedProfile, password) {
    const decrypted = this.decrypt(encryptedProfile, password);
    return JSON.parse(decrypted);
  }
}

module.exports = AES256Encryption;
