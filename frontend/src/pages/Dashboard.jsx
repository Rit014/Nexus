import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import API from "../lib/api";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";
import DashboardCharts from "#components/DashboardCharts";
import TaskList from "#components/TaskList";
import { Skeleton } from "#components/ui/skeleton";
import Projects from "../pages/Projects"  // ✅ Import Projects

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [lastProjectId, setLastProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // ✅ setters from DashboardLayout
  const { setDeadlinesCount, setUpcomingTasks } = useOutletContext();

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await API.get("/tasks");
      setTasks(res.data);

      // Pending tasks
      const pending = res.data.filter(
        (t) => t.status === "To-Do" || t.status === "In Progress"
      );
      setPendingTasksCount(pending.length);

      // Upcoming deadlines (within 7 days)
      const upcoming = res.data.filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        const now = new Date();
        const diff = (due - now) / (1000 * 60 * 60 * 24);
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
      const projectsRes = await API.get("/projects");
      setProjectsCount(projectsRes.data.length);

      if (projectsRes.data.length > 0) {
        setLastProjectId(projectsRes.data[projectsRes.data.length - 1]._id);
      }
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  return (
    <div className="space-y-8">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          {projectsCount === 0 ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold">{projectsCount}</p>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          {loadingTasks ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold">{pendingTasksCount}</p>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
          {loadingTasks ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold">
              {tasks.filter((t) => {
                if (!t.dueDate) return false;
                const due = new Date(t.dueDate);
                const now = new Date();
                const diff = (due - now) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 7;
              }).length}
            </p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Dashboard</h2>
        <DashboardCharts tasks={tasks} loading={loadingTasks} />
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectForm onCreated={(project) => setLastProjectId(project._id)} />
        {lastProjectId && (
          <TaskForm projectId={lastProjectId} onTaskCreated={fetchTasks} />
        )}
      </div>

      {/* Projects list */}
      <Projects />

      {/* Tasks list */}
      <div>
        <TaskList tasks={tasks} loading={loadingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
