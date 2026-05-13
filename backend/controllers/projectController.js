const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects" });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Please add a project name');
    }

    const project = await Project.create({
        name,
        description,
        user: req.user.id,
    });

    res.status(201).json(project);
};

// @desc    Delete a project and its associated tasks
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project || project.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Project not found or unauthorized" });
    }

    // Pro Move: If a project is deleted, delete all tasks inside it too!
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();

    res.status(200).json({ id: req.params.id, message: "Project and its tasks deleted" });
};

module.exports = { getProjects, createProject, deleteProject };
