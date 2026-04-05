import { useEffect, useMemo, useState } from "react";
import { PieChartCard } from "../../components/charts/PieChartCard";
import { TopCompaniesBar } from "../../components/charts/TopCompaniesBar";
import { KpiCard } from "../../components/kpi/KpiCard";
import { readInternshipRows } from "../../lib/data/excelReader";
import {
  computeDashboardStats,
  createEmptyStats
} from "../../lib/data/stats";
import type { DashboardComputationResult } from "../../types/dashboard";

const navItems = ["Dashboard", "AI Chatbot", "Filter", "Upload Data", "Config", "Settings"];
const numberFormatter = new Intl.NumberFormat("en-US");

const intensityColors = ["#5AB8A0", "#1f64d1", "#f59f00", "#e03131", "#adb5bd"];
const skillColors = [
  "#163f90",
  "#1f64d1",
  "#4f83d1",
  "#7aa7e1",
  "#9ec5ef",
  "#abd8f2",
  "#c8e6f7",
  "#72b5de",
  "#4c9fcd",
  "#2f7ea8"
];
const focusColors = [
  "#0e3e8d",
  "#1f64d1",
  "#2d88c4",
  "#3fa8b6",
  "#5ab8a0",
  "#75c197",
  "#95cb92",
  "#69a8d6",
  "#2f60b3",
  "#173f82"
];

function formatKpis(stats: DashboardComputationResult["stats"]) {
  return [
    { title: "Total Companies", value: numberFormatter.format(stats.kpis.totalCompanies) },
    { title: "Total Positions", value: numberFormatter.format(stats.kpis.totalPositions) },
    { title: "Avg Working Days", value: stats.kpis.avgWorkingDays.toFixed(0) },
    { title: "Avg Daily Hours", value: `${stats.kpis.avgDailyHours.toFixed(1)}h` }
  ];
}

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<DashboardComputationResult>({
    stats: createEmptyStats(),
    warnings: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadRows = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const rows = await readInternshipRows("/data/internship.xlsx");
        if (!isMounted) {
          return;
        }
        setResult(computeDashboardStats(rows));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load internship data."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadRows();
    return () => {
      isMounted = false;
    };
  }, []);

  const kpiItems = useMemo(() => formatKpis(result.stats), [result.stats]);

  return (
    <div className="page-shell">
      <header className="top-nav">
        <div className="brand">Internship Finder</div>
        <nav className="nav-links" aria-label="primary">
          {navItems.map((item) => (
            <a
              href="#"
              key={item}
              className={item === "Dashboard" ? "active" : ""}
              onClick={(event) => event.preventDefault()}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main className="dashboard-layout">
        <section className="hero">
          <p className="hero-label">Dashboard</p>
          <h1>Overview of internship opportunities</h1>
        </section>

        {isLoading ? (
          <div className="status-card">Loading internship workbook...</div>
        ) : null}

        {!isLoading && error ? (
          <div className="status-card error">
            Unable to render dashboard. {error}
          </div>
        ) : null}

        {!isLoading && !error && result.warnings.length > 0 ? (
          <div className="status-card warning">
            {result.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        ) : null}

        {!isLoading && !error && result.stats.kpis.totalPositions === 0 ? (
          <div className="status-card">No internship records found.</div>
        ) : null}

        {!isLoading && !error && result.stats.kpis.totalPositions > 0 ? (
          <>
            <section className="kpi-grid" aria-label="key indicators">
              {kpiItems.map((item) => (
                <KpiCard key={item.title} title={item.title} value={item.value} />
              ))}
            </section>

            <TopCompaniesBar data={result.stats.topCompanies} />

            <section className="pie-grid">
              <PieChartCard
                title="Work Intensity Distribution"
                data={result.stats.workIntensity}
                colors={intensityColors}
              />
              <PieChartCard
                title="TOP 10 Technical Skills"
                data={result.stats.technicalSkills}
                colors={skillColors}
              />
              <PieChartCard
                title="TOP 10 Work Focus Areas"
                data={result.stats.workFocusAreas}
                colors={focusColors}
              />
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
