import { useEffect, useState } from "react";
import API from "../lib/api";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-600">
          No projects yet. Create one from the dashboard!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block bg-card text-card-foreground p-6 rounded-lg shadow-md border border-border hover:bg-slate-50 dark:hover:bg-gray-800"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.description}</p>
              <p className="mt-2 text-sm">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
