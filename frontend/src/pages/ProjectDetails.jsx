import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../lib/api";

const ProjectDetails = () => {
    const { id } = useParams(); // projectId from URL
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

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
    if (error) return <p className="text-red-500">{error}</p>;
    if (!project) return <p>Loading project...</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>

            <h3 className="text-xl font-semibold mt-4">Tasks</h3>
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet for this project.</p>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li
                            key={task._id}
                            className="bg-card text-card-foreground p-4 rounded-lg border border-border"
                        >
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-gray-500">{task.description}</p>
                            <p className="text-sm">
                                Status: {task.status} | Priority: {task.priority}
                            </p>
                            {task.dueDate && (
                                <p className="text-sm">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProjectDetails;
