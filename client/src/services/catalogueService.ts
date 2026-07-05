import { blogs, categories, products } from "../constants/catalogue";

export const catalogueService = {
  getHome() {
    return {
      featuredCategories: categories.filter((category) => category.featured),
      featuredProducts: products.filter((product) => product.featured && product.active),
      trendingProducts: products.filter((product) => product.trending && product.active),
      latestBlogs: blogs.filter((blog) => blog.status === "published")
    };
  },
  getCategories() {
    return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  },
  getCategory(slug: string) {
    return categories.find((category) => category.slug === slug);
  },
  getProductsByCategory(slug: string) {
    return products.filter((product) => product.active && product.categorySlugs.includes(slug));
  },
  getProduct(slug: string) {
    return products.find((product) => product.active && product.slug === slug);
  },
  getRelatedProducts(slugs: string[]) {
    return products.filter((product) => product.active && slugs.includes(product.slug));
  },
  getBlogs() {
    return blogs.filter((blog) => blog.status === "published");
  },
  getBlog(slug: string) {
    return blogs.find((blog) => blog.status === "published" && blog.slug === slug);
  }
};
