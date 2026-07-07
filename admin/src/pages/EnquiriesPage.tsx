import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ActionTable } from "../components/ActionTable";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi, type ApiEnquiry } from "../services/adminCmsApi";

const nextStatus = (status: ApiEnquiry["status"]) => (status === "new" ? "contacted" : status === "contacted" ? "closed" : "closed");
const whatsappUrl = (enquiry: ApiEnquiry) => `https://wa.me/${enquiry.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${enquiry.name}, thanks for contacting Siyu Creativity. We received your enquiry: ${enquiry.message}`)}`;

export function EnquiriesPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: enquiries = [] } = useQuery({ queryKey: ["admin-enquiries"], queryFn: adminCmsApi.listEnquiries });
  const [selected, setSelected] = useState<ApiEnquiry | null>(null);
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiEnquiry["status"] }) => adminCmsApi.updateEnquiry(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] });
      notify("Enquiry status updated.");
    },
    onError: () => notify("Enquiry update failed.", "error")
  });

  return (
    <section>
      <h1 className="text-2xl font-bold">Contact Enquiries</h1>
      <p className="mt-2 text-sm text-muted">Track catalogue enquiries and move them from new to contacted to closed.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {(["new", "contacted", "closed"] as const).map((status) => (
          <div className="rounded-lg bg-panel p-4 shadow-panel" key={status}>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{status}</p>
            <p className="mt-2 text-3xl font-bold">{enquiries.filter((enquiry) => enquiry.status === status).length}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <ActionTable
          emptyMessage="No enquiries yet."
          rows={enquiries.map((enquiry) => ({
            id: enquiry._id,
            title: `${enquiry.name} | ${enquiry.phone}`,
            subtitle: `${enquiry.email ?? "No email"} | Mail: ${enquiry.emailSent ? "sent" : enquiry.emailError ? "failed" : "pending"} | ${enquiry.message}`,
            status: enquiry.status,
            updatedAt: new Date(enquiry.updatedAt).toLocaleDateString("en-IN")
          }))}
          primaryActionLabel="Next"
          onPrimaryAction={(id) => {
            const enquiry = enquiries.find((item) => item._id === id);
            if (!enquiry) return;
            updateMutation.mutate({ id, status: nextStatus(enquiry.status) });
          }}
          onEdit={(id) => {
            const enquiry = enquiries.find((item) => item._id === id);
            if (enquiry) setSelected(enquiry);
          }}
        />
      </div>
      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4">
          <div className="w-full max-w-xl rounded-lg bg-panel p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="mt-1 text-sm text-muted">{selected.phone}</p>
              </div>
              <button className="rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={() => setSelected(null)} type="button">
                Close
              </button>
            </div>
            <p className="mt-5 rounded-lg bg-shell p-4 text-sm leading-6">{selected.message}</p>
            <div className="mt-4 rounded-lg border border-ink/10 bg-white p-4 text-sm text-muted">
              <p><strong className="text-ink">Recipient:</strong> {selected.recipientEmail ?? "Not set"}</p>
              <p className="mt-1"><strong className="text-ink">Email status:</strong> {selected.emailSent ? "Sent" : "Not sent"}</p>
              {selected.emailError ? <p className="mt-1 text-red-600"><strong>Error:</strong> {selected.emailError}</p> : null}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold" href={`tel:${selected.phone}`}>
                <Phone size={16} />
                Call
              </a>
              <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold" href={whatsappUrl(selected)} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold" href={`mailto:${selected.email ?? ""}`}>
                <Mail size={16} />
                Email
              </a>
            </div>
            <select
              className="mt-5 w-full rounded-lg border border-ink/10 px-4 py-3 text-sm"
              value={selected.status}
              onChange={(event) => {
                const status = event.target.value as ApiEnquiry["status"];
                updateMutation.mutate({ id: selected._id, status });
                setSelected({ ...selected, status });
              }}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      ) : null}
    </section>
  );
}
