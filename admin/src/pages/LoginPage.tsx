import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCmsApi } from "../services/adminCmsApi";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@siyucreativity.com", password: "Admin@12345" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await adminCmsApi.login(form.email, form.password);
      setToken(result.token);
      navigate("/");
    } catch {
      setError("Login failed. Check email, password, and backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-shell px-4">
      <form className="w-full max-w-md rounded-lg bg-panel p-8 shadow-panel" onSubmit={submit}>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-lg border border-ink/10 px-4 py-3" onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" type="email" value={form.email} />
          <input className="rounded-lg border border-ink/10 px-4 py-3" onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" type="password" value={form.password} />
        </div>
        <button className="mt-6 w-full rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white" disabled={loading} type="submit">
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
