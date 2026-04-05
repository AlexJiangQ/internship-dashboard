import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <section className={`chart-card ${className ?? ""}`.trim()}>
      <h3>{title}</h3>
      <div className="chart-card-body">{children}</div>
    </section>
  );
}
