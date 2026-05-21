import { useEffect, useState } from "react";
import API from "../lib/api";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [deadlinesCount, setDeadlinesCount] = useState(0);
  const [lastProjectId, setLastProjectId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsRes = await API.get("/projects");
        setProjectsCount(projectsRes.data.length);

        // Save the most recent project ID (so TaskForm can use it)
        if (projectsRes.data.length > 0) {
          setLastProjectId(projectsRes.data[projectsRes.data.length - 1]._id);
        }

        // Fetch tasks
        const tasksRes = await API.get("/tasks");
        const tasks = tasksRes.data;

        // Pending tasks
        const pending = tasks.filter(
          (t) => t.status === "To-Do" || t.status === "In Progress"
        );
        setPendingTasksCount(pending.length);

        // Upcoming deadlines (within 7 days)
        const upcoming = tasks.filter((t) => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate);
          const now = new Date();
          const diff = (due - now) / (1000 * 60 * 60 * 24);
          return diff >= 0 && diff <= 7;
        });
        setDeadlinesCount(upcoming.length);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Dashboard cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
          <h3 className="text-lg font-semibold">Active Projects</h3>
          <p className="text-2xl font-bold">{projectsCount}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
          <h3 className="text-lg font-semibold">Pending Tasks</h3>
          <p className="text-2xl font-bold">{pendingTasksCount}</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border">
          <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
          <p className="text-2xl font-bold">{deadlinesCount}</p>
        </div>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-2 gap-6">
        <ProjectForm onCreated={(project) => setLastProjectId(project._id)} />
        {lastProjectId && <TaskForm projectId={lastProjectId} />}
      </div>
    </div>
  );
};

export default Dashboard;
