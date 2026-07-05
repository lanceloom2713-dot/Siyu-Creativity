import { useQuery } from "@tanstack/react-query";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function FaqPage() {
  const { data: faqs = [] } = useQuery({ queryKey: ["public-faqs"], queryFn: publicCatalogueApi.getFaqs });

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">FAQs</h1>
      <div className="mt-8 grid gap-4">
        {faqs.map((faq) => (
          <details className="rounded-2xl bg-white p-5 shadow-soft" key={faq.id}>
            <summary className="cursor-pointer font-semibold">{faq.question}</summary>
            <p className="mt-3 text-sm leading-6 text-ink/60">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
