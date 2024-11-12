import admin from "firebase-admin";
import fs from "fs";

// Configurar dotenv
import "dotenv/config";

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
