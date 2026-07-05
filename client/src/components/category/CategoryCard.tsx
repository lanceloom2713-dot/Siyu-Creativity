import { Link } from "react-router-dom";
import type { Category } from "../../types/catalogue";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link className="group overflow-hidden rounded-[1.5rem] bg-white shadow-soft" to={`/categories/${category.slug}`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} />
      </div>
      <div className="p-5">
        <h3 className="font-display text-2xl font-semibold">{category.name}</h3>
        <p className="mt-2 text-sm leading-6 text-ink/60">{category.description}</p>
      </div>
    </Link>
  );
}
