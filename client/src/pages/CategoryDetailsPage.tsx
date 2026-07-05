import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ProductCard } from "../components/product/ProductCard";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function CategoryDetailsPage() {
  const { slug = "" } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["public-category", slug], queryFn: () => publicCatalogueApi.getCategory(slug), enabled: Boolean(slug) });
  const category = data?.category;
  const products = data?.products ?? [];

  if (isLoading) {
    return <section className="mx-auto max-w-7xl px-4 py-20">Loading category...</section>;
  }

  if (!category) {
    return <section className="mx-auto max-w-7xl px-4 py-20">Category not found.</section>;
  }

  return (
    <section>
      <div className="relative h-[340px] overflow-hidden">
        <img className="h-full w-full object-cover" src={category.banner} alt={category.name} />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 py-10 text-white sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl font-semibold">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-white/82">{category.description}</p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
