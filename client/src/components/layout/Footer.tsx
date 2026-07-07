import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { publicCatalogueApi } from "../../services/publicCatalogueApi";
import logo from "../../assets/siyu-logo.jpg";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/siyu_creativity__?igsh=eHhvaGJ0ZzltdTJ1&utm_source=qr",
    Icon: Instagram
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/17ePyzymYt/?mibextid=wwXIfr",
    Icon: Facebook
  }
];

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <footer className="border-t border-ink/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_55%,#fff7fb_100%)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link className="inline-flex items-center gap-3" to="/">
            <img className="h-16 w-16 rounded-2xl border border-white bg-white object-cover shadow-soft" src={logo} alt="Siyu Creativity logo" />
            <span className="font-display text-3xl font-semibold">Siyu Creativity</span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Premium handcrafted catalogue experiences for thoughtful gifting, decor, and customized creative products.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map(({ href, Icon, label }) => (
              <a
                aria-label={`Open Siyu Creativity on ${label}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-soft transition hover:-translate-y-0.5 hover:bg-ink hover:text-white"
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
                title={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-ink/45">Explore</p>
          <div className="mt-4 grid gap-3 text-sm font-medium text-ink/65">
            <Link to="/categories">Categories</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-ink/45">Contact</p>
          <div className="mt-4 grid gap-3 text-sm font-medium text-ink/65">
            <Link to="/faqs">FAQs</Link>
            <p className="flex items-center gap-2"><Phone size={16} /> {settings?.phone ?? "+91 99999 99999"}</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> {settings?.address ?? "Ghaziabad, India"}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10 bg-white/45 px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
        All rights reserved to Siyu Creativity
      </div>
    </footer>
  );
}
