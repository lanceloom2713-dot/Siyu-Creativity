import { model, Schema } from "mongoose";

const ContactEnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    recipientEmail: { type: String, trim: true },
    message: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    source: { type: String, enum: ["contact-form", "product-form", "whatsapp"], default: "contact-form" },
    emailSent: { type: Boolean, default: false },
    emailError: { type: String, trim: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" }
  },
  { timestamps: true }
);

export const ContactEnquiry = model("ContactEnquiry", ContactEnquirySchema);
