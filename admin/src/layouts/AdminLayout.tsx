import { LogOut } from "lucide-react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { adminModules } from "../constants/modules";
import { useAuthStore } from "../store/authStore";

export function AdminLayout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-shell text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-ink/10 bg-panel px-4 py-5">
        <div className="px-3">
          <p className="text-lg font-bold">Siyu Admin</p>
          <p className="text-xs text-muted">Catalogue CMS</p>
        </div>
        <nav className="mt-6 grid gap-1">
          {adminModules.map(({ label, path, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-accent text-white" : "text-muted hover:bg-shell hover:text-ink"}`
              }
              key={path}
              to={path}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-ink/10 bg-panel px-6 py-4">
          <div>
            <p className="text-sm font-semibold">Enterprise Admin CMS</p>
            <p className="text-xs text-muted">Manage catalogue, content, enquiries, and SEO.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-ink/10 px-3 py-2 text-sm font-semibold" onClick={logout} type="button">
            <LogOut size={16} />
            Logout
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
