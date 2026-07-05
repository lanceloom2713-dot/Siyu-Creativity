import { AlertTriangle, Pencil, Power, Search, Send, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

type ActionTableRow = {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  updatedAt: string;
};

type ActionTableProps = {
  rows: ActionTableRow[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ActionTable({
  rows,
  searchPlaceholder = "Search records",
  emptyMessage = "No records yet.",
  primaryActionLabel,
  onPrimaryAction,
  onEdit,
  onToggle,
  onDelete
}: ActionTableProps) {
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ActionTableRow | null>(null);
  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => `${row.title} ${row.subtitle ?? ""} ${row.status}`.toLowerCase().includes(normalized));
  }, [query, rows]);

  return (
    <>
      <div className="overflow-hidden rounded-lg bg-panel shadow-panel">
        <div className="flex flex-col gap-3 border-b border-ink/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              className="min-h-11 w-full rounded-lg border border-ink/10 pl-10 pr-4 text-sm outline-none focus:border-accent"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              value={query}
            />
          </div>
          <p className="text-sm font-semibold text-muted">{visibleRows.length} shown</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-shell text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr className="border-t border-ink/5" key={row.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{row.title}</p>
                    {row.subtitle ? <p className="mt-1 text-xs text-muted">{row.subtitle}</p> : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-ink">{row.status}</span>
                  </td>
                  <td className="px-5 py-4 text-muted">{row.updatedAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {onPrimaryAction && primaryActionLabel ? (
                        <button className="inline-flex items-center gap-1 rounded-lg border border-ink/10 px-3 py-2 font-semibold" onClick={() => onPrimaryAction(row.id)} type="button">
                          <Send size={14} />
                          {primaryActionLabel}
                        </button>
                      ) : null}
                      {onToggle ? (
                        <button className="rounded-lg border border-ink/10 p-2" onClick={() => onToggle(row.id)} type="button" aria-label="Toggle status">
                          <Power size={16} />
                        </button>
                      ) : null}
                      {onEdit ? (
                        <button className="rounded-lg border border-ink/10 p-2" onClick={() => onEdit(row.id)} type="button" aria-label="Edit">
                          <Pencil size={16} />
                        </button>
                      ) : null}
                      {onDelete ? (
                        <button className="rounded-lg border border-ink/10 p-2 text-red-600" onClick={() => setDeleteTarget(row)} type="button" aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleRows.length ? <div className="border-t border-ink/5 p-8 text-center text-sm font-semibold text-muted">{emptyMessage}</div> : null}
        </div>
      </div>

      {deleteTarget && onDelete ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ink/35 p-4">
          <div className="w-full max-w-md rounded-lg bg-panel p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="rounded-lg bg-red-50 p-2 text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Delete record?</h2>
                  <p className="mt-1 text-sm text-muted">This will permanently remove “{deleteTarget.title}”.</p>
                </div>
              </div>
              <button className="rounded-lg border border-ink/10 p-2" onClick={() => setDeleteTarget(null)} type="button" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-lg border border-ink/10 px-4 py-2 text-sm font-semibold" onClick={() => setDeleteTarget(null)} type="button">
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  onDelete(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
