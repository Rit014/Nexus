import { useEffect, useState } from "react";
import API from "../lib/api";
import TaskForm from "../pages/TaskForm";
import TaskList from "../components/TaskList";

const TaskPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Fetch all projects for the dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
        // Auto-select first project if available
        if (res.data.length > 0) setSelectedProjectId(res.data[0]._id);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Tasks
      </h2>

      {/* Project selector */}
      {projects.length === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
          <p className="text-amber-700 dark:text-amber-300 text-sm font-medium">
            ⚠️ You need to create a project before adding tasks.
          </p>
        </div>
      ) : (
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Select Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Task form — only show when a project is selected */}
      {selectedProjectId && (
        <div className="max-w-md">
          <TaskForm
            projectId={selectedProjectId}
            onTaskCreated={handleTaskCreated}
          />
        </div>
      )}

      {/* Task list */}
      <TaskList tasks={tasks} loading={loadingTasks} />
    </div>
  );
};

export default TaskPage;