import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-semibold">Siyu Creativity</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/65">
            Premium handcrafted catalogue experiences for thoughtful gifting, decor, and customized creative products.
          </p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/65">
            <Link to="/categories">Categories</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/blogs">Blogs</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Support</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/65">
            <Link to="/faqs">FAQs</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
