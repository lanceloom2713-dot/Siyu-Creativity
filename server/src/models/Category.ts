import { model, Schema } from "mongoose";
import { MediaAssetSchema, SeoSchema } from "./shared.js";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category" },
    description: { type: String, required: true },
    image: { type: MediaAssetSchema, required: true },
    banner: { type: MediaAssetSchema, required: true },
    seo: { type: SeoSchema, required: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
