import { model, Schema } from "mongoose";

const SeoPageSchema = new Schema(
  {
    page: { type: String, required: true, unique: true, trim: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SeoPage = model("SeoPage", SeoPageSchema);
