const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createAdmin, getUsers, updateUserRole, deleteUser, getUserStats } = require("../controllers/adminController");

// Create new admin
router.post("/create", protect, adminOnly, createAdmin);

// Get all users
router.get("/users", protect, adminOnly, getUsers);

// Update user role
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// Delete user
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Get stats for a user
router.get("/users/:id/stats", protect, adminOnly, getUserStats);

module.exports = router;