import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { Blog } from "../models/Blog.js";
import { Category } from "../models/Category.js";
import { ContactEnquiry } from "../models/ContactEnquiry.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createSlug } from "../utils/slug.js";

const defaultImage = {
  url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
  alt: "Siyu Creativity catalogue image",
  type: "image"
};

const makeSeo = (title: string, description = "Siyu Creativity premium catalogue item.") => ({
  metaTitle: `${title} | Siyu Creativity`,
  metaDescription: description,
  keywords: [title, "Siyu Creativity", "custom catalogue"]
});

const makeSku = (name: string) => `SIYU-${createSlug(name).slice(0, 18).toUpperCase()}-${Date.now().toString().slice(-6)}`;

const splitList = (value: unknown) =>
  Array.isArray(value)
    ? value
    : String(value ?? "")
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);

const makeGallery = (value: unknown, alt: string) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? { url: item, alt, type: "image" } : item))
      .filter((item: any) => item?.url);
  }

  return splitList(value).map((url) => ({ url: String(url), alt, type: "image" }));
};

const normalizePayload = async (label: string, body: Record<string, unknown>) => {
  if (label === "products") {
    const name = String(body.name ?? "");
    const shortDescription = String(body.shortDescription ?? body.description ?? "Premium Siyu Creativity catalogue product.");
    const longDescription = String(body.longDescription ?? shortDescription);
    const categoryName = String(body.categoryName ?? body.category ?? "");
    const category = categoryName ? await Category.findOne({ name: categoryName }) : null;
    const gallery = makeGallery(body.imageUrls ?? body.imageUrl ?? body.gallery, name);

    return {
      ...body,
      sku: body.sku ?? makeSku(name),
      name,
      slug: body.slug ?? createSlug(name),
      shortDescription,
      longDescription,
      gallery: gallery.length ? gallery : [defaultImage],
      video: body.videoUrl ? { url: String(body.videoUrl), alt: `${name} video`, type: "video" } : body.video,
      features: splitList(body.features),
      tags: splitList(body.tags),
      categories: Array.isArray(body.categories) && body.categories.length ? body.categories : category ? [category._id] : [],
      relatedProducts: Array.isArray(body.relatedProducts) ? body.relatedProducts : [],
      seo: body.seo ?? makeSeo(name, shortDescription),
      featured: body.featured ?? true,
      trending: body.trending ?? false,
      active: body.active ?? body.status !== "inactive"
    };
  }

  if (label === "categories") {
    const name = String(body.name ?? "");
    const description = String(body.description ?? "Premium Siyu Creativity catalogue category.");
    return {
      ...body,
      name,
      description,
      slug: body.slug ?? createSlug(name),
      image: body.imageUrl ? { url: String(body.imageUrl), alt: `${name} category image`, type: "image" } : body.image ?? { ...defaultImage, alt: `${name} category image` },
      banner: body.bannerUrl ? { url: String(body.bannerUrl), alt: `${name} category banner`, type: "image" } : body.banner ?? { ...defaultImage, alt: `${name} category banner` },
      seo: body.seo ?? makeSeo(name, description),
      featured: body.featured ?? true,
      active: body.active ?? body.status !== "inactive"
    };
  }

  if (label === "blogs") {
    const title = String(body.title ?? "");
    const excerpt = String(body.excerpt ?? "Siyu Creativity catalogue article.");
    return {
      ...body,
      title,
      excerpt,
      slug: body.slug ?? createSlug(title),
      content: body.content ?? excerpt,
      coverImage: body.coverImageUrl ?? body.coverImage,
      categories: splitList(body.categories),
      tags: splitList(body.tags),
      seo: body.seo ?? makeSeo(title, excerpt)
    };
  }

  if (label === "faqs") {
    return {
      ...body,
      answer: body.answer ?? "Answer will be updated from the admin panel.",
      active: body.active ?? body.status !== "inactive"
    };
  }

  if (label === "media") {
    return {
      ...body,
      active: body.active ?? true
    };
  }

  if (label === "seo") {
    return {
      ...body,
      active: body.active ?? true
    };
  }

  if (label === "users") {
    const password = String(body.password ?? "Admin@12345");
    return {
      ...body,
      passwordHash: body.passwordHash ?? (await bcrypt.hash(password, 12)),
      active: body.active ?? body.status !== "inactive"
    };
  }

  return body;
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const admin = await Admin.findOne({ email, active: true });

  if (!admin || !(await bcrypt.compare(password ?? "", admin.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ sub: admin.id, role: admin.role }, process.env.JWT_SECRET ?? "", { expiresIn: "8h" });
  return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
});

export const getDashboard = asyncHandler(async (_req, res) => {
  const [products, categories, blogs, enquiries] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Blog.countDocuments(),
    ContactEnquiry.countDocuments({ status: "new" })
  ]);

  res.json({ metrics: { products, categories, blogs, enquiries } });
});

export const createCrudController = (model: any, label: string) => ({
  list: asyncHandler(async (_req, res) => {
    const items = await model.find().sort({ createdAt: -1 });
    res.json({ [label]: items });
  }),
  create: asyncHandler(async (req, res) => {
    const item = await model.create(await normalizePayload(label, req.body));
    res.status(201).json({ item });
  }),
  update: asyncHandler(async (req, res) => {
    const existing = await model.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: `${label} not found` });

    const normalized = await normalizePayload(label, { ...existing.toObject(), ...req.body });
    delete normalized._id;
    delete normalized.id;
    delete normalized.__v;
    delete normalized.createdAt;
    delete normalized.updatedAt;

    const item = await model.findByIdAndUpdate(req.params.id, normalized, { new: true, runValidators: true });
    return res.json({ item });
  }),
  remove: asyncHandler(async (req, res) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: `${label} not found` });
    return res.status(204).send();
  })
});
