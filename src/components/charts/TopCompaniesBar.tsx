import { Bar } from "react-chartjs-2";
import type { ChartPoint } from "../../types/dashboard";
import { ChartCard } from "./ChartCard";

interface TopCompaniesBarProps {
  data: ChartPoint[];
}

export function TopCompaniesBar({ data }: TopCompaniesBarProps) {
  if (data.length === 0) {
    return (
      <ChartCard title="TOP 10 Companies" className="chart-large">
        <p className="chart-empty">No company data available.</p>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="TOP 10 Companies" className="chart-large">
      <Bar
        data={{
          labels: data.map((point) => point.label),
          datasets: [
            {
              label: "Number of Positions",
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
              ticks: {
                maxRotation: 38,
                minRotation: 38,
                autoSkip: false,
                font: {
                  size: 10
                }
              },
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
