import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import API from "../lib/api";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";
import DashboardCharts from "#components/DashboardCharts";
import TaskList from "#components/TaskList";

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [lastProjectId, setLastProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);

  // ✅ get setters from DashboardLayout via Outlet context
  const { setDeadlinesCount, setUpcomingTasks } = useOutletContext();

  const fetchTasks = async () => {
    try {
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

      // ✅ update parent layout state
      setDeadlinesCount(upcoming.length);
      setUpcomingTasks(upcoming);
    } catch (err) {
      console.error("Task fetch error:", err);
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
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          <p className="text-2xl font-bold">{projectsCount}</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="text-2xl font-bold">{pendingTasksCount}</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
          {/* ✅ deadlinesCount now comes from parent layout */}
          <p className="text-2xl font-bold">
            {/* This card can show tasks.length or rely on parent */}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <DashboardCharts tasks={tasks} />
      </div>

      {/* Forms */}
      <div className="grid grid-cols-2 gap-6">
        <ProjectForm onCreated={(project) => setLastProjectId(project._id)} />
        {lastProjectId && (
          <TaskForm projectId={lastProjectId} onTaskCreated={fetchTasks} />
        )}
      </div>

      <div>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default Dashboard;
