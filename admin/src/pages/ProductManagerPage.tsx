import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { MediaUploadField } from "../components/MediaUploadField";
import { MultiMediaUploadField } from "../components/MultiMediaUploadField";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

const emptyProductForm = {
  name: "",
  category: "",
  shortDescription: "",
  longDescription: "",
  imageUrls: "",
  videoUrl: "",
  features: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  featured: true,
  trending: false
};

type ProductForm = typeof emptyProductForm & { id?: string; active?: boolean };

const makeSeo = (form: ProductForm) =>
  form.metaTitle || form.metaDescription || form.keywords
    ? {
        metaTitle: form.metaTitle || form.name,
        metaDescription: form.metaDescription || form.shortDescription,
        keywords: form.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    : undefined;

export function ProductManagerPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: products = [], isLoading, error } = useQuery({ queryKey: ["admin-products"], queryFn: adminCmsApi.listProducts });
  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: adminCmsApi.listCategories });
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);

  const createMutation = useMutation({
    mutationFn: adminCmsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setForm(emptyProductForm);
      notify("Product created and synced to website.");
    },
    onError: () => notify("Product save failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof adminCmsApi.updateProduct>[1] }) => adminCmsApi.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      notify("Product updated.");
      setEditingProduct(null);
    },
    onError: () => notify("Product update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      notify("Product deleted.");
    },
    onError: () => notify("Product delete failed.", "error")
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.shortDescription.trim()) return;
    createMutation.mutate({
      name: form.name,
      categoryName: form.category,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      imageUrls: form.imageUrls,
      videoUrl: form.videoUrl,
      features: form.features,
      tags: form.tags,
      featured: form.featured,
      trending: form.trending,
      seo: makeSeo(form)
    });
  };

  const renderFields = (state: ProductForm, setState: (next: ProductForm) => void) => (
    <>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Product name" value={state.name} onChange={(event) => setState({ ...state, name: event.target.value })} />
      <select className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={state.category} onChange={(event) => setState({ ...state, category: event.target.value })}>
        <option value="">Uncategorized</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Short description" value={state.shortDescription} onChange={(event) => setState({ ...state, shortDescription: event.target.value })} />
      <textarea className="min-h-28 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Long description" value={state.longDescription} onChange={(event) => setState({ ...state, longDescription: event.target.value })} />
      <div className="lg:col-span-2">
        <MultiMediaUploadField label="Product images" title={state.name} alt={state.name} value={state.imageUrls} onChange={(imageUrls) => setState({ ...state, imageUrls })} />
      </div>
      <div className="lg:col-span-2">
        <MediaUploadField label="Product video" title={`${state.name} video`} alt={`${state.name} video`} value={state.videoUrl} onChange={(videoUrl) => setState({ ...state, videoUrl })} />
      </div>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Features comma separated" value={state.features} onChange={(event) => setState({ ...state, features: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Tags comma separated" value={state.tags} onChange={(event) => setState({ ...state, tags: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="SEO title" value={state.metaTitle} onChange={(event) => setState({ ...state, metaTitle: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="SEO keywords" value={state.keywords} onChange={(event) => setState({ ...state, keywords: event.target.value })} />
      <textarea className="min-h-20 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="SEO description" value={state.metaDescription} onChange={(event) => setState({ ...state, metaDescription: event.target.value })} />
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input checked={state.featured} onChange={(event) => setState({ ...state, featured: event.target.checked })} type="checkbox" />
        Featured
      </label>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input checked={state.trending} onChange={(event) => setState({ ...state, trending: event.target.checked })} type="checkbox" />
        Trending
      </label>
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
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="mt-2 text-sm text-muted">Manage product galleries, videos, features, SEO, related products, status, and ordering.</p>
      </div>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        {renderFields(form, setForm)}
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>
      {isLoading ? <p className="mt-6 text-sm text-muted">Loading products...</p> : null}
      {error ? <p className="mt-6 text-sm font-semibold text-red-600">Products load nahi huye. Login/backend check karein.</p> : null}
      <div className="mt-6">
        <ActionTable
          rows={products.map((product) => ({
            id: product._id,
            title: product.name,
            subtitle: `${product.shortDescription}${product.featured ? " | Featured" : ""}${product.trending ? " | Trending" : ""}`,
            status: product.active ? "active" : "inactive",
            updatedAt: new Date(product.updatedAt).toLocaleDateString("en-IN")
          }))}
          onToggle={(id) => {
            const product = products.find((item) => item._id === id);
            if (product) updateMutation.mutate({ id, payload: { active: !product.active } });
          }}
          onEdit={(id) => {
            const product = products.find((item) => item._id === id);
            if (product) {
              setEditingProduct({
                id: product._id,
                name: product.name,
                category: "",
                shortDescription: product.shortDescription,
                longDescription: product.longDescription ?? product.shortDescription,
                imageUrls: product.gallery?.map((item) => item.url).join("\n") ?? "",
                videoUrl: product.video?.url ?? "",
                features: product.features?.join(", ") ?? "",
                tags: product.tags?.join(", ") ?? "",
                metaTitle: product.seo?.metaTitle ?? "",
                metaDescription: product.seo?.metaDescription ?? "",
                keywords: product.seo?.keywords?.join(", ") ?? "",
                featured: product.featured,
                trending: product.trending,
                active: product.active
              });
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingProduct ? (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/35 p-4">
          <form
            className="my-8 w-full max-w-3xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editingProduct.id) return;
              updateMutation.mutate({
                id: editingProduct.id,
                payload: {
                  name: editingProduct.name,
                  shortDescription: editingProduct.shortDescription,
                  longDescription: editingProduct.longDescription,
                  imageUrls: editingProduct.imageUrls,
                  videoUrl: editingProduct.videoUrl,
                  features: editingProduct.features,
                  tags: editingProduct.tags,
                  featured: editingProduct.featured,
                  trending: editingProduct.trending,
                  active: editingProduct.active,
                  seo: makeSeo(editingProduct)
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit Product</h2>
                <p className="mt-1 text-sm text-muted">Update website-visible product details.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingProduct(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">{renderFields(editingProduct, setEditingProduct)}</div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
