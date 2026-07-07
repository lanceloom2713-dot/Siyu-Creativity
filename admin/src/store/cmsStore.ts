import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AdminUserItem,
  BlogItem,
  CategoryItem,
  EnquiryItem,
  FaqItem,
  HomepageContent,
  MediaItem,
  ProductItem,
  SeoPageItem,
  SiteSettings
} from "../types/cms";

type CmsState = {
  products: ProductItem[];
  categories: CategoryItem[];
  blogs: BlogItem[];
  faqs: FaqItem[];
  enquiries: EnquiryItem[];
  media: MediaItem[];
  homepage: HomepageContent;
  seoPages: SeoPageItem[];
  adminUsers: AdminUserItem[];
  settings: SiteSettings;
  addProduct: (product: Pick<ProductItem, "name" | "category" | "shortDescription" | "featured" | "trending">) => void;
  toggleProductStatus: (id: string) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Pick<CategoryItem, "name" | "description" | "featured">) => void;
  toggleCategoryStatus: (id: string) => void;
  deleteCategory: (id: string) => void;
  addBlog: (blog: Pick<BlogItem, "title" | "excerpt">) => void;
  publishBlog: (id: string) => void;
  deleteBlog: (id: string) => void;
  addFaq: (question: string) => void;
  toggleFaqStatus: (id: string) => void;
  deleteFaq: (id: string) => void;
  updateEnquiryStatus: (id: string, status: EnquiryItem["status"]) => void;
  addMedia: (media: Pick<MediaItem, "title" | "url" | "type" | "alt">) => void;
  deleteMedia: (id: string) => void;
  saveHomepage: (homepage: HomepageContent) => void;
  saveSeoPage: (page: Pick<SeoPageItem, "page" | "metaTitle" | "metaDescription" | "keywords">) => void;
  deleteSeoPage: (id: string) => void;
  addAdminUser: (user: Pick<AdminUserItem, "name" | "email" | "role">) => void;
  toggleAdminUserStatus: (id: string) => void;
  deleteAdminUser: (id: string) => void;
  saveSettings: (settings: SiteSettings) => void;
};

const today = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const id = () => crypto.randomUUID();

export const useCmsStore = create<CmsState>()(
  persist(
    (set) => ({
      products: [
        {
          id: "prod-1",
          name: "Pastel Memory Box",
          category: "Handcrafted Gifting",
          shortDescription: "A delicate keepsake box crafted for milestone gifting.",
          status: "active",
          featured: true,
          trending: true,
          updatedAt: "Today"
        }
      ],
      categories: [
        {
          id: "cat-1",
          name: "Handcrafted Gifting",
          description: "Thoughtful handmade pieces for celebrations, teams, and keepsakes.",
          status: "active",
          featured: true,
          updatedAt: "Today"
        }
      ],
      blogs: [
        {
          id: "blog-1",
          title: "How to Choose a Thoughtful Custom Gift",
          excerpt: "A simple guide to choosing handmade gifts that feel personal and premium.",
          status: "published",
          updatedAt: "Today"
        }
      ],
      faqs: [
        {
          id: "faq-1",
          question: "Can products be customized?",
          status: "active",
          updatedAt: "Today"
        }
      ],
      enquiries: [
        {
          id: "enq-1",
          name: "Sample Customer",
          phone: "+91 99999 99999",
          message: "Interested in custom gifting catalogue.",
          status: "new",
          updatedAt: "Today"
        }
      ],
      media: [
        {
          id: "media-1",
          title: "Pastel catalogue hero",
          url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
          type: "image",
          alt: "Pastel custom gift packaging",
          updatedAt: "Today"
        }
      ],
      homepage: {
        heroTitle: "Siyu Creativity",
        heroSubtitle: "Discover handcrafted gifting and personalized decor designed with soft detail.",
        featuredCategoryTitle: "Curated creative collections",
        featuredProductTitle: "Featured catalogue pieces",
        announcement: "Custom catalogue enquiries are open."
      },
      seoPages: [
        {
          id: "seo-1",
          page: "Home",
          metaTitle: "Siyu Creativity | Premium Custom Catalogue",
          metaDescription: "Explore Siyu Creativity's premium catalogue and enquire for custom creative products.",
          keywords: "custom gifts, handcrafted decor, Siyu Creativity",
          updatedAt: "Today"
        }
      ],
      adminUsers: [
        {
          id: "user-1",
          name: "Owner",
          email: "owner@siyucreativity.com",
          role: "owner",
          status: "active",
          updatedAt: "Today"
        }
      ],
      settings: {
        whatsapp: "+91 99999 99999",
        phone: "+91 99999 99999",
        email: "siyucreativity11@gmail.com",
        businessHours: "Mon-Sat, 10:00 AM - 7:00 PM"
      },
      addProduct: (product) =>
        set((state) => ({
          products: [
            {
              id: id(),
              name: product.name,
              category: product.category || state.categories[0]?.name || "Uncategorized",
              shortDescription: product.shortDescription,
              status: "active",
              featured: product.featured,
              trending: product.trending,
              updatedAt: today()
            },
            ...state.products
          ]
        })),
      toggleProductStatus: (productId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, status: product.status === "active" ? "inactive" : "active", updatedAt: today() }
              : product
          )
        })),
      deleteProduct: (productId) => set((state) => ({ products: state.products.filter((product) => product.id !== productId) })),
      addCategory: (category) =>
        set((state) => ({
          categories: [
            { id: id(), name: category.name, description: category.description, status: "active", featured: category.featured, updatedAt: today() },
            ...state.categories
          ]
        })),
      toggleCategoryStatus: (categoryId) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === categoryId
              ? { ...category, status: category.status === "active" ? "inactive" : "active", updatedAt: today() }
              : category
          )
        })),
      deleteCategory: (categoryId) => set((state) => ({ categories: state.categories.filter((category) => category.id !== categoryId) })),
      addBlog: (blog) =>
        set((state) => ({
          blogs: [{ id: id(), title: blog.title, excerpt: blog.excerpt, status: "draft", updatedAt: today() }, ...state.blogs]
        })),
      publishBlog: (blogId) =>
        set((state) => ({
          blogs: state.blogs.map((blog) => (blog.id === blogId ? { ...blog, status: "published", updatedAt: today() } : blog))
        })),
      deleteBlog: (blogId) => set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== blogId) })),
      addFaq: (question) =>
        set((state) => ({
          faqs: [{ id: id(), question, status: "active", updatedAt: today() }, ...state.faqs]
        })),
      toggleFaqStatus: (faqId) =>
        set((state) => ({
          faqs: state.faqs.map((faq) => (faq.id === faqId ? { ...faq, status: faq.status === "active" ? "inactive" : "active", updatedAt: today() } : faq))
        })),
      deleteFaq: (faqId) => set((state) => ({ faqs: state.faqs.filter((faq) => faq.id !== faqId) })),
      updateEnquiryStatus: (enquiryId, status) =>
        set((state) => ({
          enquiries: state.enquiries.map((enquiry) => (enquiry.id === enquiryId ? { ...enquiry, status, updatedAt: today() } : enquiry))
        })),
      addMedia: (media) =>
        set((state) => ({
          media: [{ id: id(), ...media, updatedAt: today() }, ...state.media]
        })),
      deleteMedia: (mediaId) => set((state) => ({ media: state.media.filter((media) => media.id !== mediaId) })),
      saveHomepage: (homepage) => set({ homepage }),
      saveSeoPage: (page) =>
        set((state) => {
          const existing = state.seoPages.find((item) => item.page.toLowerCase() === page.page.toLowerCase());
          if (existing) {
            return {
              seoPages: state.seoPages.map((item) => (item.id === existing.id ? { ...item, ...page, updatedAt: today() } : item))
            };
          }
          return { seoPages: [{ id: id(), ...page, updatedAt: today() }, ...state.seoPages] };
        }),
      deleteSeoPage: (seoId) => set((state) => ({ seoPages: state.seoPages.filter((page) => page.id !== seoId) })),
      addAdminUser: (user) =>
        set((state) => ({
          adminUsers: [{ id: id(), ...user, status: "active", updatedAt: today() }, ...state.adminUsers]
        })),
      toggleAdminUserStatus: (userId) =>
        set((state) => ({
          adminUsers: state.adminUsers.map((user) =>
            user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active", updatedAt: today() } : user
          )
        })),
      deleteAdminUser: (userId) => set((state) => ({ adminUsers: state.adminUsers.filter((user) => user.id !== userId) })),
      saveSettings: (settings) => set({ settings })
    }),
    {
      name: "siyu-admin-cms"
    }
  )
);
