// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// The SERVICE_ACCOUNT_KEY env variable should be a single-line JSON string (no outer quotes)
// Example:
// SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",...}

let serviceAccount: any = undefined;

if (process.env.SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY.trim());
  } catch (err) {
    throw new Error("Failed to parse SERVICE_ACCOUNT_KEY: " + (err as Error).message);
  }
} else {
  throw new Error("Missing SERVICE_ACCOUNT_KEY environment variable");
}

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApp();

const db = getFirestore(app);

export { db };