import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";
import TaskForm from "./TaskForm";
import Modal from "#components/Modal";
import ConfirmDialog from "#components/ConfirmDialog";
import AISuggestTasks from "#components/AISuggestTasks";
import AIProjectSummary from "#components/AIProjectSummary";
import { toast } from 'sonner';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // ── Confirmation dialog state ──
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    destructive: false,
    onConfirm: () => { },
  });

  const closeConfirm = () => setConfirmState((prev) => ({ ...prev, open: false }));

  // ── Project: Delete ──
  const confirmDeleteProject = () => {
    setConfirmState({
      open: true,
      title: "Delete this project?",
      description: `"${project.name}" and all its tasks will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete Project",
      destructive: true,
      onConfirm: async () => {
        try {
          await API.delete(`/projects/${project._id}`);
          toast.success("Project deleted successfully!");
          window.location.href = "/projects";
        } catch (err) {
          toast.error("Failed to delete project. Please try again.");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  const handleEditProject = () => setProjectModalOpen(true);

  // ── Project: Update ──
  const confirmUpdateProject = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;

    // No changes? Just close the modal, skip confirmation entirely.
    if (name === project.name && description === (project.description || "")) {
      setProjectModalOpen(false);
      return;
    }

    setConfirmState({
      open: true,
      title: "Save changes to this project?",
      description: "Your edits will be saved immediately.",
      confirmText: "Save Changes",
      destructive: false,
      onConfirm: async () => {
        try {
          const res = await API.put(`/projects/${project._id}`, { name, description });
          setProject(res.data);
          toast.success("Project updated successfully!");
          setProjectModalOpen(false);
        } catch (err) {
          toast.error("Failed to update project. Please try again.");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  // ── Task: Delete ──
  const confirmDeleteTask = (taskId) => {
    setConfirmState({
      open: true,
      title: "Delete this task?",
      description: "This cannot be undone.",
      confirmText: "Delete Task",
      destructive: true,
      onConfirm: async () => {
        try {
          await API.delete(`/tasks/${taskId}`);
          setTasks(tasks.filter((t) => t._id !== taskId));
          toast.success("Task deleted successfully!");
        } catch (err) {
          toast.error("Failed to delete task. Please try again.");
        } finally {
          closeConfirm();
        }
      },
    });
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  // ── Task: Update ──
  const confirmUpdateTask = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;

    if (title === selectedTask.title && description === (selectedTask.description || "")) {
      setTaskModalOpen(false);
      return;
    }

    setConfirmState({
      open: true,
      title: "Save changes to this task?",
      description: "Your edits will be saved immediately.",
      confirmText: "Save Changes",
      destructive: false,
      onConfirm: async () => {
        try {
          const res = await API.put(`/tasks/${selectedTask._id}`, { title, description });
          setTasks(tasks.map((t) => (t._id === selectedTask._id ? res.data : t)));
          toast.success("Task updated successfully!");
          setTaskModalOpen(false);
        } catch (err) {
          toast.error("Failed to update task. Please try again.");
        } finally {
          closeConfirm();
        }
      },
    });
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

      {/* ── Project header ── */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {project.name}
        </h2>

        {project.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEditProject}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Edit Project
          </button>
          <button
            onClick={confirmDeleteProject}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Delete Project
          </button>
          <AIProjectSummary
            projectId={project._id}
            projectName={project.name}
            projectDescription={project.description}
            tasks={tasks}
          />
        </div>
      </div>

      {/* ── Tasks list ── */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
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
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteTask(task._id)}
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
      </div>

      {/* ── Add Task section ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Add a Task
          </h3>
          <AISuggestTasks
            projectId={project._id}
            projectName={project.name}
            projectDescription={project.description}
            onTasksCreated={(newTasks) => setTasks((prev) => [...newTasks, ...prev])}
          />
        </div>
        <div className="max-w-xl">
          <TaskForm
            projectId={project._id}
            onTaskCreated={(newTask) => setTasks((prev) => [newTask, ...prev])}
          />
        </div>
      </div>

      {/* Project Edit Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} title="Edit Project">
        <form onSubmit={confirmUpdateProject} className="space-y-4">
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
          <form onSubmit={confirmUpdateTask} className="space-y-4">
            <input type="text" name="title" defaultValue={selectedTask.title} className={inputCls} />
            <textarea name="description" defaultValue={selectedTask.description} className={inputCls} />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Save Changes
            </button>
          </form>
        )}
      </Modal>

      {/* Confirmation Dialog — shared for delete/update actions */}
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => !open && closeConfirm()}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        destructive={confirmState.destructive}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
};

export default ProjectDetails;