const Task = require('../models/Task.js');
const Project = require('../models/Project');

const getTask = async (req, res) => {
    try {
        const { status, priority } = req.query; // Get filters from the URL
        let query = { user: req.user.id };

        // If the user sends /api/tasks?status=Done, we filter by that
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query).sort({ createdAt: -1 }); // Newest first
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
};



// Create a task inside a specific project
// POST /api/tasks
const createTask = async (req, res) => {
    const { title, description, projectId, priority, status, dueDate } = req.body;

    const project = await Project.findOne({ _id: projectId, user: req.user.id });

    if (!project) {
        return res.status(404).json({ message: "Project not found or you don't own it" });
    }

    if (!title || !projectId) {
        res.status(400);
        throw new Error('Please add a title and select a project');
    }

    try {
        const task = await Task.create({
            user: req.user._id,
            project: projectId, // Linking the task to the project ID
            title,
            description,
            priority: priority || 'Medium',
            status: status || 'To-Do',
            dueDate: dueDate || null
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error creating task" });
    }
};

// Get tasks for a SPECIFIC project
// GET /api/tasks/:projectId
const getTasksByProject = async (req, res) => {
    const tasks = await Task.find({
        project: req.params.projectId,
        user: req.user.id
    });
    res.status(200).json(tasks);
};


const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status || "To-Do",
                priority: req.body.priority || "Medium",
                dueDate: req.body.dueDate || null,
            },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update task" });
    }
};

const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized to delete this task" });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
}


module.exports = { getTask, createTask, getTasksByProject, updateTask, deleteTask };