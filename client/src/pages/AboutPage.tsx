import { useQuery } from "@tanstack/react-query";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function AboutPage() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">{settings?.aboutTitle ?? "About Siyu Creativity"}</h1>
      <p className="mt-6 whitespace-pre-line text-lg leading-8 text-ink/68">
        {settings?.aboutText ?? "Siyu Creativity creates personalized gifting and decor pieces with a soft pastel identity, thoughtful detailing, and a premium handmade finish."}
      </p>
    </section>
  );
}
