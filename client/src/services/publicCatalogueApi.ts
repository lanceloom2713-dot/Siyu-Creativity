import { http } from "../api/http";
import { blogs as fallbackBlogs, categories as fallbackCategories, products as fallbackProducts } from "../constants/catalogue";
import type { Blog, Category, Product } from "../types/catalogue";

type MediaAsset = {
  url: string;
  alt?: string;
};

type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: MediaAsset;
  banner?: MediaAsset;
  featured: boolean;
  displayOrder: number;
  seo?: Category["seo"];
};

type ApiProduct = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  gallery?: MediaAsset[];
  video?: MediaAsset;
  features?: string[];
  tags?: string[];
  categories?: ApiCategory[];
  relatedProducts?: ApiProduct[];
  featured: boolean;
  trending: boolean;
  active: boolean;
  displayOrder: number;
  seo?: Product["seo"];
};

type ApiBlog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: Blog["status"] | "active";
  tags?: string[];
  seo?: Blog["seo"];
};

type ApiFaq = {
  _id: string;
  question: string;
  answer: string;
};

type ApiHomepageSection = {
  key: string;
  content?: Partial<{
    heroTitle: string;
    heroSubtitle: string;
    featuredCategoryTitle: string;
    featuredProductTitle: string;
    announcement: string;
  }>;
};

export type HomepageContent = NonNullable<ApiHomepageSection["content"]>;

export type ApiSeoPage = {
  _id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

const fallbackImage = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80";

const mapSeo = (title: string, description: string, seo?: Product["seo"]) =>
  seo ?? {
    metaTitle: `${title} | Siyu Creativity`,
    metaDescription: description,
    keywords: [title, "Siyu Creativity"]
  };

const mapCategory = (category: ApiCategory): Category => ({
  id: category._id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image?.url ?? fallbackImage,
  banner: category.banner?.url ?? category.image?.url ?? fallbackImage,
  featured: category.featured,
  displayOrder: category.displayOrder ?? 0,
  seo: mapSeo(category.name, category.description, category.seo)
});

const mapProduct = (product: ApiProduct): Product => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  shortDescription: product.shortDescription,
  longDescription: product.longDescription,
  gallery: product.gallery?.length ? product.gallery.map((item) => item.url) : [fallbackImage],
  video: product.video?.url,
  features: product.features ?? [],
  tags: product.tags ?? [],
  categorySlugs: product.categories?.map((category) => category.slug) ?? [],
  relatedProductSlugs: product.relatedProducts?.map((item) => item.slug) ?? [],
  featured: product.featured,
  trending: product.trending,
  active: product.active,
  displayOrder: product.displayOrder ?? 0,
  seo: mapSeo(product.name, product.shortDescription, product.seo)
});

const mapBlog = (blog: ApiBlog): Blog => ({
  id: blog._id,
  title: blog.title,
  slug: blog.slug,
  excerpt: blog.excerpt,
  content: blog.content,
  coverImage: blog.coverImage,
  status: blog.status === "active" ? "published" : blog.status,
  tags: blog.tags ?? [],
  seo: mapSeo(blog.title, blog.excerpt, blog.seo)
});

export const publicCatalogueApi = {
  async getHome() {
    try {
      const response = await http.get("/public/home");
      const categories = ((response.data.categories ?? response.data.featuredCategories ?? []) as ApiCategory[]).map(mapCategory);
      const products = ((response.data.products ?? response.data.featuredProducts ?? []) as ApiProduct[]).map(mapProduct);
      const featuredCategories = ((response.data.featuredCategories?.length ? response.data.featuredCategories : response.data.categories ?? []) as ApiCategory[]).map(mapCategory);
      const featuredProducts = ((response.data.featuredProducts?.length ? response.data.featuredProducts : response.data.products ?? []) as ApiProduct[]).map(mapProduct);
      const homepage = ((response.data.sections ?? []) as ApiHomepageSection[]).find((section) => section.key === "homepage")?.content ?? {};
      return {
        homepage,
        categories,
        products,
        featuredCategories,
        featuredProducts,
        trendingProducts: ((response.data.trendingProducts ?? []) as ApiProduct[]).map(mapProduct),
        latestBlogs: ((response.data.latestBlogs ?? []) as ApiBlog[]).map(mapBlog)
      };
    } catch {
      return {
        homepage: {},
        categories: fallbackCategories,
        products: fallbackProducts.filter((product) => product.active),
        featuredCategories: fallbackCategories.filter((category) => category.featured),
        featuredProducts: fallbackProducts.filter((product) => product.featured && product.active),
        trendingProducts: fallbackProducts.filter((product) => product.trending && product.active),
        latestBlogs: fallbackBlogs.filter((blog) => blog.status === "published")
      };
    }
  },
  async getCategories() {
    try {
      const response = await http.get("/public/categories");
      return (response.data.categories as ApiCategory[]).map(mapCategory);
    } catch {
      return fallbackCategories;
    }
  },
  async getCategory(slug: string) {
    try {
      const response = await http.get(`/public/categories/${slug}`);
      return {
        category: mapCategory(response.data.category as ApiCategory),
        products: (response.data.products as ApiProduct[]).map(mapProduct)
      };
    } catch {
      const category = fallbackCategories.find((item) => item.slug === slug);
      return {
        category,
        products: fallbackProducts.filter((product) => product.categorySlugs.includes(slug))
      };
    }
  },
  async getProduct(slug: string) {
    try {
      const response = await http.get(`/public/products/${slug}`);
      return mapProduct(response.data.product as ApiProduct);
    } catch {
      return fallbackProducts.find((product) => product.slug === slug);
    }
  },
  async getBlogs() {
    try {
      const response = await http.get("/public/blogs");
      return (response.data.blogs as ApiBlog[]).map(mapBlog);
    } catch {
      return fallbackBlogs.filter((blog) => blog.status === "published");
    }
  },
  async getBlog(slug: string) {
    try {
      const response = await http.get(`/public/blogs/${slug}`);
      return mapBlog(response.data.blog as ApiBlog);
    } catch {
      return fallbackBlogs.find((blog) => blog.slug === slug);
    }
  },
  async getFaqs() {
    try {
      const response = await http.get("/public/faqs");
      return (response.data.faqs as ApiFaq[]).map((faq) => ({
        id: faq._id,
        question: faq.question,
        answer: faq.answer
      }));
    } catch {
      return [
        { id: "faq-1", question: "Can products be customized?", answer: "Yes. Every enquiry can include color, name, occasion, and finishing preferences." },
        { id: "faq-2", question: "Do you show prices online?", answer: "No. Siyu Creativity is a catalogue and enquiry website, so pricing is handled after requirement discussion." }
      ];
    }
  },
  async getSeoPages() {
    try {
      const response = await http.get("/public/seo");
      return response.data.seo as ApiSeoPage[];
    } catch {
      return [] as ApiSeoPage[];
    }
  },
  async createContact(payload: { name: string; phone: string; email?: string; message: string }) {
    const response = await http.post("/public/contact", { ...payload, source: "contact-form" });
    return response.data;
  }
};
