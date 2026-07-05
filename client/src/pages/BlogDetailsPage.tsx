import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function BlogDetailsPage() {
  const { slug = "" } = useParams();
  const { data: blog, isLoading } = useQuery({ queryKey: ["public-blog", slug], queryFn: () => publicCatalogueApi.getBlog(slug), enabled: Boolean(slug) });

  if (isLoading) {
    return <section className="mx-auto max-w-3xl px-4 py-20">Loading blog...</section>;
  }

  if (!blog) {
    return <section className="mx-auto max-w-3xl px-4 py-20">Blog not found.</section>;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      {blog.coverImage ? <img className="mb-8 aspect-video w-full rounded-[1.5rem] object-cover shadow-soft" src={blog.coverImage} alt={blog.title} /> : null}
      <h1 className="font-display text-5xl font-semibold">{blog.title}</h1>
      <p className="mt-6 text-lg leading-8 text-ink/68">{blog.content}</p>
    </article>
  );
}
