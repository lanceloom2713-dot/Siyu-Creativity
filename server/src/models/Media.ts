import { model, Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    alt: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Media = model("Media", MediaSchema);
