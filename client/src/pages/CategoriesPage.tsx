import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "../components/category/CategoryCard";
import { SectionHeading } from "../components/common/SectionHeading";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function CategoriesPage() {
  const { data: categories = [] } = useQuery({ queryKey: ["public-categories"], queryFn: publicCatalogueApi.getCategories });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading title="Categories" description="Explore catalogue collections that can be customized for your occasion." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard category={category} key={category.id} />
        ))}
      </div>
    </section>
  );
}
