import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "../components/category/CategoryCard";
import { SectionHeading } from "../components/common/SectionHeading";
import { Hero } from "../components/home/Hero";
import { ProductCard } from "../components/product/ProductCard";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

const splitImages = (value?: string) =>
  String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

export function HomePage() {
  const { data: home } = useQuery({ queryKey: ["public-home"], queryFn: publicCatalogueApi.getHome });
  const homepage = home?.homepage ?? {};

  return (
    <>
      <Hero title={homepage.heroTitle} subtitle={homepage.heroSubtitle} announcement={homepage.announcement} image={homepage.heroImage} images={splitImages(homepage.heroImages)} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Featured categories"
          title={homepage.featuredCategoryTitle ?? "Curated creative collections"}
          description="Browse by occasion, finish, and personalization style before sending your enquiry."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(home?.categories?.length ? home.categories : home?.featuredCategories ?? []).map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </section>
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Products" title={homepage.featuredProductTitle ?? "Featured catalogue pieces"} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(home?.products?.length ? home.products : home?.featuredProducts ?? []).map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
