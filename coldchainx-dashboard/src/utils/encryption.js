import CryptoJS from "crypto-js";

class EncryptionService {
  constructor() {
    this.masterKey =
      import.meta.env.VITE_ENCRYPTION_KEY || "coldchainx-secret-key-2024";
  }

  generateUserKey(userId, password) {
    return CryptoJS.PBKDF2(password + userId, this.masterKey, {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString();
  }

  encrypt(data, key = null) {
    try {
      const encryptionKey = key || this.masterKey;
      const jsonString = typeof data === "string" ? data : JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(
        jsonString,
        encryptionKey,
      ).toString();
      return encrypted;
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  decrypt(encryptedData, key = null) {
    try {
      const encryptionKey = key || this.masterKey;
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  hashPassword(password, salt) {
    return CryptoJS.SHA256(password + salt).toString();
  }

  generateSalt() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }
}

export default new EncryptionService();
