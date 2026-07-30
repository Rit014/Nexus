const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { generateToken } = require("../utils/generateToken");

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role: "Admin" });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["Admin", "User"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  if (role === "User") {
    const adminCount = await User.countDocuments({ role: "Admin" });
    const target = await User.findById(req.params.id);
    if (target?.role === "Admin" && adminCount <= 1) {
      return res.status(400).json({ message: "Cannot demote the last remaining admin" });
    }
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Delete user — blocks deletion if the user owns data, unless a reassignTo target is provided
const deleteUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.role === "Admin") {
      const adminCount = await User.countDocuments({ role: "Admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last remaining admin" });
      }
    }

    const projectsCount = await Project.countDocuments({ user: target._id });
    const tasksCount = await Task.countDocuments({ user: target._id });


    const { reassignTo } = req.body || {};

    // If they own data and no reassignment target was given, block and report counts
    if ((projectsCount > 0 || tasksCount > 0) && !reassignTo) {
      return res.status(409).json({
        message: `${target.name} owns ${projectsCount} project(s) and ${tasksCount} task(s). Choose a user to reassign this data to before deleting.`,
        requiresReassignment: true,
        projectsCount,
        tasksCount,
      });
    }

    // If a reassignment target was given, validate it and move the data over
    if (reassignTo) {
      if (reassignTo === String(target._id)) {
        return res.status(400).json({ message: "Cannot reassign data to the user being deleted" });
      }
      const newOwner = await User.findById(reassignTo);
      if (!newOwner) {
        return res.status(404).json({ message: "Reassignment target user not found" });
      }
      await Project.updateMany({ user: target._id }, { user: reassignTo });
      await Task.updateMany({ user: target._id }, { user: reassignTo });
    }

    await User.findByIdAndDelete(req.params.id);
    const deletedSelf = req.user._id.toString() === req.params.id;

    res.json({
      message: reassignTo
        ? `User deleted. ${projectsCount} project(s) and ${tasksCount} task(s) reassigned.`
        : "User deleted",
      id: req.params.id,
      deletedSelf,
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const projects = await Project.countDocuments({ user: userId });
    const tasks = await Task.countDocuments({ user: userId });
    const upcomingDeadlines = await Task.countDocuments({
      user: userId,
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({ projects, tasks, upcomingDeadlines });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

// Admin: view ALL projects across every user, with owner info populated
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Admin get all projects error:", err.message);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

// Admin: view ALL tasks across every user, with owner info populated
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("user", "name email").populate("project", "name").sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Admin get all tasks error:", err.message);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// Admin: reassign a single project to a different user
const reassignProject = async (req, res) => {
  try {
    const { newUserId } = req.body;
    if (!newUserId) return res.status(400).json({ message: "newUserId is required" });

    const newOwner = await User.findById(newUserId);
    if (!newOwner) return res.status(404).json({ message: "Target user not found" });

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { user: newUserId },
      { new: true }
    ).populate("user", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Reassign project error:", err.message);
    res.status(500).json({ message: "Server error reassigning project" });
  }
};

// Admin: reassign a single task to a different user
const reassignTask = async (req, res) => {
  try {
    const { newUserId } = req.body;
    if (!newUserId) return res.status(400).json({ message: "newUserId is required" });

    const newOwner = await User.findById(newUserId);
    if (!newOwner) return res.status(404).json({ message: "Target user not found" });

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { user: newUserId },
      { new: true }
    ).populate("user", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("Reassign task error:", err.message);
    res.status(500).json({ message: "Server error reassigning task" });
  }
};

module.exports = {
  createAdmin,
  getUsers,
  updateUserRole,
  deleteUser,
  getUserStats,
  getAllProjects,
  getAllTasks,
  reassignProject,
  reassignTask,
};