const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createAdmin,
  getUsers,
  updateUserRole,
  deleteUser,
  getUserStats,
  getAllProjects,
  getAllTasks,
  reassignProject,
  reassignTask,
} = require("../controllers/adminController");

// Create new admin
router.post("/create", protect, adminOnly, createAdmin);

// Get all users
router.get("/users", protect, adminOnly, getUsers);

// Update user role
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// Delete user (supports { reassignTo } in body when the user owns data)
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Get stats for a user
router.get("/users/:id/stats", protect, adminOnly, getUserStats);

// Admin: view all projects / tasks across every user
router.get("/projects", protect, adminOnly, getAllProjects);
router.get("/tasks", protect, adminOnly, getAllTasks);

// Admin: reassign a single project / task to a different user
router.put("/projects/:id/reassign", protect, adminOnly, reassignProject);
router.put("/tasks/:id/reassign", protect, adminOnly, reassignTask);

module.exports = router;