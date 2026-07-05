import { FormEvent, useState } from "react";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { publicCatalogueApi } from "../services/publicCatalogueApi";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const mutation = useMutation({
    mutationFn: publicCatalogueApi.createContact,
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;
    mutation.mutate(form);
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="font-display text-5xl font-semibold">Contact Siyu Creativity</h1>
        <div className="mt-8 grid gap-4 text-sm text-ink/70">
          <p className="flex items-center gap-3"><MessageCircle size={18} /> WhatsApp: +91 99999 99999</p>
          <p className="flex items-center gap-3"><Phone size={18} /> Phone: +91 99999 99999</p>
          <p className="flex items-center gap-3"><Mail size={18} /> hello@siyucreativity.com</p>
          <p className="flex items-center gap-3"><MapPin size={18} /> India</p>
        </div>
      </div>
      <form className="rounded-[2rem] bg-white p-6 shadow-soft" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-ink/10 px-4 py-3" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="rounded-2xl border border-ink/10 px-4 py-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <input className="rounded-2xl border border-ink/10 px-4 py-3 md:col-span-2" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <textarea className="min-h-36 rounded-2xl border border-ink/10 px-4 py-3 md:col-span-2" placeholder="Tell us what you would like customized" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        </div>
        <button className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white" type="submit">
          {mutation.isPending ? "Sending..." : "Send Enquiry"}
        </button>
        {sent ? <p className="mt-4 text-sm font-semibold text-green-700">Enquiry sent. We will contact you soon.</p> : null}
        {mutation.isError ? <p className="mt-4 text-sm font-semibold text-red-600">Could not send enquiry. Please try WhatsApp.</p> : null}
      </form>
    </section>
  );
}
