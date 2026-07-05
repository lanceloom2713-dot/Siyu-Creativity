import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MediaUploadField } from "../components/MediaUploadField";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

const defaultHomepage = {
  heroTitle: "Siyu Creativity",
  heroSubtitle: "Discover handcrafted gifting and personalized decor designed with soft detail.",
  heroImage: "",
  featuredCategoryTitle: "Curated creative collections",
  featuredProductTitle: "Featured catalogue pieces",
  announcement: "Custom catalogue enquiries are open."
};

export function HomeBuilderPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: sections = [] } = useQuery({ queryKey: ["admin-homepage"], queryFn: adminCmsApi.listHomepageSections });
  const homepage = sections.find((section) => section.key === "homepage")?.content ?? defaultHomepage;
  const [form, setForm] = useState(homepage);
  const [saved, setSaved] = useState(false);
  const saveMutation = useMutation({
    mutationFn: adminCmsApi.saveHomepage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage"] });
      setSaved(true);
      notify("Homepage content saved.");
    },
    onError: () => notify("Homepage save failed.", "error")
  });

  useEffect(() => setForm(homepage), [JSON.stringify(homepage)]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Homepage Builder</h1>
      <p className="mt-2 text-sm text-muted">Manage hero, featured category copy, featured product copy, announcement, and homepage CMS sections.</p>
      <form className="mt-5 grid max-w-4xl gap-4 rounded-lg bg-panel p-5 shadow-panel" onSubmit={submit}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Hero title" value={form.heroTitle ?? ""} onChange={(event) => setForm({ ...form, heroTitle: event.target.value })} />
        <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Hero subtitle" value={form.heroSubtitle ?? ""} onChange={(event) => setForm({ ...form, heroSubtitle: event.target.value })} />
        <MediaUploadField label="Hero banner image" title="Homepage hero banner" alt="Homepage hero banner" value={form.heroImage ?? ""} onChange={(heroImage) => setForm({ ...form, heroImage })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Featured category heading" value={form.featuredCategoryTitle ?? ""} onChange={(event) => setForm({ ...form, featuredCategoryTitle: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Featured product heading" value={form.featuredProductTitle ?? ""} onChange={(event) => setForm({ ...form, featuredProductTitle: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Announcement" value={form.announcement ?? ""} onChange={(event) => setForm({ ...form, announcement: event.target.value })} />
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={saveMutation.isPending} type="submit">{saveMutation.isPending ? "Saving..." : "Save Homepage"}</button>
        {saved ? <p className="text-sm font-semibold text-green-700">Homepage content saved to MongoDB.</p> : null}
      </form>
    </section>
  );
}
