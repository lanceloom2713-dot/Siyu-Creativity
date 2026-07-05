import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner", "admin", "editor"], default: "admin" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const Admin = model("Admin", AdminSchema);
