const express = require('express');
const router = express.Router();
const { getTask, createTask, updateTask, deleteTask, getTasksByProject } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const Task = require("../models/Task");

router.route('/')
  .get(protect, getTask)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)     
  .delete(protect, deleteTask);

router.get('/project/:projectId', protect, getTasksByProject);

// Get upcoming tasks (next 7 days)
router.get("/upcoming", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user._id, // only tasks for logged-in user
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // next 7 days
      }
    }).select("title dueDate");

    res.json(tasks);
  } catch (err) {
    console.error("Upcoming tasks error:", err.message);
    res.status(500).json({ msg: "Server error fetching upcoming tasks" });
  }
});

router.get("/status-summary", protect, async (req, res) => {
  try {
    const pending = await Task.countDocuments({ assignedTo: req.user._id, status: "Pending" });
    const inProgress = await Task.countDocuments({ assignedTo: req.user._id, status: "In Progress" });
    const completed = await Task.countDocuments({ assignedTo: req.user._id, status: "Completed" });

    res.json([
      { name: "Pending", value: pending },
      { name: "In Progress", value: inProgress },
      { name: "Completed", value: completed }
    ]);
  } catch (err) {
    console.error("Status summary error:", err.message);
    res.status(500).json({ msg: "Error fetching task summary" });
  }
});



module.exports = router;