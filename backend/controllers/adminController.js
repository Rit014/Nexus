// controllers/adminController.js
const User = require('../models/User')
const Project = require('../models/Project');
const Task = require('../models/Task.js');
const { generateToken } = require("../utils/generateToken")

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

// Delete user
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

    await User.findByIdAndDelete(req.params.id);
    const deletedSelf = req.user._id.toString() === req.params.id;

    res.json({ message: "User deleted", id: req.params.id, deletedSelf });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const projects = await Project.countDocuments({ user: userId });      // ✅ fixed field name
    const tasks = await Task.countDocuments({ user: userId });            // ✅ fixed field name
    const upcomingDeadlines = await Task.countDocuments({
      user: userId,                                                       // ✅ fixed field name
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7*24*60*60*1000) }
    });

    res.json({ projects, tasks, upcomingDeadlines });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

module.exports = { createAdmin, getUsers, updateUserRole, deleteUser, getUserStats };
