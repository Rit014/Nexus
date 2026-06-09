import { useState } from "react";
import API from "../lib/api";

const inputCls = `
  w-full border border-gray-300 dark:border-gray-600
  bg-white dark:bg-gray-700
  text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  rounded-lg px-3 py-2 text-sm
  focus:outline-none focus:ring-2 focus:ring-indigo-500
  transition-colors
`.trim();

const TaskForm = ({ projectId, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To-Do");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/tasks", {
        title,
        description,
        projectId,
        priority,
        status,
        dueDate,
      });
      if (onTaskCreated) onTaskCreated(res.data);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("To-Do");
      setDueDate("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-5
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-2xl shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
          New Task
        </h3>
        {success && (
          <span className="text-xs text-emerald-500 font-medium animate-pulse">
            ✅ Task created!
          </span>
        )}
      </div>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={inputCls}
      />

      <textarea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className={inputCls}
      />

      {/* Priority + Status side by side */}
      <div className="grid grid-cols-2 gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={inputCls}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={inputCls}
        >
          <option>To-Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={inputCls}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
          text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
};

export default TaskForm;