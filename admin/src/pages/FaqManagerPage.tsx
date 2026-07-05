import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

export function FaqManagerPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: faqs = [] } = useQuery({ queryKey: ["admin-faqs"], queryFn: adminCmsApi.listFaqs });
  const createMutation = useMutation({
    mutationFn: adminCmsApi.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      notify("FAQ created.");
    },
    onError: () => notify("FAQ save failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof adminCmsApi.updateFaq>[1] }) => adminCmsApi.updateFaq(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      notify("FAQ updated.");
      setEditingFaq(null);
    },
    onError: () => notify("FAQ update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      notify("FAQ deleted.");
    },
    onError: () => notify("FAQ delete failed.", "error")
  });
  const [form, setForm] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState<{ id: string; question: string; answer: string; active: boolean } | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    createMutation.mutate(form);
    setForm({ question: "", answer: "" });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">FAQs</h1>
      <p className="mt-2 text-sm text-muted">Create, edit, reorder, publish, and hide frequently asked questions.</p>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-2" onSubmit={submit}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="FAQ question" value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="FAQ answer" value={form.answer} onChange={(event) => setForm({ ...form, answer: event.target.value })} />
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">{createMutation.isPending ? "Creating..." : "Create FAQ"}</button>
      </form>
      <div className="mt-6">
        <ActionTable
          rows={faqs.map((faq) => ({
            id: faq._id,
            title: faq.question,
            subtitle: faq.answer,
            status: faq.active ? "active" : "inactive",
            updatedAt: new Date(faq.updatedAt).toLocaleDateString("en-IN")
          }))}
          onToggle={(id) => {
            const faq = faqs.find((item) => item._id === id);
            if (faq) updateMutation.mutate({ id, payload: { active: !faq.active } });
          }}
          onEdit={(id) => {
            const faq = faqs.find((item) => item._id === id);
            if (faq) {
              setEditingFaq({ id: faq._id, question: faq.question, answer: faq.answer, active: faq.active });
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
      {editingFaq ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4">
          <form
            className="w-full max-w-xl rounded-lg bg-panel p-5 shadow-panel"
            onSubmit={(event) => {
              event.preventDefault();
              updateMutation.mutate({
                id: editingFaq.id,
                payload: {
                  question: editingFaq.question,
                  answer: editingFaq.answer,
                  active: editingFaq.active
                }
              });
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Edit FAQ</h2>
                <p className="mt-1 text-sm text-muted">Update question, answer, and website visibility.</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setEditingFaq(null)} type="button">
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-4">
              <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingFaq.question} onChange={(event) => setEditingFaq({ ...editingFaq, question: event.target.value })} />
              <textarea className="min-h-28 rounded-lg border border-ink/10 px-4 py-3 text-sm" value={editingFaq.answer} onChange={(event) => setEditingFaq({ ...editingFaq, answer: event.target.value })} />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input checked={editingFaq.active} onChange={(event) => setEditingFaq({ ...editingFaq, active: event.target.checked })} type="checkbox" />
                Active on website
              </label>
            </div>
            <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={updateMutation.isPending} type="submit">
              {updateMutation.isPending ? "Saving..." : "Save FAQ"}
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
