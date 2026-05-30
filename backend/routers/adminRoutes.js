const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {getUserStats} = require("../controllers/adminController")
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const { createAdmin, getUsers, updateUserRole, deleteUser } = require("../controllers/adminController");

// Create new admin
router.post("/create", protect, adminOnly, createAdmin);

// Get all users
router.get("/users", protect, adminOnly, getUsers);

// Update user role
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// Delete user
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Get stats for a user
router.get("/users/:id/stats", protect, adminOnly, async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments({ user: req.params.id });
    const tasksCount = await Task.countDocuments({ user: req.params.id });

    res.json({ projectsCount, tasksCount });
  } catch (err) {
    console.error("Stats route error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/users/${user._id}/stats", protect, adminOnly, getUserStats);

module.exports = router;
