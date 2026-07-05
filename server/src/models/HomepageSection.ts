import { model, Schema } from "mongoose";

const HomepageSectionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const HomepageSection = model("HomepageSection", HomepageSectionSchema);
