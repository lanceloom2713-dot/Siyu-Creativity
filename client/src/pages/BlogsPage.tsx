import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function BlogsPage() {
  const { data: blogs = [] } = useQuery({ queryKey: ["public-blogs"], queryFn: publicCatalogueApi.getBlogs });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Blogs</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog) => (
          <Link className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft" to={`/blogs/${blog.slug}`} key={blog.id}>
            {blog.coverImage ? <img className="aspect-video w-full object-cover" src={blog.coverImage} alt={blog.title} loading="lazy" /> : null}
            <div className="p-5">
            <h2 className="font-display text-xl font-semibold leading-tight">{blog.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
