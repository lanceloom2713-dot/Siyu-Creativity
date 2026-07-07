import { FormEvent, useState } from "react";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function ContactPage() {
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: publicCatalogueApi.getSettings });
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const mutation = useMutation({
    mutationFn: publicCatalogueApi.createContact,
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(false);
    setFormError("");
    if (form.name.trim().length < 2) {
      setFormError("Please enter your name.");
      return;
    }
    if (form.phone.trim().length < 8) {
      setFormError("Please enter a valid phone number.");
      return;
    }
    if (form.message.trim().length < 3) {
      setFormError("Please write a short enquiry message.");
      return;
    }
    mutation.mutate({ ...form, recipientEmail: settings?.enquiryEmail ?? settings?.email });
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div className="rounded-[2rem] border border-ink/5 bg-white/70 p-6 shadow-soft">
        <h1 className="font-display text-5xl font-semibold">Contact Siyu Creativity</h1>
        <div className="mt-8 grid gap-4 text-sm text-ink/70">
          <p className="flex items-center gap-3"><MessageCircle size={18} /> WhatsApp: {settings?.whatsapp ?? "+91 99999 99999"}</p>
          <p className="flex items-center gap-3"><Phone size={18} /> Phone: {settings?.phone ?? "+91 99999 99999"}</p>
          <p className="flex items-center gap-3"><Mail size={18} /> {settings?.email ?? "siyucreativity11@gmail.com"}</p>
          <p className="flex items-center gap-3"><MapPin size={18} /> {settings?.address ?? "India"}</p>
          {settings?.enquiryEmail && settings.enquiryEmail !== settings?.email ? (
            <p className="flex items-center gap-3"><Mail size={18} /> Enquiries: {settings.enquiryEmail}</p>
          ) : null}
        </div>
      </div>
      <form className="rounded-[2rem] border border-ink/5 bg-white p-6 shadow-soft" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-ink/10 px-4 py-3" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="rounded-2xl border border-ink/10 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className="rounded-2xl border border-ink/10 px-4 py-3 md:col-span-2" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <textarea className="min-h-36 rounded-2xl border border-ink/10 px-4 py-3 md:col-span-2" placeholder="Tell us what you would like customized" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        </div>
        <button className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white" type="submit">
          {mutation.isPending ? "Sending..." : "Send Enquiry"}
        </button>
        {formError ? <p className="mt-4 text-sm font-semibold text-red-600">{formError}</p> : null}
        {sent ? <p className="mt-4 text-sm font-semibold text-green-700">Enquiry sent. We will contact you soon.</p> : null}
        {mutation.isError ? <p className="mt-4 text-sm font-semibold text-red-600">Could not send enquiry. Please try WhatsApp.</p> : null}
      </form>
    </section>
  );
}
