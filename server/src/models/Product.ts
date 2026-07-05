import { model, Schema } from "mongoose";
import { MediaAssetSchema, SeoSchema } from "./shared.js";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    gallery: { type: [MediaAssetSchema], default: [] },
    video: { type: MediaAssetSchema },
    features: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    seo: { type: SeoSchema, required: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
