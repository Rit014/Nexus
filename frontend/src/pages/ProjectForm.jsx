import { useState } from "react";
import API from "../lib/api";

const ProjectForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/projects", { name, description });
      alert("Project created!");
      if (onCreated) onCreated(res.data);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-5
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl shadow-sm"
    >
      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
        New Project
      </h3>
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Project description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="border border-gray-300 dark:border-gray-600
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700
          text-white font-semibold py-2.5 rounded-lg text-sm
          transition-colors cursor-pointer"
      >
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;