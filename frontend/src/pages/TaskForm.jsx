import { useState } from "react";
import API from "../lib/api";

const TaskForm = ({ projectId, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To-Do");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/tasks", {
        title,
        description,
        projectId,
        priority,
        status,
        dueDate,
      });
      alert("Task created!");
      if (onCreated) onCreated(res.data);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("To-Do");
      setDueDate("");
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-md">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 rounded">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded">
        <option>To-Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-black text-white px-8 py-3 rounded w-full cursor-pointer"
      >
        Create Task
      </button>

    </form>
  );
};

export default TaskForm;
