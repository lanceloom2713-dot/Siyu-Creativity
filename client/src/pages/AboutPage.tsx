import { useQuery } from "@tanstack/react-query";
import { Gift, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function AboutPage() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-ink/5 bg-[linear-gradient(135deg,#ffffff_0%,#eef9ff_55%,#fff7fb_100%)] p-6 shadow-soft sm:p-8 lg:p-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-ink/45">About us</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-center font-display text-4xl font-semibold leading-tight md:text-5xl">{settings?.aboutTitle ?? "About Siyu Creativity"}</h1>
        <p className="mx-auto mt-6 max-w-4xl whitespace-pre-line text-justify text-base leading-8 text-ink/70 md:text-lg">
          {settings?.aboutText ?? "Siyu Creativity creates personalized gifting and decor pieces with a soft pastel identity, thoughtful detailing, and a premium handmade finish."}
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Sparkles, label: "Premium finish", text: "Thoughtfully curated gifting and decor pieces." },
          { icon: Gift, label: "Personalized", text: "Names, occasions, colors, and details made personal." },
          { icon: HeartHandshake, label: "Made with care", text: "Designed for memorable moments and celebrations." },
          { icon: MapPin, label: "Pan India", text: "Catalogue enquiries supported across India." }
        ].map((item) => (
          <div className="rounded-[1.5rem] border border-ink/5 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl" key={item.label}>
            <item.icon className="text-ink/70" size={22} />
            <h2 className="mt-4 font-display text-2xl font-semibold">{item.label}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/62">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
