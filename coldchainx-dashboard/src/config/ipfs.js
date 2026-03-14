import { create } from "ipfs-http-client";

// Vite uses import.meta.env instead of process.env
// Also note: Vite requires VITE_ prefix, not REACT_APP_
const projectId =
  import.meta.env.VITE_IPFS_PROJECT_ID || "2IYFK8pVNu2GgbsZ7j6RzM4qXkH";
const projectSecret =
  import.meta.env.VITE_IPFS_PROJECT_SECRET || "a1b2c3d4e5f6g7h8i9j0";

// Browser-compatible base64 encoding
const auth = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default ipfs;
