export type SeoMetadata = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonical?: string;
  image?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  banner: string;
  featured: boolean;
  displayOrder: number;
  seo: SeoMetadata;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  gallery: string[];
  video?: string;
  features: string[];
  tags: string[];
  categorySlugs: string[];
  relatedProductSlugs: string[];
  featured: boolean;
  trending: boolean;
  active: boolean;
  displayOrder: number;
  seo: SeoMetadata;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: "draft" | "published" | "scheduled";
  tags: string[];
  seo: SeoMetadata;
};
