import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { publicCatalogueApi } from "../../services/publicCatalogueApi";

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-semibold">Siyu Creativity</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Premium handcrafted catalogue experiences for thoughtful gifting, decor, and customized creative products.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-ink/65">
            <p className="flex items-center gap-2"><MessageCircle size={16} /> {settings?.whatsapp ?? "+91 99999 99999"}</p>
            <p className="flex items-center gap-2"><Mail size={16} /> {settings?.email ?? "hello@siyucreativity.com"}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/65">
            <Link to="/categories">Categories</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/65">
            <Link to="/faqs">FAQs</Link>
            <p className="flex items-center gap-2"><Phone size={16} /> {settings?.phone ?? "+91 99999 99999"}</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> {settings?.address ?? "India"}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
        All rights reserved to Siyu Creativity.
      </div>
    </footer>
  );
}
