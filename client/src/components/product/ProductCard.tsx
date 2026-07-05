import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/catalogue";
import { createProductWhatsappUrl } from "../../utils/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={product.gallery[0]} alt={product.name} />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {product.trending ? <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold">Trending</span> : null}
          {product.featured ? <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold">Featured</span> : null}
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="mt-4 font-display text-2xl font-semibold">{product.name}</h3>
        </Link>
        <p className="mt-2 text-sm leading-6 text-ink/60">{product.shortDescription}</p>
        <a
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          href={createProductWhatsappUrl(product.name)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} />
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  );
}
