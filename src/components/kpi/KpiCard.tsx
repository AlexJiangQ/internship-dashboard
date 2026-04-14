interface KpiCardProps {
  title: string;
  value: string;
}

export function KpiCard({ title, value }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
    </article>
  );
}
