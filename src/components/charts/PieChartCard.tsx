import { Pie } from "react-chartjs-2";
import type { ChartPoint } from "../../types/dashboard";
import { ChartCard } from "./ChartCard";

interface PieChartCardProps {
  title: string;
  data: ChartPoint[];
  colors: string[];
}

export function PieChartCard({ title, data, colors }: PieChartCardProps) {
  if (data.length === 0) {
    return (
      <ChartCard title={title}>
        <p className="chart-empty">No data available.</p>
      </ChartCard>
    );
  }

  const backgroundColor = data.map((_, index) => colors[index % colors.length]);

  return (
    <ChartCard title={title}>
      <Pie
        data={{
          labels: data.map((point) => point.label),
          datasets: [
            {
              data: data.map((point) => point.value),
              backgroundColor,
              borderColor: "#ffffff",
              borderWidth: 2
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                font: {
                  size: 11
                }
              }
            }
          }
        }}
      />
    </ChartCard>
  );
}
