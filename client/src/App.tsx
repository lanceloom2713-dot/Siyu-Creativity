import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "./components/layout/PublicLayout";
import { AboutPage } from "./pages/AboutPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";
import { BlogsPage } from "./pages/BlogsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CategoryDetailsPage } from "./pages/CategoryDetailsPage";
import { ContactPage } from "./pages/ContactPage";
import { FaqPage } from "./pages/FaqPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { PolicyPage } from "./pages/PolicyPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { TermsPage } from "./pages/TermsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:slug" element={<CategoryDetailsPage />} />
        <Route path="products/:slug" element={<ProductDetailsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/:slug" element={<BlogDetailsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faqs" element={<FaqPage />} />
        <Route path="privacy-policy" element={<PolicyPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
    </Routes>
  );
}
