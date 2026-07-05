import { Router } from "express";
import {
  createContactEnquiry,
  getBlog,
  getCategory,
  getHome,
  getProduct,
  listBlogs,
  listCategories,
  listFaqs,
  listProducts,
  listSeoPages
} from "../controllers/public.controller.js";

export const publicRoutes = Router();

publicRoutes.get("/home", getHome);
publicRoutes.get("/categories", listCategories);
publicRoutes.get("/categories/:slug", getCategory);
publicRoutes.get("/products", listProducts);
publicRoutes.get("/products/:slug", getProduct);
publicRoutes.get("/blogs", listBlogs);
publicRoutes.get("/blogs/:slug", getBlog);
publicRoutes.get("/faqs", listFaqs);
publicRoutes.get("/seo", listSeoPages);
publicRoutes.post("/contact", createContactEnquiry);
