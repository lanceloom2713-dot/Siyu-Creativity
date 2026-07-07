import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { HomePage } from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage").then((module) => ({ default: module.BlogDetailsPage })));
const BlogsPage = lazy(() => import("./pages/BlogsPage").then((module) => ({ default: module.BlogsPage })));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage").then((module) => ({ default: module.CategoriesPage })));
const CategoryDetailsPage = lazy(() => import("./pages/CategoryDetailsPage").then((module) => ({ default: module.CategoryDetailsPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((module) => ({ default: module.ContactPage })));
const FaqPage = lazy(() => import("./pages/FaqPage").then((module) => ({ default: module.FaqPage })));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage").then((module) => ({ default: module.ProductDetailsPage })));

function PageLoader() {
  return <div className="mx-auto min-h-[55vh] max-w-7xl px-4 py-16 text-sm font-semibold text-ink/55 sm:px-6 lg:px-8">Loading...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:slug" element={<CategoryDetailsPage />} />
          <Route path="products/:slug" element={<ProductDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blogs/:slug" element={<BlogDetailsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<FaqPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
