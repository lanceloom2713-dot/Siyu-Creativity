import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { ActionTable } from "../components/ActionTable";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi, type ApiMedia } from "../services/adminCmsApi";

export function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: media = [] } = useQuery({ queryKey: ["admin-media"], queryFn: adminCmsApi.listMedia });
  const createMutation = useMutation({
    mutationFn: adminCmsApi.createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      notify("Media saved.");
    },
    onError: () => notify("Media save failed.", "error")
  });
  const uploadMutation = useMutation({
    mutationFn: adminCmsApi.uploadMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      notify("Media uploaded.");
      setUploadForm({ title: "", alt: "", file: null });
    },
    onError: () => notify("Media upload failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ApiMedia> }) => adminCmsApi.updateMedia(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      notify("Media updated.");
      setEditingMedia(null);
    },
    onError: () => notify("Media update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      notify("Media deleted.");
    },
    onError: () => notify("Media delete failed.", "error")
  });
  const [form, setForm] = useState({ title: "", url: "", type: "image" as ApiMedia["type"], alt: "" });
  const [uploadForm, setUploadForm] = useState<{ title: string; alt: string; file: File | null }>({ title: "", alt: "", file: null });
  const [editingMedia, setEditingMedia] = useState<ApiMedia | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.url.trim() || !form.alt.trim()) return;
    createMutation.mutate(form);
    setForm({ title: "", url: "", type: "image", alt: "" });
  };

  const submitUpload = (event: FormEvent) => {
    event.preventDefault();
    if (!uploadForm.file || !uploadForm.title.trim() || !uploadForm.alt.trim()) return;
    uploadMutation.mutate({ file: uploadForm.file, title: uploadForm.title, alt: uploadForm.alt });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Media Library</h1>
      <p className="mt-2 text-sm text-muted">Add image or video assets and reuse them across products, categories, blogs, and homepage sections.</p>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submitUpload}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Upload title" value={uploadForm.title} onChange={(event) => setUploadForm({ ...uploadForm, title: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Alt text" value={uploadForm.alt} onChange={(event) => setUploadForm({ ...uploadForm, alt: event.target.value })} />
        <label className="flex min-h-28 cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-ink/20 bg-shell px-4 py-5 text-sm font-semibold text-muted lg:col-span-2">
          <Upload size={18} />
          {uploadForm.file ? uploadForm.file.name : "Choose image/video file"}
          <input
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            className="sr-only"
            onChange={(event) => setUploadForm({ ...uploadForm, file: event.target.files?.[0] ?? null })}
            type="file"
          />
        </label>
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={uploadMutation.isPending} type="submit">
          {uploadMutation.isPending ? "Uploading..." : "Upload Media"}
        </button>
      </form>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Media title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <select className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as ApiMedia["type"] })}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Asset URL" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm lg:col-span-2" placeholder="Alt text" value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} />
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">{createMutation.isPending ? "Saving..." : "Add Media"}</button>
      </form>
      {media.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.slice(0, 8).map((item) => (
            <div className="overflow-hidden rounded-lg bg-panel shadow-panel" key={item._id}>
              {item.type === "image" ? <img className="aspect-video w-full object-cover" src={item.url} alt={item.alt} /> : <video className="aspect-video w-full object-cover" src={item.url} muted controls />}
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="mt-1 truncate text-xs text-muted">{item.url}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-6">
        <ActionTable
          rows={media.map((item) => ({ id: item._id, title: item.title, subtitle: `${item.type} | ${item.alt}`, status: item.active ? "active" : "inactive", updatedAt: new Date(item.updatedAt).toLocaleDateString("en-IN") }))}
          onToggle={(id) => {
            const item = media.find((mediaItem) => mediaItem._id === id);
            if (item) updateMutation.mutate({ id, payload: { active: !item.active } });
          }}
          onEdit={(id) => {
            const item = media.find((mediaItem) => mediaItem._id === id);
            if (item) setEditingMedia(item);
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingMedia ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4">
          <form
            className="w-full max-w-xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              updateMutation.mutate({
                id: editingMedia._id,
                payload: {
                  title: editingMedia.title,
                  url: editingMedia.url,
                  type: editingMedia.type,
                  alt: editingMedia.alt,
                  active: editingMedia.active
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit Media</h2>
                <p className="mt-1 text-sm text-muted">Update asset details and visibility.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingMedia(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingMedia.title} onChange={(event) => setEditingMedia({ ...editingMedia, title: event.target.value })} />
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingMedia.url} onChange={(event) => setEditingMedia({ ...editingMedia, url: event.target.value })} />
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingMedia.alt} onChange={(event) => setEditingMedia({ ...editingMedia, alt: event.target.value })} />
              <select className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingMedia.type} onChange={(event) => setEditingMedia({ ...editingMedia, type: event.target.value as ApiMedia["type"] })}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input checked={editingMedia.active} onChange={(event) => setEditingMedia({ ...editingMedia, active: event.target.checked })} type="checkbox" />
                Active
              </label>
            </div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save Media"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
