// controllers/adminController.js
const User = require('../models/User')
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
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Flag if admin deleted themselves
        const deletedSelf = req.user._id.toString() === req.params.id;

        res.json({ 
            message: "User deleted", 
            id: req.params.id,
            deletedSelf  // ✅ send this flag to frontend
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const projectCount = await Project.countDocuments({ owner: userId });
    const taskCount = await Task.countDocuments({ assignedTo: userId });
    const upcomingDeadlines = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7*24*60*60*1000) }
    });

    res.json({
      projects: projectCount,
      tasks: taskCount,
      upcomingDeadlines
    });
  } catch (error) {
    console.error("Admin stats error:", error.message);
    res.status(500).json({ msg: "Server error fetching stats" });
  }
};

module.exports = { createAdmin, getUsers, updateUserRole, deleteUser, getUserStats };
