import { z } from "zod";

export const contactEnquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  recipientEmail: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10),
  product: z.string().optional(),
  source: z.enum(["contact-form", "product-form", "whatsapp"]).optional()
});
