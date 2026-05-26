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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-md">
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Project description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-primary text-white py-2 rounded cursor-pointer">
        Create Project
      </button>
    </form>
  );
};

export default ProjectForm;
