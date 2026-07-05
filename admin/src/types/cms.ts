export type Status = "active" | "inactive" | "draft" | "published" | "scheduled";

export type AdminTableRow = {
  id: string;
  title: string;
  status: Status;
  updatedAt: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  status: "active" | "inactive";
  featured: boolean;
  trending: boolean;
  updatedAt: string;
};

export type CategoryItem = {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  featured: boolean;
  updatedAt: string;
};

export type BlogItem = {
  id: string;
  title: string;
  excerpt: string;
  status: "draft" | "published" | "scheduled";
  updatedAt: string;
};

export type FaqItem = {
  id: string;
  question: string;
  status: "active" | "inactive";
  updatedAt: string;
};

export type EnquiryItem = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "closed";
  updatedAt: string;
};

export type SiteSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  businessHours: string;
};

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
  alt: string;
  updatedAt: string;
};

export type HomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  featuredCategoryTitle: string;
  featuredProductTitle: string;
  announcement: string;
};

export type SeoPageItem = {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  updatedAt: string;
};

export type AdminUserItem = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor";
  status: "active" | "inactive";
  updatedAt: string;
};
