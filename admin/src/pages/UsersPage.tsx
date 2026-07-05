import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionTable } from "../components/ActionTable";
import { useToast } from "../components/ToastProvider";
import { adminCmsApi, type ApiAdminUser } from "../services/adminCmsApi";

export function UsersPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data: adminUsers = [] } = useQuery({ queryKey: ["admin-users"], queryFn: adminCmsApi.listUsers });
  const createMutation = useMutation({
    mutationFn: adminCmsApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify("Admin user created.");
    },
    onError: () => notify("User save failed.", "error")
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => adminCmsApi.updateUser(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify("User status updated.");
    },
    onError: () => notify("User update failed.", "error")
  });
  const deleteMutation = useMutation({
    mutationFn: adminCmsApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      notify("Admin user deleted.");
    },
    onError: () => notify("User delete failed.", "error")
  });
  const [form, setForm] = useState({ name: "", email: "", role: "editor" as ApiAdminUser["role"], password: "Admin@12345" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    createMutation.mutate(form);
    setForm({ name: "", email: "", role: "editor", password: "Admin@12345" });
  };

  return (
    <section>
      <h1 className="text-2xl font-bold">Admin Users</h1>
      <p className="mt-2 text-sm text-muted">Create and manage admin-only users and permissions.</p>
      <form className="mt-5 grid gap-4 rounded-lg bg-panel p-5 shadow-panel lg:grid-cols-4" onSubmit={submit}>
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="rounded-lg border border-ink/10 px-4 py-3 text-sm" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <select className="rounded-lg border border-ink/10 px-4 py-3 text-sm" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as ApiAdminUser["role"] })}>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <button className="w-fit rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={createMutation.isPending} type="submit">{createMutation.isPending ? "Creating..." : "Create User"}</button>
      </form>
      <div className="mt-6">
        <ActionTable
          rows={adminUsers.map((user) => ({ id: user._id, title: user.name, subtitle: `${user.email} | ${user.role}`, status: user.active ? "active" : "inactive", updatedAt: new Date(user.updatedAt).toLocaleDateString("en-IN") }))}
          onToggle={(id) => {
            const user = adminUsers.find((item) => item._id === id);
            if (user) updateMutation.mutate({ id, active: !user.active });
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
    </section>
  );
}
