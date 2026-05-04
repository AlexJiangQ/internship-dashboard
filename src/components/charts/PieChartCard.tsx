import { Pie } from "react-chartjs-2";
import type { ArcElement, Plugin } from "chart.js";
import type { ChartPoint } from "../../types/dashboard";
import { ChartCard } from "./ChartCard";

interface PieChartCardProps {
  title: string;
  data: ChartPoint[];
  colors: string[];
  showPercentageLabels?: boolean;
  minPercentageLabelThreshold?: number;
}

const DEFAULT_PERCENTAGE_LABEL_THRESHOLD = 5;

function createPiePercentageLabelPlugin(minThreshold: number): Plugin<"pie"> {
  return {
    id: "piePercentageLabelPlugin",
    afterDatasetsDraw(chart) {
      const dataset = chart.data.datasets[0];
      if (!dataset) {
        return;
      }

      const values = dataset.data.map((value) => Number(value) || 0);
      const total = values.reduce((sum, value) => sum + value, 0);
      if (total <= 0) {
        return;
      }

      const meta = chart.getDatasetMeta(0);
      const { ctx } = chart;
      ctx.save();
      ctx.font = "600 11px Arial";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      meta.data.forEach((arcElement, index) => {
        const value = values[index] ?? 0;
        if (value <= 0) {
          return;
        }

        const percentage = (value / total) * 100;
        if (percentage < minThreshold) {
          return;
        }

        const arc = arcElement as ArcElement;
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.62;
        const x = arc.x + Math.cos(angle) * radius;
        const y = arc.y + Math.sin(angle) * radius;
        const text = `${percentage >= 10 ? percentage.toFixed(0) : percentage.toFixed(1)}%`;

        ctx.fillText(text, x, y);
      });

      ctx.restore();
    }
  };
}

export function PieChartCard({
  title,
  data,
  colors,
  showPercentageLabels = false,
  minPercentageLabelThreshold = DEFAULT_PERCENTAGE_LABEL_THRESHOLD
}: PieChartCardProps) {
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
        plugins={
          showPercentageLabels
            ? [createPiePercentageLabelPlugin(minPercentageLabelThreshold)]
            : undefined
        }
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
