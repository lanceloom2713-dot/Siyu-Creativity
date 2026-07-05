import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/database.js";
import { Admin } from "../models/Admin.js";

const email = process.env.ADMIN_EMAIL ?? "admin@siyucreativity.com";
const password = process.env.ADMIN_PASSWORD ?? "Admin@12345";

await connectDatabase();

const passwordHash = await bcrypt.hash(password, 12);
await Admin.findOneAndUpdate(
  { email },
  {
    name: "Siyu Admin",
    email,
    passwordHash,
    role: "owner",
    active: true
  },
  { upsert: true, new: true }
);

console.log(`Admin user ready: ${email}`);
process.exit(0);
