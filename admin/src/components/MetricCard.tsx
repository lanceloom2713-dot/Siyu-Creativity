import type { DashboardMetric } from "../types/cms";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <div className="rounded-lg bg-panel p-5 shadow-panel">
      <p className="text-sm font-medium text-muted">{metric.label}</p>
      <p className="mt-3 text-3xl font-bold text-ink">{metric.value}</p>
      <p className="mt-2 text-sm text-muted">{metric.helper}</p>
    </div>
  );
}
