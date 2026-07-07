import { Blog } from "../models/Blog.js";
import { Category } from "../models/Category.js";
import { ContactEnquiry } from "../models/ContactEnquiry.js";
import { Faq } from "../models/Faq.js";
import { HomepageSection } from "../models/HomepageSection.js";
import { Product } from "../models/Product.js";
import { SeoPage } from "../models/SeoPage.js";
import { WebsiteSetting } from "../models/WebsiteSetting.js";
import { sendContactEnquiryEmail } from "../services/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactEnquirySchema } from "../validators/contact.validator.js";

const categoryCardFields = "name slug description image banner featured displayOrder seo";
const productCardFields = "name slug shortDescription gallery featured trending active displayOrder seo categories";
const blogCardFields = "title slug excerpt coverImage status tags seo publishAt createdAt";

export const getHome = asyncHandler(async (_req, res) => {
  const [sections, categories, products, featuredCategories, featuredProducts, trendingProducts, latestBlogs] = await Promise.all([
    HomepageSection.find({ active: true }).select("key content displayOrder active").sort({ displayOrder: 1 }).lean(),
    Category.find({ active: true }).select(categoryCardFields).sort({ createdAt: -1 }).limit(12).lean(),
    Product.find({ active: true }).select(productCardFields).slice("gallery", 1).populate("categories", "name slug").sort({ createdAt: -1 }).limit(12).lean(),
    Category.find({ active: true, featured: true }).select(categoryCardFields).sort({ displayOrder: 1 }).limit(8).lean(),
    Product.find({ active: true, featured: true }).select(productCardFields).slice("gallery", 1).populate("categories", "name slug").sort({ displayOrder: 1, createdAt: -1 }).limit(12).lean(),
    Product.find({ active: true, trending: true }).select(productCardFields).slice("gallery", 1).populate("categories", "name slug").sort({ displayOrder: 1, createdAt: -1 }).limit(12).lean(),
    Blog.find({ status: { $in: ["published", "active"] } }).select(blogCardFields).sort({ publishAt: -1, createdAt: -1 }).limit(3).lean()
  ]);

  res.json({ sections, categories, products, featuredCategories, featuredProducts, trendingProducts, latestBlogs });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ active: true }).select(categoryCardFields).sort({ displayOrder: 1 }).lean();
  res.json({ categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, active: true }).select(categoryCardFields).lean();
  if (!category) return res.status(404).json({ message: "Category not found" });

  const products = await Product.find({ active: true, categories: category._id }).select(productCardFields).slice("gallery", 1).populate("categories", "name slug").sort({ displayOrder: 1 }).lean();
  return res.json({ category, products });
});

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ active: true }).select(productCardFields).slice("gallery", 1).populate("categories", "name slug").sort({ createdAt: -1 }).lean();
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, active: true }).populate("categories relatedProducts").lean();
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json({ product });
});

export const listBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find({ status: { $in: ["published", "active"] } }).select(blogCardFields).sort({ publishAt: -1, createdAt: -1 }).lean();
  res.json({ blogs });
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: { $in: ["published", "active"] } }).lean();
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  return res.json({ blog });
});

export const listFaqs = asyncHandler(async (_req, res) => {
  const faqs = await Faq.find({ active: true }).sort({ displayOrder: 1 }).lean();
  res.json({ faqs });
});

export const listSeoPages = asyncHandler(async (_req, res) => {
  const seo = await SeoPage.find({ active: true }).sort({ page: 1 }).lean();
  res.json({ seo });
});

export const getWebsiteSettings = asyncHandler(async (_req, res) => {
  const settings = await WebsiteSetting.findOne({ key: "website" }).lean();
  res.json({ settings: settings?.value ?? {} });
});

export const createContactEnquiry = asyncHandler(async (req, res) => {
  const payload = contactEnquirySchema.parse(req.body);
  const settings = await WebsiteSetting.findOne({ key: "website" });
  const recipientEmail = String(process.env.ENQUIRY_TO_EMAIL || settings?.value?.enquiryEmail || settings?.value?.email || "siyucreativity11@gmail.com");
  const enquiry = await ContactEnquiry.create({ ...payload, recipientEmail });

  let emailSent = false;
  let emailError = "";
  if (recipientEmail) {
    try {
      const result = await sendContactEnquiryEmail({ ...payload, recipientEmail });
      emailSent = result.sent;
      emailError = result.sent ? "" : result.reason ?? "Email provider did not send the message";
    } catch (error) {
      emailError = error instanceof Error ? error.message : "Email send failed";
      console.warn(emailError);
    }
  }

  if (emailSent || emailError) {
    enquiry.emailSent = emailSent;
    enquiry.emailError = emailError;
    await enquiry.save();
  }

  res.status(201).json({ enquiry, emailSent });
});
