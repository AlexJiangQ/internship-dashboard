import { useEffect, useMemo, useState } from "react";
import { PerformanceDistributionBar } from "../../components/charts/PerformanceDistributionBar";
import { PieChartCard } from "../../components/charts/PieChartCard";
import { TopCompaniesBar } from "../../components/charts/TopCompaniesBar";
import { KpiCard } from "../../components/kpi/KpiCard";
import { PreferenceSelectionPanel } from "../../components/preferences/PreferenceSelectionPanel";
import { readInternshipRows } from "../../lib/data/excelReader";
import {
  computeDashboardStats,
  createEmptyStats
} from "../../lib/data/stats";
import {
  OVERVIEW_FILTER_OPTIONS,
  type OverviewFilterOption,
  computeOverviewKpis,
  computePerformanceDistributionByGrade,
  filterRowsByOverviewOption
} from "../../lib/data/overview";
import {
  buildSubmittedPreferencePayload,
  createEmptyPreferencePayload,
  getAllWorkNatureOptions,
  getAvailableJobPositions,
  getSuggestedWorkNatureOptions,
  syncSelectedJobPositionsWithDirections,
  toggleStudentPreferenceSelection,
  toggleJobDirectionSelection,
  toggleJobPositionSelection,
  toggleWorkNatureSelection,
  updateDurationSelection
} from "../../lib/preferences/preferenceState";
import {
  DURATION_OPTIONS,
  JOB_DIRECTION_OPTIONS,
  STUDENT_PREFERENCE_OPTIONS
} from "../../lib/preferences/preferenceOptions";
import type {
  DashboardComputationResult,
  InternshipRow,
  PreferencePayload
} from "../../types/dashboard";

type ActiveView = "overview" | "dashboard" | "chatbot";

const navItems: Array<{ id: ActiveView; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "dashboard", label: "Dashboard" },
  { id: "chatbot", label: "AI Chatbot" }
];
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

function formatOverviewKpis(kpis: ReturnType<typeof computeOverviewKpis>) {
  return [
    { title: "Internship Records", value: numberFormatter.format(kpis.internshipRecords) },
    { title: "Total Companies", value: numberFormatter.format(kpis.totalCompanies) },
    { title: "Avg Working Days", value: kpis.avgWorkingDays.toFixed(0) },
    { title: "Avg Daily Hours", value: `${kpis.avgDailyHours.toFixed(1)}h` }
  ];
}

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [rawRows, setRawRows] = useState<InternshipRow[]>([]);
  const [result, setResult] = useState<DashboardComputationResult>({
    stats: createEmptyStats(),
    warnings: []
  });
  const [error, setError] = useState<string | null>(null);
  const [draftSelections, setDraftSelections] = useState<PreferencePayload>(
    createEmptyPreferencePayload()
  );
  const [submittedPreferences, setSubmittedPreferences] =
    useState<PreferencePayload | null>(null);
  const [showAllWorkNature, setShowAllWorkNature] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("overview");
  const [overviewFilter, setOverviewFilter] =
    useState<OverviewFilterOption>("Overall");
  const [dashboardFilter, setDashboardFilter] =
    useState<OverviewFilterOption>("Overall");

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
        setRawRows(rows);
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

  const filteredOverviewRows = useMemo(
    () => filterRowsByOverviewOption(rawRows, overviewFilter),
    [rawRows, overviewFilter]
  );
  const filteredDashboardRows = useMemo(
    () => filterRowsByOverviewOption(rawRows, dashboardFilter),
    [rawRows, dashboardFilter]
  );
  const dashboardResult = useMemo(
    () => computeDashboardStats(filteredDashboardRows),
    [filteredDashboardRows]
  );
  const overviewKpis = useMemo(
    () => computeOverviewKpis(filteredOverviewRows),
    [filteredOverviewRows]
  );
  const overviewKpiItems = useMemo(
    () => formatOverviewKpis(overviewKpis),
    [overviewKpis]
  );
  const gradeDistribution = useMemo(
    () => computePerformanceDistributionByGrade(filteredOverviewRows),
    [filteredOverviewRows]
  );

  const allWorkNatureOptions = useMemo(() => getAllWorkNatureOptions(), []);
  const availableJobPositions = useMemo(
    () => getAvailableJobPositions(draftSelections.jobDirections),
    [draftSelections.jobDirections]
  );
  const suggestedWorkNatureOptions = useMemo(
    () => getSuggestedWorkNatureOptions(draftSelections.jobPositions),
    [draftSelections.jobPositions]
  );
  const displayedWorkNatureOptions = useMemo(
    () => {
      if (draftSelections.jobPositions.length === 0) {
        return [];
      }
      return showAllWorkNature ? allWorkNatureOptions : suggestedWorkNatureOptions;
    },
    [
      allWorkNatureOptions,
      draftSelections.jobPositions.length,
      showAllWorkNature,
      suggestedWorkNatureOptions
    ]
  );
  const showJobPositionPlaceholder = availableJobPositions.length === 0;
  const showWorkNaturePlaceholder = draftSelections.jobPositions.length === 0;

  useEffect(() => {
    if (showWorkNaturePlaceholder && showAllWorkNature) {
      setShowAllWorkNature(false);
    }
  }, [showAllWorkNature, showWorkNaturePlaceholder]);

  const handleSkillToggle = (option: string) => {
    setDraftSelections((current) =>
      toggleStudentPreferenceSelection(current, "skills", option)
    );
  };

  const handleDurationChange = (duration: string) => {
    setDraftSelections((current) => updateDurationSelection(current, duration));
  };

  const handleJobDirectionToggle = (direction: string) => {
    setDraftSelections((current) => {
      const updatedDirections = toggleJobDirectionSelection(current, direction);
      return syncSelectedJobPositionsWithDirections(updatedDirections);
    });
  };

  const handleJobPositionToggle = (position: string) => {
    setDraftSelections((current) => toggleJobPositionSelection(current, position));
  };

  const handleWorkNatureToggle = (workNature: string) => {
    setDraftSelections((current) => toggleWorkNatureSelection(current, workNature));
  };

  const handleSubmitPreference = () => {
    const payload = buildSubmittedPreferencePayload(draftSelections);
    setSubmittedPreferences(payload);
    localStorage.setItem("recommendation_preferences", JSON.stringify(payload));
  };

  const chatbotOutput = useMemo(
    () => submittedPreferences ?? createEmptyPreferencePayload(),
    [submittedPreferences]
  );

  return (
    <div className="page-shell">
      <header className="top-nav">
        <div className="brand">Internship Finder</div>
        <nav className="nav-links" aria-label="primary">
          {navItems.map((item) => (
            <a
              href="#"
              key={item.id}
              className={item.id === activeView ? "active" : ""}
              onClick={(event) => {
                event.preventDefault();
                setActiveView(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="dashboard-layout">
        {activeView === "overview" ? (
          <>
            <section className="hero">
              <p className="hero-label">Overview</p>
              <h1>Internship Finder Overview</h1>
              <p className="hero-description">
                This dashboard summarizes historical internship records, helps
                students understand relevant internship patterns, and supports
                AI-based job recommendations with relevant information.
              </p>
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

            {!isLoading && !error ? (
              <>
                <section className="overview-filter-card">
                  <h3>View Internship Data By</h3>
                  <div className="segmented-control" role="tablist" aria-label="View Internship Data By">
                    {OVERVIEW_FILTER_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`segment-btn ${overviewFilter === option ? "active" : ""}`}
                        onClick={() => setOverviewFilter(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </section>

                <section className="kpi-grid" aria-label="overview indicators">
                  {overviewKpiItems.map((item) => (
                    <KpiCard key={item.title} title={item.title} value={item.value} />
                  ))}
                </section>

                <PerformanceDistributionBar data={gradeDistribution} />

                <section className="overview-guide">
                  <h3>How to Use This Dashboard</h3>
                  <div className="overview-guide-grid">
                    <article className="overview-guide-card">
                      <h4>Overview</h4>
                      <p>
                        Understand the dataset and gain a general impression of
                        internship outcomes using overall records or a selected major.
                      </p>
                    </article>
                    <article className="overview-guide-card">
                      <h4>Dashboard</h4>
                      <p>
                        Explore detailed internship patterns, including company
                        internship volume rankings, duration distribution, skill distribution,
                        and preference selection.
                      </p>
                    </article>
                    <article className="overview-guide-card">
                      <h4>AI Chatbot</h4>
                      <p>
                        Use the structured preference output to support AI-based job
                        recommendations, including suggested Job Position and relevant
                        information.
                      </p>
                    </article>
                  </div>
                </section>
              </>
            ) : null}
          </>
        ) : activeView === "dashboard" ? (
          <>
            <section className="hero">
              <p className="hero-label">Dashboard</p>
              <h1>Detailed Internship Analysis</h1>
              <p className="hero-description">
                This section provides detailed visual analysis of internship
                records, including Company Distribution, Duration Distribution,
                Technical Skills, Work Focus Areas.
              </p>
            </section>

            {!isLoading && !error ? (
              <section className="overview-filter-card">
                <h3>View Internship Data By</h3>
                <div className="segmented-control" role="tablist" aria-label="View Internship Data By">
                  {OVERVIEW_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`segment-btn ${dashboardFilter === option ? "active" : ""}`}
                      onClick={() => setDashboardFilter(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {isLoading ? (
              <div className="status-card">Loading internship workbook...</div>
            ) : null}

            {!isLoading && error ? (
              <div className="status-card error">
                Unable to render dashboard. {error}
              </div>
            ) : null}

            {!isLoading && !error && dashboardResult.warnings.length > 0 ? (
              <div className="status-card warning">
                {dashboardResult.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            ) : null}

            {!isLoading && !error && dashboardResult.stats.kpis.totalPositions === 0 ? (
              <div className="status-card">No internship records found.</div>
            ) : null}

            {!isLoading && !error && dashboardResult.stats.kpis.totalPositions > 0 ? (
              <>
                <TopCompaniesBar data={dashboardResult.stats.topCompanies} />

                <section className="pie-grid">
                  <PieChartCard
                    title="Duration Distribution"
                    data={dashboardResult.stats.workIntensity}
                    colors={intensityColors}
                    showPercentageLabels
                  />
                  <PieChartCard
                    title="TOP 10 Technical Skills"
                    data={dashboardResult.stats.technicalSkills}
                    colors={skillColors}
                    showPercentageLabels
                    minPercentageLabelThreshold={10}
                  />
                  <PieChartCard
                    title="TOP 10 Work Focus Areas"
                    data={dashboardResult.stats.workFocusAreas}
                    colors={focusColors}
                    showPercentageLabels
                    minPercentageLabelThreshold={10}
                  />
                </section>

                <PreferenceSelectionPanel
                  value={draftSelections}
                  skillsOptions={STUDENT_PREFERENCE_OPTIONS.skills}
                  durationOptions={DURATION_OPTIONS}
                  jobDirectionOptions={JOB_DIRECTION_OPTIONS}
                  availableJobPositions={availableJobPositions}
                  displayedWorkNatureOptions={displayedWorkNatureOptions}
                  showJobPositionPlaceholder={showJobPositionPlaceholder}
                  showWorkNaturePlaceholder={showWorkNaturePlaceholder}
                  showAllWorkNature={showAllWorkNature}
                  canShowAllWorkNatureToggle={!showWorkNaturePlaceholder}
                  onSkillToggle={handleSkillToggle}
                  onDurationChange={handleDurationChange}
                  onJobDirectionToggle={handleJobDirectionToggle}
                  onJobPositionToggle={handleJobPositionToggle}
                  onWorkNatureToggle={handleWorkNatureToggle}
                  onToggleShowAllWorkNature={() =>
                    setShowAllWorkNature((current) => !current)
                  }
                  onSubmit={handleSubmitPreference}
                />
              </>
            ) : null}
          </>
        ) : (
          <section className="preference-output chatbot-output">
            <h3>Structured Preference Output</h3>
            <pre>{JSON.stringify(chatbotOutput, null, 2)}</pre>
          </section>
        )}
      </main>
    </div>
  );
}
