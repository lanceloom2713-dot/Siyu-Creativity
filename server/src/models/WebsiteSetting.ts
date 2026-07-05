import { model, Schema } from "mongoose";

const WebsiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

export const WebsiteSetting = model("WebsiteSetting", WebsiteSettingSchema);
