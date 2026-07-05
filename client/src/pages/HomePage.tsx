import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "../components/category/CategoryCard";
import { SectionHeading } from "../components/common/SectionHeading";
import { Hero } from "../components/home/Hero";
import { ProductCard } from "../components/product/ProductCard";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function HomePage() {
  const { data: home } = useQuery({ queryKey: ["public-home"], queryFn: publicCatalogueApi.getHome });
  const homepage = home?.homepage ?? {};

  return (
    <>
      <Hero title={homepage.heroTitle} subtitle={homepage.heroSubtitle} announcement={homepage.announcement} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured categories"
          title={homepage.featuredCategoryTitle ?? "Curated creative collections"}
          description="Browse by occasion, finish, and personalization style before sending your enquiry."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(home?.categories?.length ? home.categories : home?.featuredCategories ?? []).map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </section>
      <section className="bg-white/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Products" title={homepage.featuredProductTitle ?? "Featured catalogue pieces"} />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(home?.products?.length ? home.products : home?.featuredProducts ?? []).map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
