import { Blog } from "../models/Blog.js";
import { Category } from "../models/Category.js";
import { ContactEnquiry } from "../models/ContactEnquiry.js";
import { Faq } from "../models/Faq.js";
import { HomepageSection } from "../models/HomepageSection.js";
import { Product } from "../models/Product.js";
import { SeoPage } from "../models/SeoPage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactEnquirySchema } from "../validators/contact.validator.js";

export const getHome = asyncHandler(async (_req, res) => {
  const [sections, categories, products, featuredCategories, featuredProducts, trendingProducts, latestBlogs] = await Promise.all([
    HomepageSection.find({ active: true }).sort({ displayOrder: 1 }),
    Category.find({ active: true }).sort({ createdAt: -1 }).limit(12),
    Product.find({ active: true }).populate("categories relatedProducts").sort({ createdAt: -1 }).limit(12),
    Category.find({ active: true, featured: true }).sort({ displayOrder: 1 }).limit(8),
    Product.find({ active: true, featured: true }).populate("categories relatedProducts").sort({ displayOrder: 1, createdAt: -1 }).limit(12),
    Product.find({ active: true, trending: true }).populate("categories relatedProducts").sort({ displayOrder: 1, createdAt: -1 }).limit(12),
    Blog.find({ status: { $in: ["published", "active"] } }).sort({ publishAt: -1, createdAt: -1 }).limit(3)
  ]);

  res.json({ sections, categories, products, featuredCategories, featuredProducts, trendingProducts, latestBlogs });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ active: true }).sort({ displayOrder: 1 });
  res.json({ categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, active: true });
  if (!category) return res.status(404).json({ message: "Category not found" });

  const products = await Product.find({ active: true, categories: category._id }).populate("categories relatedProducts").sort({ displayOrder: 1 });
  return res.json({ category, products });
});

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ active: true }).populate("categories relatedProducts").sort({ createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true }).populate("categories relatedProducts");
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ product });
});

export const listBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find({ status: { $in: ["published", "active"] } }).sort({ publishAt: -1, createdAt: -1 });
  res.json({ blogs });
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: { $in: ["published", "active"] } });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  return res.json({ blog });
});

export const listFaqs = asyncHandler(async (_req, res) => {
  const faqs = await Faq.find({ active: true }).sort({ displayOrder: 1 });
  res.json({ faqs });
});

export const listSeoPages = asyncHandler(async (_req, res) => {
  const seo = await SeoPage.find({ active: true }).sort({ page: 1 });
  res.json({ seo });
});

export const createContactEnquiry = asyncHandler(async (req, res) => {
  const payload = contactEnquirySchema.parse(req.body);
  const enquiry = await ContactEnquiry.create(payload);
  res.status(201).json({ enquiry });
});
