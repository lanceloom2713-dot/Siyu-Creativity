import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { MediaUploadField } from "../components/MediaUploadField";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

type BlogStatus = "draft" | "published" | "scheduled" | "active";

const emptyBlogForm = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  tags: "",
  categories: "",
  publishAt: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  status: "draft" as BlogStatus
};

type BlogForm = typeof emptyBlogForm & { id?: string };

const makeSeo = (form: BlogForm) =>
  form.metaTitle || form.metaDescription || form.keywords
    ? {
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
        keywords: form.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      }
    : undefined;

export function BlogManagerPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: blogs = [], isLoading, error } = useQuery({ queryKey: ["admin-blogs"], queryFn: adminCmsApi.listBlogs });
  const [form, setForm] = useState<BlogForm>(emptyBlogForm);
  const [editingBlog, setEditingBlog] = useState<BlogForm | null>(null);

  const createMutation = useMutation({
    mutationFn: adminCmsApi.createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      setForm(emptyBlogForm);
      notify("Blog saved.");
    },
    onError: () => notify("Blog save failed.", "error")
  });
  const publishMutation = useMutation({
    mutationFn: adminCmsApi.publishBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      notify("Blog published.");
    },
    onError: () => notify("Blog publish failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof adminCmsApi.updateBlog>[1] }) => adminCmsApi.updateBlog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      notify("Blog updated.");
      setEditingBlog(null);
    },
    onError: () => notify("Blog update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      notify("Blog deleted.");
    },
    onError: () => notify("Blog delete failed.", "error")
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim()) return;
    createMutation.mutate({
      title: form.title,
      excerpt: form.excerpt,
      content: form.content || form.excerpt,
      coverImageUrl: form.coverImageUrl,
      tags: form.tags,
      categories: form.categories,
      publishAt: form.publishAt,
      seo: makeSeo(form)
    });
  };

  const renderFields = (state: BlogForm, setState: (next: BlogForm) => void, includeStatus = false) => (
    <>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Blog title" value={state.title} onChange={(event) => setState({ ...state, title: event.target.value })} />
      {includeStatus ? (
        <select className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={state.status} onChange={(event) => setState({ ...state, status: event.target.value as BlogStatus })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
        </select>
      ) : null}
      <textarea className="min-h-24 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Blog excerpt" value={state.excerpt} onChange={(event) => setState({ ...state, excerpt: event.target.value })} />
      <textarea className="min-h-48 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Full blog content" value={state.content} onChange={(event) => setState({ ...state, content: event.target.value })} />
      <div className="lg:col-span-2">
        <MediaUploadField label="Cover image" title={`${state.title} cover`} alt={`${state.title} cover`} value={state.coverImageUrl} onChange={(coverImageUrl) => setState({ ...state, coverImageUrl })} />
      </div>
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Tags comma separated" value={state.tags} onChange={(event) => setState({ ...state, tags: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Blog categories comma separated" value={state.categories} onChange={(event) => setState({ ...state, categories: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" type="datetime-local" value={state.publishAt} onChange={(event) => setState({ ...state, publishAt: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="SEO title" value={state.metaTitle} onChange={(event) => setState({ ...state, metaTitle: event.target.value })} />
      <textarea className="min-h-20 rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="SEO description" value={state.metaDescription} onChange={(event) => setState({ ...state, metaDescription: event.target.value })} />
      <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="SEO keywords" value={state.keywords} onChange={(event) => setState({ ...state, keywords: event.target.value })} />
    </>
  );

  return (
    <section>
      <h1 className="text-2xl font-bold">Blogs</h1>
      <p className="mt-2 text-sm text-muted">Manage drafts, published posts, scheduled posts, SEO, categories, tags, and related blogs.</p>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        {renderFields(form, setForm)}
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">
          {createMutation.isPending ? "Saving..." : "Create Draft Blog"}
        </button>
      </form>
      {isLoading ? <p className="mt-6 text-sm text-muted">Loading blogs...</p> : null}
      {error ? <p className="mt-6 text-sm font-semibold text-red-600">Blogs load nahi huye. Login/backend check karein.</p> : null}
      <div className="mt-6">
        <ActionTable
          rows={blogs.map((blog) => ({
            id: blog._id,
            title: blog.title,
            subtitle: blog.excerpt,
            status: blog.status,
            updatedAt: new Date(blog.updatedAt).toLocaleDateString("en-IN")
          }))}
          primaryActionLabel="Publish"
          onPrimaryAction={(id) => publishMutation.mutate(id)}
          onEdit={(id) => {
            const blog = blogs.find((item) => item._id === id);
            if (blog) {
              setEditingBlog({
                id: blog._id,
                title: blog.title,
                excerpt: blog.excerpt,
                content: blog.content ?? blog.excerpt,
                coverImageUrl: blog.coverImage ?? "",
                tags: blog.tags?.join(", ") ?? "",
                categories: blog.categories?.join(", ") ?? "",
                publishAt: blog.publishAt ? new Date(blog.publishAt).toISOString().slice(0, 16) : "",
                metaTitle: blog.seo?.metaTitle ?? "",
                metaDescription: blog.seo?.metaDescription ?? "",
                keywords: blog.seo?.keywords?.join(", ") ?? "",
                status: blog.status
              });
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingBlog ? (
        <div className="fixed inset-0 z-40 grid place-items-center overflow-y-auto bg-ink/35 p-4">
          <form
            className="my-8 w-full max-w-3xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (!editingBlog.id) return;
              updateMutation.mutate({
                id: editingBlog.id,
                payload: {
                  title: editingBlog.title,
                  excerpt: editingBlog.excerpt,
                  content: editingBlog.content,
                  coverImageUrl: editingBlog.coverImageUrl,
                  tags: editingBlog.tags,
                  categories: editingBlog.categories,
                  publishAt: editingBlog.publishAt,
                  status: editingBlog.status,
                  seo: makeSeo(editingBlog)
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit Blog</h2>
                <p className="mt-1 text-sm text-muted">Update full content, cover image, SEO, and publish status.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingBlog(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">{renderFields(editingBlog, setEditingBlog, true)}</div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Blog"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
