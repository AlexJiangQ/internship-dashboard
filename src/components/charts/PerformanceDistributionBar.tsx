import { Bar } from "react-chartjs-2";
import type { ChartPoint } from "../../types/dashboard";
import { ChartCard } from "./ChartCard";

interface PerformanceDistributionBarProps {
  data: ChartPoint[];
}

export function PerformanceDistributionBar({ data }: PerformanceDistributionBarProps) {
  return (
    <ChartCard title="Performance Distribution (Grade)" className="chart-large">
      <Bar
        data={{
          labels: data.map((point) => point.label),
          datasets: [
            {
              label: "Number of Records",
              data: data.map((point) => point.value),
              borderRadius: 6,
              backgroundColor: "#1f64d1"
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }}
      />
    </ChartCard>
  );
}
