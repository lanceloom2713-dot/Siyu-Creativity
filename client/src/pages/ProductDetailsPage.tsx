import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { products as fallbackProducts } from "../constants/catalogue";
import { ProductCard } from "../components/product/ProductCard";
import { publicCatalogueApi } from "../services/publicCatalogueApi";
import { createProductWhatsappUrl } from "../utils/whatsapp";

export function ProductDetailsPage() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["public-product", slug], queryFn: () => publicCatalogueApi.getProduct(slug), enabled: Boolean(slug) });
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product?.gallery[0]) setActiveImage(product.gallery[0]);
  }, [product?.id, product?.gallery]);

  if (isLoading) {
    return <section className="mx-auto max-w-7xl px-4 py-20">Loading product...</section>;
  }

  if (!product) {
    return <section className="mx-auto max-w-7xl px-4 py-20">Product not found.</section>;
  }

  const related = fallbackProducts.filter((item) => product.relatedProductSlugs.includes(item.slug));
  const selectedImage = activeImage || product.gallery[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <img className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft" src={selectedImage} alt={product.name} />
          <div className="grid grid-cols-4 gap-3">
            {product.gallery.map((item) => (
              <button className={`overflow-hidden rounded-2xl border ${item === selectedImage ? "border-ink" : "border-transparent"}`} key={item} onClick={() => setActiveImage(item)} type="button">
                <img className="aspect-square w-full object-cover" src={item} alt={product.name} loading="lazy" />
              </button>
            ))}
          </div>
          {product.video ? <video className="aspect-video rounded-2xl object-cover shadow-soft" src={product.video} controls /> : null}
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-ink/45">Catalogue product</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-5 whitespace-pre-line text-justify text-base leading-7 text-ink/70">{product.longDescription}</div>
          <div className="mt-8 grid gap-3">
            {product.features.map((feature) => (
              <div className="rounded-2xl border border-ink/10 bg-white p-4 text-sm font-medium" key={feature}>
                {feature}
              </div>
            ))}
          </div>
          {product.tags.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink/60" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
              href={createProductWhatsappUrl(product.name)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={17} />
              Enquire on WhatsApp
            </a>
            <Link className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold" to="/contact">
              <Send size={17} />
              Contact Form
            </Link>
          </div>
        </div>
      </div>
      {related.length ? (
        <div className="mt-16">
          <h2 className="font-display text-4xl font-semibold">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
