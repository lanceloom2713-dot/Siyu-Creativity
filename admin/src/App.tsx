import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { BlogManagerPage } from "./pages/BlogManagerPage";
import { CategoryManagerPage } from "./pages/CategoryManagerPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EnquiriesPage } from "./pages/EnquiriesPage";
import { FaqManagerPage } from "./pages/FaqManagerPage";
import { HomeBuilderPage } from "./pages/HomeBuilderPage";
import { LoginPage } from "./pages/LoginPage";
import { MediaLibraryPage } from "./pages/MediaLibraryPage";
import { ProductManagerPage } from "./pages/ProductManagerPage";
import { SeoManagerPage } from "./pages/SeoManagerPage";
import { SettingsPage } from "./pages/SettingsPage";
import { UsersPage } from "./pages/UsersPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductManagerPage />} />
        <Route path="categories" element={<CategoryManagerPage />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="homepage" element={<HomeBuilderPage />} />
        <Route path="blogs" element={<BlogManagerPage />} />
        <Route path="faqs" element={<FaqManagerPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="seo" element={<SeoManagerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
