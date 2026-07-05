import { Link } from "react-router-dom";
import type { Category } from "../../types/catalogue";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link className="group flex h-full min-h-[460px] flex-col overflow-hidden rounded-[1.5rem] border border-ink/5 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl" to={`/categories/${category.slug}`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight transition group-hover:text-ink/75">{category.name}</h3>
        <p className="mt-2 line-clamp-5 text-sm leading-6 text-ink/60">{category.description}</p>
        <span className="mt-auto pt-4 text-sm font-semibold text-ink underline-offset-4 group-hover:underline">Read more</span>
      </div>
    </Link>
  );
}
