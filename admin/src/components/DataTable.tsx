import type { AdminTableRow } from "../types/cms";

export function DataTable({ rows }: { rows: AdminTableRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-panel shadow-panel">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-shell text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-5 py-4">Title</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-t border-ink/5" key={row.id}>
              <td className="px-5 py-4 font-semibold text-ink">{row.title}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold capitalize text-ink">{row.status}</span>
              </td>
              <td className="px-5 py-4 text-muted">{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
