import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi } from "../services/adminCmsApi";

const defaultSettings = {
  whatsapp: "+91 99999 99999",
  phone: "+91 99999 99999",
  email: "siyucreativity11@gmail.com",
  enquiryEmail: "siyucreativity11@gmail.com",
  address: "Ghaziabad, India",
  businessHours: "Mon-Sat, 10:00 AM - 7:00 PM",
  aboutTitle: "About Siyu Creativity",
  aboutText: "Siyu Creativity creates personalized gifting and decor pieces with a soft pastel identity, thoughtful detailing, and a premium handmade finish."
};

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: settings = [] } = useQuery({ queryKey: ["admin-settings"], queryFn: adminCmsApi.listSettings });
  const websiteSettings = settings.find((item) => item.key === "website")?.value ?? defaultSettings;
  const [form, setForm] = useState(websiteSettings);
  const [saved, setSaved] = useState(false);
  const saveMutation = useMutation({
    mutationFn: adminCmsApi.saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      setSaved(true);
      notify("Website settings saved.");
    },
    onError: () => notify("Settings save failed.", "error")
  });

  useEffect(() => setForm(websiteSettings), [JSON.stringify(websiteSettings)]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Website Settings</h1>
      <p className="mt-2 text-sm text-muted">Manage WhatsApp number, phone, email, business hours, social links, and address details.</p>
      <form className="mt-6 grid max-w-3xl gap-4 rounded-lg bg-panel p-6 shadow-panel" onSubmit={submit}>
        {(["whatsapp", "phone", "email", "enquiryEmail", "address", "businessHours"] as const).map((key) => (
          <label className="grid gap-2 text-sm font-semibold" key={key}>
            {key}
            <input className="rounded-lg border border-ink/10 px-4 py-3 font-normal" value={form[key] ?? ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-semibold">
          aboutTitle
          <input className="rounded-lg border border-ink/10 px-4 py-3 font-normal" value={form.aboutTitle ?? ""} onChange={(event) => setForm({ ...form, aboutTitle: event.target.value })} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          aboutText
          <textarea className="min-h-32 rounded-lg border border-ink/10 px-4 py-3 font-normal" value={form.aboutText ?? ""} onChange={(event) => setForm({ ...form, aboutText: event.target.value })} />
        </label>
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={saveMutation.isPending} type="submit">{saveMutation.isPending ? "Saving..." : "Save Settings"}</button>
        {saved ? <p className="text-sm font-semibold text-green-700">Settings saved to MongoDB.</p> : null}
      </form>
    </section>
  );
}
