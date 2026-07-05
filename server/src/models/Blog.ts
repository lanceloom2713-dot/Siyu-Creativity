import { model, Schema } from "mongoose";
import { SeoSchema } from "./shared.js";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    status: { type: String, enum: ["draft", "published", "scheduled", "active"], default: "draft" },
    publishAt: { type: Date },
    categories: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    relatedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
    seo: { type: SeoSchema, required: true }
  },
  { timestamps: true }
);

export const Blog = model("Blog", BlogSchema);
