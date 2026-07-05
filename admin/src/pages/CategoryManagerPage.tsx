import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { MediaUploadField } from "../components/MediaUploadField";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

const emptyCategoryForm = {
  name: "",
  description: "",
  imageUrl: "",
  bannerUrl: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  featured: false
};

type CategoryForm = typeof emptyCategoryForm & { id?: string; active?: boolean };

const makeSeo = (form: CategoryForm) =>
  form.metaTitle || form.metaDescription || form.keywords
    ? {
        metaTitle: form.metaTitle || form.name,
        metaDescription: form.metaDescription || form.description,
        keywords: form.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    : undefined;

export function CategoryManagerPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: categories = [], isLoading, error } = useQuery({ queryKey: ["admin-categories"], queryFn: adminCmsApi.listCategories });
  const [form, setForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editingCategory, setEditingCategory] = useState<CategoryForm | null>(null);

  const createMutation = useMutation({
    mutationFn: adminCmsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setForm(emptyCategoryForm);
      notify("Category created and synced.");
    },
    onError: () => notify("Category save failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof adminCmsApi.updateCategory>[1] }) => adminCmsApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      notify("Category updated.");
      setEditingCategory(null);
    },
    onError: () => notify("Category update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      notify("Category deleted.");
    },
    onError: () => notify("Category delete failed.", "error")
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;
    createMutation.mutate({
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      bannerUrl: form.bannerUrl,
      featured: form.featured,
      seo: makeSeo(form)
    });
  };

  const renderFields = (state: CategoryForm, setState: (next: CategoryForm) => void) => (
    <>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Category name" value={state.name} onChange={(event) => setState({ ...state, name: event.target.value })} />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input checked={state.featured} onChange={(event) => setState({ ...state, featured: event.target.checked })} type="checkbox" />
        Featured Category
      </label>
      <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Category description" value={state.description} onChange={(event) => setState({ ...state, description: event.target.value })} />
      <div className="lg:col-span-2">
        <MediaUploadField label="Category image" title={`${state.name} image`} alt={`${state.name} image`} value={state.imageUrl} onChange={(imageUrl) => setState({ ...state, imageUrl })} />
      </div>
      <div className="lg:col-span-2">
        <MediaUploadField label="Category banner" title={`${state.name} banner`} alt={`${state.name} banner`} value={state.bannerUrl} onChange={(bannerUrl) => setState({ ...state, bannerUrl })} />
      </div>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="SEO title" value={state.metaTitle} onChange={(event) => setState({ ...state, metaTitle: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="SEO keywords" value={state.keywords} onChange={(event) => setState({ ...state, keywords: event.target.value })} />
      <textarea className="min-h-20 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="SEO description" value={state.metaDescription} onChange={(event) => setState({ ...state, metaDescription: event.target.value })} />
      {"active" in state ? (
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input checked={Boolean(state.active)} onChange={(event) => setState({ ...state, active: event.target.checked })} type="checkbox" />
          Active on website
        </label>
      ) : null}
    </>
  );

  return (
    <section>
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="mt-2 text-sm text-muted">Create unlimited categories and sub-categories with banners, images, SEO, and display order.</p>
      </div>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        {renderFields(form, setForm)}
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating..." : "Create Category"}
        </button>
      </form>
      {isLoading ? <p className="mt-6 text-sm text-muted">Loading categories...</p> : null}
      {error ? <p className="mt-6 text-sm font-semibold text-red-600">Categories load nahi hui. Login/backend check karein.</p> : null}
      <div className="mt-6">
        <ActionTable
          rows={categories.map((category) => ({
            id: category._id,
            title: category.name,
            subtitle: `${category.description}${category.featured ? " | Featured category" : ""}`,
            status: category.active ? "active" : "inactive",
            updatedAt: new Date(category.updatedAt).toLocaleDateString("en-IN")
          }))}
          onToggle={(id) => {
            const category = categories.find((item) => item._id === id);
            if (category) updateMutation.mutate({ id, payload: { active: !category.active } });
          }}
          onEdit={(id) => {
            const category = categories.find((item) => item._id === id);
            if (category) {
              setEditingCategory({
                id: category._id,
                name: category.name,
                description: category.description,
                imageUrl: category.image?.url ?? "",
                bannerUrl: category.banner?.url ?? "",
                metaTitle: category.seo?.metaTitle ?? "",
                metaDescription: category.seo?.metaDescription ?? "",
                keywords: category.seo?.keywords?.join(", ") ?? "",
                featured: category.featured,
                active: category.active
              });
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingCategory ? (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/35 p-4">
          <form
            className="my-8 w-full max-w-3xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editingCategory.id) return;
              updateMutation.mutate({
                id: editingCategory.id,
                payload: {
                  name: editingCategory.name,
                  description: editingCategory.description,
                  imageUrl: editingCategory.imageUrl,
                  bannerUrl: editingCategory.bannerUrl,
                  featured: editingCategory.featured,
                  active: editingCategory.active,
                  seo: makeSeo(editingCategory)
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit Category</h2>
                <p className="mt-1 text-sm text-muted">Update category content and website visibility.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingCategory(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">{renderFields(editingCategory, setEditingCategory)}</div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Category"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
