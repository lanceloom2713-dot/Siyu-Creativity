import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/siyu-logo.jpg";

const links = [
  ["Home", "/"],
  ["Categories", "/categories"],
  ["Blogs", "/blogs"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/" onClick={() => setOpen(false)}>
          <img className="h-12 w-12 rounded-full object-cover" src={logo} alt="Siyu Creativity logo" />
          <span className="font-display text-2xl font-semibold">Siyu Creativity</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          {links.map(([label, href]) => (
            <NavLink className={({ isActive }) => (isActive ? "text-ink" : "hover:text-ink")} key={href} to={href}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white md:block" to="/contact">
          Enquire Now
        </Link>
        <button className="rounded-full border border-ink/10 p-2 md:hidden" onClick={() => setOpen((current) => !current)} type="button" aria-label={open ? "Close navigation" : "Open navigation"}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <nav className="border-t border-ink/10 bg-white px-4 py-4 shadow-soft md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {links.map(([label, href]) => (
              <NavLink
                className={({ isActive }) => `rounded-2xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-ink text-white" : "bg-porcelain text-ink/75"}`}
                key={href}
                to={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <Link className="mt-2 rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white" to="/contact" onClick={() => setOpen(false)}>
              Enquire Now
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
