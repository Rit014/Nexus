import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import API from "../lib/api";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";
import DashboardCharts from "#components/DashboardCharts";
import TaskList from "#components/TaskList";
import { Skeleton } from "#components/ui/skeleton";
import Projects from "../pages/Projects";

// Stat card icons
const icons = {
  projects:  "📁",
  tasks:     "✅",
  deadlines: "⏰",
};

const StatCard = ({ title, value, loading, icon, accent }) => (
  <div className={`relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden`}>
    {/* Accent bar */}
    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${accent}`} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-2" />
        ) : (
          <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {value}
          </p>
        )}
      </div>
      <span className="text-3xl opacity-80">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [lastProjectId, setLastProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const { setDeadlinesCount, setUpcomingTasks } = useOutletContext();

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await API.get("/tasks");
      setTasks(res.data);

      const pending = res.data.filter(
        (t) => t.status === "To-Do" || t.status === "In Progress"
      );
      setPendingTasksCount(pending.length);

      const upcoming = res.data.filter((t) => {
        if (!t.dueDate) return false;
        const diff = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      });
      setDeadlinesCount(upcoming.length);
      setUpcomingTasks(upcoming);
    } catch (err) {
      console.error("Task fetch error:", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await API.get("/projects");
      setProjectsCount(res.data.length);
      if (res.data.length > 0) {
        setLastProjectId(res.data[res.data.length - 1]._id);
      }
    } catch (err) {
      console.error("Project fetch error:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const deadlinesCount = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const diff = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <div className="space-y-8">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Projects"
          value={projectsCount}
          loading={loadingProjects}
          icon={icons.projects}
          accent="bg-indigo-500"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasksCount}
          loading={loadingTasks}
          icon={icons.tasks}
          accent="bg-amber-400"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={deadlinesCount}
          loading={loadingTasks}
          icon={icons.deadlines}
          accent="bg-rose-500"
        />
      </div>

      {/* ── Charts ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Overview
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
          Visual breakdown of your tasks
        </p>
        <DashboardCharts tasks={tasks} loading={loadingTasks} />
      </div>

      {/* ── Forms ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectForm onCreated={(project) => setLastProjectId(project._id)} />
        {lastProjectId && (
          <TaskForm projectId={lastProjectId} onTaskCreated={fetchTasks} />
        )}
      </div>

      {/* ── Projects list ── */}
      <Projects />

      {/* ── Tasks list ── */}
      <TaskList tasks={tasks} loading={loadingTasks} />
    </div>
  );
};

export default Dashboard;