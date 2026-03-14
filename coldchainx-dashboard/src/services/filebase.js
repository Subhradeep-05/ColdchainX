// class FilebaseManager {
//   constructor() {
//     this.accessKey = import.meta.env.VITE_FILEBASE_ACCESS_KEY;
//     this.secretKey = import.meta.env.VITE_FILEBASE_SECRET_KEY;
//     this.bucketName = "coldchainx-project";

//     console.log("=".repeat(50));
//     console.log("🔧 FILEBASE MANAGER INITIALIZED");
//     console.log("Bucket:", this.bucketName);
//     console.log("Access Key exists:", !!this.accessKey);
//     console.log("Secret Key exists:", !!this.secretKey);
//     console.log("=".repeat(50));

//     if (!this.accessKey || !this.secretKey) {
//       console.error("❌ CRITICAL: Filebase credentials missing in .env file!");
//     }
//   }

//   // Helper function for SHA256 (defined inside the class)
//   async sha256(message) {
//     const msgBuffer = new TextEncoder().encode(message);
//     const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
//   }

//   // Helper to create HMAC signature
//   async hmac(key, data) {
//     const cryptoKey = await crypto.subtle.importKey(
//       "raw",
//       key,
//       { name: "HMAC", hash: "SHA-256" },
//       false,
//       ["sign"],
//     );
//     const signature = await crypto.subtle.sign(
//       "HMAC",
//       cryptoKey,
//       new TextEncoder().encode(data),
//     );
//     return new Uint8Array(signature);
//   }

//   async uploadJSON(data, filename) {
//     try {
//       console.log("=".repeat(50));
//       console.log("📤 FILEBASE UPLOAD START");
//       console.log("Filename:", filename);
//       console.log("Bucket:", this.bucketName);

//       // Validate credentials
//       if (!this.accessKey || !this.secretKey) {
//         throw new Error("Filebase credentials not configured");
//       }

//       const dataStr =
//         typeof data === "string" ? data : JSON.stringify(data, null, 2);
//       console.log("Data size:", dataStr.length, "bytes");

//       // AWS Signature V4 requires a specific date format
//       const now = new Date();
//       const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, "");
//       const dateStamp = amzDate.substring(0, 8);

//       const url = `https://s3.filebase.com/${this.bucketName}/${filename}`;
//       console.log("📡 Target URL:", url);

//       // Create canonical request for AWS Signature V4
//       const canonicalUri = `/${this.bucketName}/${filename}`;
//       const canonicalQuerystring = "";
//       const payloadHash = await this.sha256(dataStr);

//       const canonicalHeaders =
//         `host:s3.filebase.com\n` +
//         `x-amz-content-sha256:${payloadHash}\n` +
//         `x-amz-date:${amzDate}\n`;

//       const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

//       const canonicalRequest =
//         `PUT\n` +
//         `${canonicalUri}\n` +
//         `${canonicalQuerystring}\n` +
//         `${canonicalHeaders}\n` +
//         `${signedHeaders}\n` +
//         `${payloadHash}`;

//       // Create string to sign
//       const algorithm = "AWS4-HMAC-SHA256";
//       const credentialScope = `${dateStamp}/us-east-1/s3/aws4_request`;
//       const stringToSign =
//         `${algorithm}\n` +
//         `${amzDate}\n` +
//         `${credentialScope}\n` +
//         `${await this.sha256(canonicalRequest)}`;

//       // Create signing key using HMAC-SHA256
//       const getSignatureKey = async (
//         key,
//         dateStamp,
//         regionName,
//         serviceName,
//       ) => {
//         const kDate = await this.hmac(
//           new TextEncoder().encode("AWS4" + key),
//           dateStamp,
//         );
//         const kRegion = await this.hmac(kDate, regionName);
//         const kService = await this.hmac(kRegion, serviceName);
//         const kSigning = await this.hmac(kService, "aws4_request");
//         return kSigning;
//       };

//       const signingKey = await getSignatureKey(
//         this.secretKey,
//         dateStamp,
//         "us-east-1",
//         "s3",
//       );

//       // Create signature
//       const signatureBytes = await this.hmac(signingKey, stringToSign);
//       const signature = Array.from(signatureBytes)
//         .map((b) => b.toString(16).padStart(2, "0"))
//         .join("");

//       // Create authorization header
//       const authorization = `${algorithm} Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

//       console.log("📡 Sending request with AWS Signature V4...");

//       const response = await fetch(url, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: authorization,
//           "x-amz-content-sha256": payloadHash,
//           "x-amz-date": amzDate,
//           "x-amz-meta-timestamp": Date.now().toString(),
//           "x-amz-meta-uploaded-by": "coldchainx-app",
//         },
//         body: dataStr,
//       });

//       console.log("📡 Response status:", response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("❌ Response error body:", errorText);
//         throw new Error(`Upload failed: ${response.status} - ${errorText}`);
//       }

//       // Get ETag from response headers
//       const etag = response.headers.get("ETag")?.replace(/"/g, "");

//       console.log("✅ Upload successful!");
//       console.log("📌 ETag:", etag);
//       console.log("📌 Gateway URL:", `https://ipfs.filebase.io/ipfs/${etag}`);
//       console.log("=".repeat(50));

//       return {
//         cid: etag,
//         etag: etag,
//         url: `https://ipfs.filebase.io/ipfs/${etag}`,
//       };
//     } catch (error) {
//       console.error("=".repeat(50));
//       console.error("❌ FILEBASE UPLOAD FAILED");
//       console.error("Error name:", error.name);
//       console.error("Error message:", error.message);
//       console.error("=".repeat(50));

//       // Return fallback for development
//       return {
//         cid: `dev-${Date.now()}`,
//         url: `https://ipfs.filebase.io/ipfs/dev-${Date.now()}`,
//       };
//     }
//   }

//   async getData(cid) {
//     try {
//       console.log("📥 Fetching CID:", cid);

//       // Try multiple gateways
//       const gateways = [
//         `https://ipfs.filebase.io/ipfs/${cid}`,
//         `https://ipfs.io/ipfs/${cid}`,
//         `https://cloudflare-ipfs.com/ipfs/${cid}`,
//       ];

//       for (const url of gateways) {
//         try {
//           console.log("Trying gateway:", url);
//           const response = await fetch(url);
//           if (response.ok) {
//             const data = await response.json();
//             console.log("✅ Data retrieved successfully from:", url);
//             return data;
//           }
//         } catch (e) {
//           console.log(`Gateway ${url} failed:`, e.message);
//         }
//       }

//       throw new Error("All gateways failed");
//     } catch (error) {
//       console.error("❌ Fetch failed:", error);
//       throw error;
//     }
//   }

//   async uploadUserData(userId, data) {
//     const filename = `profile-${userId}-${Date.now()}.json`;
//     return this.uploadJSON(data, filename);
//   }
// }

// // Create and export a single instance
// const filebaseManager = new FilebaseManager();
// export default filebaseManager;

class FilebaseManager {
  constructor() {
    this.accessKey = import.meta.env.VITE_FILEBASE_ACCESS_KEY;
    this.secretKey = import.meta.env.VITE_FILEBASE_SECRET_KEY;
    this.bucketName = "coldchainx-project";
  }

  async uploadJSON(data, filename) {
    try {
      console.log("📤 Uploading to Filebase...", {
        filename,
        bucket: this.bucketName,
      });

      // For hackathon demo, simulate successful upload
      // In production, you'd use actual Filebase API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a mock CID (in production, this would come from Filebase)
      const mockCid =
        "Qm" +
        Array.from({ length: 44 }, () => Math.random().toString(36)[2]).join(
          "",
        );

      console.log("✅ Upload successful! CID:", mockCid);

      return {
        cid: mockCid,
        url: `https://ipfs.filebase.io/ipfs/${mockCid}`,
      };
    } catch (error) {
      console.error("❌ Upload failed:", error);
      throw new Error("Filebase upload failed: " + error.message);
    }
  }

  async getData(cid) {
    try {
      console.log("📥 Fetching from Filebase, CID:", cid);

      // For hackathon demo, return mock data
      // In production, this would fetch from IPFS gateway
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        fullName: "Demo User",
        email: "demo@example.com",
        phone: "1234567890",
        companyName: "Demo Company",
        licenseNumber: "LIC123456",
        registrationDate: "2024-01-01",
        role: "shipment",
      };
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      throw error;
    }
  }
}

export default new FilebaseManager();
