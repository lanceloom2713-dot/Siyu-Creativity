import { Outlet } from "react-router-dom";
import { SeoSync } from "../common/SeoSync";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <SeoSync />
      <Header />
      <main>
        <Outlet />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
