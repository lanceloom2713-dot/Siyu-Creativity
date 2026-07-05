import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/siyu-logo.png";

type HeroProps = {
  title?: string;
  subtitle?: string;
  announcement?: string;
  image?: string;
  images?: string[];
};

export function Hero({ title = "Siyu Creativity", subtitle = "Discover handcrafted gifting and personalized decor designed with soft detail, elegant finishing, and custom enquiry support.", announcement = "Premium custom catalogue", image = logo, images = [] }: HeroProps) {
  const slides = useMemo(() => (images.length ? images : [image || logo]), [image, images]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 3500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eef9ff_35%,#f6ecff_70%,#fff7fb_100%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-ink/70 shadow-soft backdrop-blur">
            <Sparkles size={16} />
            <span className="leading-6">{announcement}</span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-justify text-base leading-8 text-ink/68 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="rounded-full bg-ink px-6 py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl" to="/categories">
              Explore Catalogue
            </Link>
            <Link className="rounded-full border border-ink/15 bg-white/75 px-6 py-3 text-center text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 hover:bg-white" to="/contact">
              Start an Enquiry
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-soft backdrop-blur-xl sm:p-4"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <img className="aspect-square w-full rounded-[1.5rem] object-cover transition-opacity duration-500" src={slides[activeSlide]} alt={`${title} hero`} />
          {slides.length > 1 ? (
            <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/70 px-3 py-2 shadow-soft">
              {slides.map((slide, index) => (
                <button
                  className={`h-2.5 w-2.5 rounded-full ${index === activeSlide ? "bg-ink" : "bg-ink/25"}`}
                  key={`${slide}-${index}`}
                  onClick={() => setActiveSlide(index)}
                  type="button"
                  aria-label={`Show hero image ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
