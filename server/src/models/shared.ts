import { Schema } from "mongoose";

export const SeoSchema = new Schema(
  {
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true }],
    canonical: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    robots: { type: String, default: "index,follow" },
    schemaJson: { type: Schema.Types.Mixed }
  },
  { _id: false }
);

export const MediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" }
  },
  { _id: false }
);
