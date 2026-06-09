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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No projects yet. Create one from the dashboard!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                hover:bg-gray-50 dark:hover:bg-gray-700
                p-6 rounded-xl shadow-sm transition-colors"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {project.description}
              </p>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
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