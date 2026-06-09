import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";
import TaskForm from "./TaskForm";
import Modal from "#components/Modal";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDeleteProject = async (projectId) => {
    try {
      await API.delete(`/projects/${projectId}`);
      alert("Project deleted successfully!");
      window.location.href = "/projects";
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProject = () => setProjectModalOpen(true);

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        name: e.target.name.value,
        description: e.target.description.value,
      };
      const res = await API.put(`/projects/${project._id}`, updated);
      setProject(res.data);
      setProjectModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        title: e.target.title.value,
        description: e.target.description.value,
      };
      const res = await API.put(`/tasks/${selectedTask._id}`, updated);
      setTasks(tasks.map((t) => (t._id === selectedTask._id ? res.data : t)));
      setTaskModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await API.get(`/projects/${id}`);
        setProject(projectRes.data);
        const tasksRes = await API.get(`/tasks?projectId=${id}`);
        setTasks(tasksRes.data);
      } catch (err) {
        setError("Project not found");
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p className="text-red-500 dark:text-red-400 p-4">{error}</p>;
  if (!project) return <p className="text-gray-500 dark:text-gray-400 p-4">Loading project...</p>;

  const inputCls = `w-full border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    rounded-lg px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Project header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {project.name}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleEditProject}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Edit Project
          </button>
          <button
            onClick={() => handleDeleteProject(project._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400">{project.description}</p>

      {/* Tasks list */}
      <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
        Tasks
      </h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tasks yet for this project.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                p-4 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {task.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Status: {task.status} | Priority: {task.priority}
              </p>
              {task.dueDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Task form — ✅ onTaskCreated adds new task instantly without refresh */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
          Add a Task
        </h3>
        <TaskForm
          projectId={project._id}
          onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
        />
      </div>

      {/* Project Edit Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} title="Edit Project">
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <input type="text" name="name" defaultValue={project.name} className={inputCls} />
          <textarea name="description" defaultValue={project.description} className={inputCls} />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Save Changes
          </button>
        </form>
      </Modal>

      {/* Task Edit Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Edit Task">
        {selectedTask && (
          <form onSubmit={handleUpdateTask} className="space-y-4">
            <input type="text" name="title" defaultValue={selectedTask.title} className={inputCls} />
            <textarea name="description" defaultValue={selectedTask.description} className={inputCls} />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Save Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetails;