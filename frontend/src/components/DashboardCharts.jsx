import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Skeleton } from "#components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const STATUS_COLORS = {
  "To-Do":       { bg: "#6366f1", light: "#e0e7ff" },
  "In Progress": { bg: "#f59e0b", light: "#fef3c7" },
  "Done":        { bg: "#10b981", light: "#d1fae5" },
};

const PRIORITY_COLORS = {
  "High":   { bg: "#ef4444", light: "#fee2e2" },
  "Medium": { bg: "#f59e0b", light: "#fef3c7" },
  "Low":    { bg: "#10b981", light: "#d1fae5" },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 16,
        font: { size: 13 },
        usePointStyle: true,
        pointStyleWidth: 10,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed} tasks`,
      },
    },
  },
  cutout: "60%", // donut style
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y} tasks`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 13 } },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: { size: 12 },
      },
      grid: { color: "rgba(0,0,0,0.06)" },
    },
  },
};

// Stat pill shown in centre of donut / above bar
const StatBadge = ({ label, value, color }) => (
  <div
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
    style={{ backgroundColor: color.light, color: color.bg }}
  >
    <span
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: color.bg }}
    />
    {label}: {value}
  </div>
);

const DashboardCharts = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800"
          >
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-52 w-full rounded-xl" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Status data ──
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = Object.keys(statusCounts);
  const statusData = {
    labels: statusLabels,
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: statusLabels.map((l) => STATUS_COLORS[l]?.bg ?? "#94a3b8"),
      borderWidth: 3,
      borderColor: "#fff",
      hoverOffset: 6,
    }],
  };

  // ── Priority data ──
  const priorityCounts = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});
  const priorityLabels = Object.keys(priorityCounts);
  const priorityData = {
    labels: priorityLabels,
    datasets: [{
      data: Object.values(priorityCounts),
      backgroundColor: priorityLabels.map((l) => PRIORITY_COLORS[l]?.bg ?? "#94a3b8"),
      borderRadius: 8,
      borderSkipped: false,
      barThickness: 40,
    }],
  };

  const totalTasks = tasks.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

      {/* ── Task Status — Donut ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Task Status
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {totalTasks} total tasks
            </p>
          </div>
          <span className="text-2xl font-bold text-indigo-500">{totalTasks}</span>
        </div>

        {totalTasks === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No tasks yet
          </div>
        ) : (
          <>
            <div className="max-w-[240px] mx-auto">
              <Pie data={statusData} options={pieOptions} />
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {statusLabels.map((l) => (
                <StatBadge
                  key={l}
                  label={l}
                  value={statusCounts[l]}
                  color={STATUS_COLORS[l] ?? { bg: "#94a3b8", light: "#f1f5f9" }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Task Priority — Bar ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Task Priority
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Breakdown by priority level
            </p>
          </div>
        </div>

        {totalTasks === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            No tasks yet
          </div>
        ) : (
          <>
            <Bar data={priorityData} options={barOptions} />
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {priorityLabels.map((l) => (
                <StatBadge
                  key={l}
                  label={l}
                  value={priorityCounts[l]}
                  color={PRIORITY_COLORS[l] ?? { bg: "#94a3b8", light: "#f1f5f9" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;