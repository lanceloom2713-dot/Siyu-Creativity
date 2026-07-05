import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

export function SeoManagerPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: seoPages = [] } = useQuery({ queryKey: ["admin-seo"], queryFn: adminCmsApi.listSeoPages });
  const saveMutation = useMutation({
    mutationFn: adminCmsApi.saveSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-seo"] });
      notify("SEO settings saved.");
    },
    onError: () => notify("SEO save failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteSeoPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-seo"] });
      notify("SEO record deleted.");
    },
    onError: () => notify("SEO delete failed.", "error")
  });
  const [form, setForm] = useState({ page: "", metaTitle: "", metaDescription: "", keywords: "" });
  const [editingSeo, setEditingSeo] = useState<{ id: string; page: string; metaTitle: string; metaDescription: string; keywords: string; active: boolean } | null>(null);
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof adminCmsApi.updateSeoPage>[1] }) => adminCmsApi.updateSeoPage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-seo"] });
      notify("SEO record updated.");
      setEditingSeo(null);
    },
    onError: () => notify("SEO update failed.", "error")
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.page.trim() || !form.metaTitle.trim() || !form.metaDescription.trim()) return;
    saveMutation.mutate(form);
    setForm({ page: "", metaTitle: "", metaDescription: "", keywords: "" });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">SEO Manager</h1>
      <p className="mt-2 text-sm text-muted">Manage meta titles, descriptions, keywords, canonical strategy, social cards, schema, robots, and sitemap-ready page data.</p>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Page name or URL" value={form.page} onChange={(event) => setForm({ ...form, page: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Meta title" value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} />
        <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Meta description" value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Keywords" value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} />
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={saveMutation.isPending} type="submit">{saveMutation.isPending ? "Saving..." : "Save SEO"}</button>
      </form>
      <div className="mt-6">
        <ActionTable
          rows={seoPages.map((page) => ({ id: page._id, title: page.page, subtitle: `${page.metaTitle} | ${page.metaDescription}`, status: page.active ? "active" : "inactive", updatedAt: new Date(page.updatedAt).toLocaleDateString("en-IN") }))}
          onToggle={(id) => {
            const page = seoPages.find((item) => item._id === id);
            if (page) updateMutation.mutate({ id, payload: { active: !page.active } });
          }}
          onEdit={(id) => {
            const page = seoPages.find((item) => item._id === id);
            if (page) setEditingSeo({ id: page._id, page: page.page, metaTitle: page.metaTitle, metaDescription: page.metaDescription, keywords: page.keywords, active: page.active });
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingSeo ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4">
          <form
            className="w-full max-w-xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              updateMutation.mutate({
                id: editingSeo.id,
                payload: {
                  page: editingSeo.page,
                  metaTitle: editingSeo.metaTitle,
                  metaDescription: editingSeo.metaDescription,
                  keywords: editingSeo.keywords,
                  active: editingSeo.active
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit SEO</h2>
                <p className="mt-1 text-sm text-muted">Use page values like /, /blogs, /categories, or contact.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingSeo(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingSeo.page} onChange={(event) => setEditingSeo({ ...editingSeo, page: event.target.value })} />
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingSeo.metaTitle} onChange={(event) => setEditingSeo({ ...editingSeo, metaTitle: event.target.value })} />
              <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingSeo.metaDescription} onChange={(event) => setEditingSeo({ ...editingSeo, metaDescription: event.target.value })} />
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingSeo.keywords} onChange={(event) => setEditingSeo({ ...editingSeo, keywords: event.target.value })} />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input checked={editingSeo.active} onChange={(event) => setEditingSeo({ ...editingSeo, active: event.target.checked })} type="checkbox" />
                Active on website
              </label>
            </div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save SEO"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
