import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Skeleton } from "#components/ui/skeleton";

const DashboardCharts = ({ tasks, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 border rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Task Status</h3>
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="p-6 border rounded bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Task Priority</h3>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  // ✅ Status distribution
  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#f87171", "#fbbf24", "#34d399"], // red, yellow, green
      },
    ],
  };

  // ✅ Priority distribution
  const priorityCounts = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});

  const priorityData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        label: "Task Priority",
        data: Object.values(priorityCounts),
        backgroundColor: ["#ef4444", "#3b82f6", "#10b981"], // red, blue, green
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-bold mb-2">Task Status</h3>
        <Pie data={statusData} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="font-bold mb-2">Task Priority</h3>
        <Bar data={priorityData} />
      </div>
    </div>
  );
};

export default DashboardCharts;
