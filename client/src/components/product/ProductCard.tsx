import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { publicCatalogueApi } from "../../services/publicCatalogueApi";
import type { Product } from "../../types/catalogue";
import { createProductWhatsappUrl } from "../../utils/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <article className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-soft">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={product.gallery[0]} alt={product.name} loading="lazy" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          {product.trending ? <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold">Trending</span> : null}
          {product.featured ? <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold">Featured</span> : null}
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="mt-4 font-display text-xl font-semibold leading-tight">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-4 text-sm leading-6 text-ink/60">{product.shortDescription}</p>
        <Link className="mt-3 text-sm font-semibold text-ink underline-offset-4 hover:underline" to={`/products/${product.slug}`}>
          Read more
        </Link>
        <a
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          href={createProductWhatsappUrl(product.name, settings?.whatsapp)}
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
