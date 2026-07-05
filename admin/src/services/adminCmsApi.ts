import { http } from "../api/http";

export type ApiProduct = {
  _id: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  gallery?: { url: string; alt?: string; type?: string }[];
  video?: { url: string; alt?: string; type?: string };
  features?: string[];
  tags?: string[];
  featured: boolean;
  trending: boolean;
  active: boolean;
  seo?: { metaTitle: string; metaDescription: string; keywords: string[] };
  updatedAt: string;
};

export type ApiCategory = {
  _id: string;
  name: string;
  description: string;
  image?: { url: string; alt?: string; type?: string };
  banner?: { url: string; alt?: string; type?: string };
  featured: boolean;
  active: boolean;
  seo?: { metaTitle: string; metaDescription: string; keywords: string[] };
  updatedAt: string;
};

export type ApiBlog = {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  status: "draft" | "published" | "scheduled" | "active";
  publishAt?: string;
  categories?: string[];
  tags?: string[];
  seo?: { metaTitle: string; metaDescription: string; keywords: string[] };
  updatedAt: string;
};

export type ApiFaq = {
  _id: string;
  question: string;
  answer: string;
  active: boolean;
  updatedAt: string;
};

export type ApiMedia = {
  _id: string;
  title: string;
  url: string;
  type: "image" | "video";
  alt: string;
  active: boolean;
  updatedAt: string;
};

export type ApiHomepageSection = {
  _id: string;
  key: string;
  title: string;
  content: Record<string, string>;
  active: boolean;
  updatedAt: string;
};

export type ApiSeoPage = {
  _id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  active: boolean;
  updatedAt: string;
};

export type ApiSetting = {
  _id: string;
  key: string;
  value: Record<string, string>;
  updatedAt: string;
};

export type ApiEnquiry = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: "new" | "contacted" | "closed";
  updatedAt: string;
};

export type ApiAdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "editor";
  active: boolean;
  updatedAt: string;
};

export const adminCmsApi = {
  async login(email: string, password: string) {
    const response = await http.post("/auth/login", { email, password });
    return response.data as { token: string; admin: { name: string; email: string; role: string } };
  },
  async getDashboard() {
    const response = await http.get("/dashboard");
    return response.data as { metrics: { products: number; categories: number; blogs: number; enquiries: number } };
  },
  async listProducts() {
    const response = await http.get("/products");
    return response.data.products as ApiProduct[];
  },
  async createProduct(payload: {
    name: string;
    categoryName?: string;
    shortDescription: string;
    longDescription?: string;
    imageUrl?: string;
    videoUrl?: string;
    features?: string;
    tags?: string;
    featured: boolean;
    trending: boolean;
    seo?: { metaTitle: string; metaDescription: string; keywords: string[] };
  }) {
    const response = await http.post("/products", payload);
    return response.data.item as ApiProduct;
  },
  async updateProduct(id: string, payload: Record<string, unknown>) {
    const response = await http.patch(`/products/${id}`, payload);
    return response.data.item as ApiProduct;
  },
  async deleteProduct(id: string) {
    await http.delete(`/products/${id}`);
  },
  async listCategories() {
    const response = await http.get("/categories");
    return response.data.categories as ApiCategory[];
  },
  async createCategory(payload: { name: string; description: string; featured: boolean; imageUrl?: string; bannerUrl?: string; seo?: { metaTitle: string; metaDescription: string; keywords: string[] } }) {
    const response = await http.post("/categories", payload);
    return response.data.item as ApiCategory;
  },
  async updateCategory(id: string, payload: Partial<ApiCategory> & { imageUrl?: string; bannerUrl?: string }) {
    const response = await http.patch(`/categories/${id}`, payload);
    return response.data.item as ApiCategory;
  },
  async deleteCategory(id: string) {
    await http.delete(`/categories/${id}`);
  },
  async listBlogs() {
    const response = await http.get("/blogs");
    return response.data.blogs as ApiBlog[];
  },
  async createBlog(payload: { title: string; excerpt: string; content?: string; coverImageUrl?: string; tags?: string; categories?: string; publishAt?: string; seo?: { metaTitle: string; metaDescription: string; keywords: string[] } }) {
    const response = await http.post("/blogs", { ...payload, status: "draft" });
    return response.data.item as ApiBlog;
  },
  async publishBlog(id: string) {
    const response = await http.patch(`/blogs/${id}`, { status: "published" });
    return response.data.item as ApiBlog;
  },
  async updateBlog(id: string, payload: Partial<Pick<ApiBlog, "title" | "excerpt" | "content" | "coverImage" | "status" | "publishAt">> & { coverImageUrl?: string; tags?: string; categories?: string; seo?: { metaTitle: string; metaDescription: string; keywords: string[] } }) {
    const response = await http.patch(`/blogs/${id}`, payload);
    return response.data.item as ApiBlog;
  },
  async deleteBlog(id: string) {
    await http.delete(`/blogs/${id}`);
  },
  async listFaqs() {
    const response = await http.get("/faqs");
    return response.data.faqs as ApiFaq[];
  },
  async createFaq(payload: { question: string; answer: string }) {
    const response = await http.post("/faqs", payload);
    return response.data.item as ApiFaq;
  },
  async updateFaq(id: string, payload: Partial<ApiFaq>) {
    const response = await http.patch(`/faqs/${id}`, payload);
    return response.data.item as ApiFaq;
  },
  async deleteFaq(id: string) {
    await http.delete(`/faqs/${id}`);
  },
  async listMedia() {
    const response = await http.get("/media");
    return response.data.media as ApiMedia[];
  },
  async createMedia(payload: { title: string; url: string; type: "image" | "video"; alt: string }) {
    const response = await http.post("/media", payload);
    return response.data.item as ApiMedia;
  },
  async uploadMedia(payload: { file: File; title: string; alt: string }) {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("title", payload.title);
    formData.append("alt", payload.alt);

    const response = await http.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data.item as ApiMedia;
  },
  async updateMedia(id: string, payload: Partial<ApiMedia>) {
    const response = await http.patch(`/media/${id}`, payload);
    return response.data.item as ApiMedia;
  },
  async deleteMedia(id: string) {
    await http.delete(`/media/${id}`);
  },
  async listHomepageSections() {
    const response = await http.get("/homepage");
    return response.data.homepage as ApiHomepageSection[];
  },
  async saveHomepage(content: Record<string, string>) {
    const sections = await adminCmsApi.listHomepageSections();
    const existing = sections.find((section) => section.key === "homepage");
    const payload = { key: "homepage", title: "Homepage Content", content, active: true };
    const response = existing ? await http.patch(`/homepage/${existing._id}`, payload) : await http.post("/homepage", payload);
    return response.data.item as ApiHomepageSection;
  },
  async listSeoPages() {
    const response = await http.get("/seo");
    return response.data.seo as ApiSeoPage[];
  },
  async saveSeoPage(payload: { page: string; metaTitle: string; metaDescription: string; keywords: string }) {
    const pages = await adminCmsApi.listSeoPages();
    const existing = pages.find((item) => item.page.toLowerCase() === payload.page.toLowerCase());
    const response = existing ? await http.patch(`/seo/${existing._id}`, payload) : await http.post("/seo", payload);
    return response.data.item as ApiSeoPage;
  },
  async updateSeoPage(id: string, payload: Partial<ApiSeoPage>) {
    const response = await http.patch(`/seo/${id}`, payload);
    return response.data.item as ApiSeoPage;
  },
  async deleteSeoPage(id: string) {
    await http.delete(`/seo/${id}`);
  },
  async listSettings() {
    const response = await http.get("/settings");
    return response.data.settings as ApiSetting[];
  },
  async saveSettings(value: Record<string, string>) {
    const settings = await adminCmsApi.listSettings();
    const existing = settings.find((item) => item.key === "website");
    const payload = { key: "website", value };
    const response = existing ? await http.patch(`/settings/${existing._id}`, payload) : await http.post("/settings", payload);
    return response.data.item as ApiSetting;
  },
  async listEnquiries() {
    const response = await http.get("/enquiries");
    return response.data.enquiries as ApiEnquiry[];
  },
  async updateEnquiry(id: string, status: ApiEnquiry["status"]) {
    const response = await http.patch(`/enquiries/${id}`, { status });
    return response.data.item as ApiEnquiry;
  },
  async listUsers() {
    const response = await http.get("/users");
    return response.data.users as ApiAdminUser[];
  },
  async createUser(payload: { name: string; email: string; role: ApiAdminUser["role"]; password?: string }) {
    const response = await http.post("/users", payload);
    return response.data.item as ApiAdminUser;
  },
  async updateUser(id: string, payload: Partial<ApiAdminUser>) {
    const response = await http.patch(`/users/${id}`, payload);
    return response.data.item as ApiAdminUser;
  },
  async deleteUser(id: string) {
    await http.delete(`/users/${id}`);
  }
};
