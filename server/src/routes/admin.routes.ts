import { Router } from "express";
import { createCrudController, getDashboard, login } from "../controllers/admin.controller.js";
import { mediaUpload, uploadMedia } from "../controllers/media.controller.js";
import { requireAdmin } from "../middleware/auth.js";
import { Blog } from "../models/Blog.js";
import { Category } from "../models/Category.js";
import { ContactEnquiry } from "../models/ContactEnquiry.js";
import { Faq } from "../models/Faq.js";
import { HomepageSection } from "../models/HomepageSection.js";
import { Media } from "../models/Media.js";
import { Product } from "../models/Product.js";
import { SeoPage } from "../models/SeoPage.js";
import { WebsiteSetting } from "../models/WebsiteSetting.js";
import { Admin } from "../models/Admin.js";

export const adminRoutes = Router();

adminRoutes.post("/auth/login", login);
adminRoutes.use(requireAdmin);
adminRoutes.get("/dashboard", getDashboard);
adminRoutes.post("/media/upload", mediaUpload.single("file"), uploadMedia);

const resources = [
  ["products", Product],
  ["categories", Category],
  ["blogs", Blog],
  ["faqs", Faq],
  ["media", Media],
  ["enquiries", ContactEnquiry],
  ["homepage", HomepageSection],
  ["seo", SeoPage],
  ["settings", WebsiteSetting],
  ["users", Admin]
] as const;

resources.forEach(([path, model]) => {
  const controller = createCrudController(model, path);
  adminRoutes.get(`/${path}`, controller.list);
  adminRoutes.post(`/${path}`, controller.create);
  adminRoutes.patch(`/${path}/:id`, controller.update);
  adminRoutes.delete(`/${path}/:id`, controller.remove);
});
