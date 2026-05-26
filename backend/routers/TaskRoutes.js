const express = require('express');
const router = express.Router();
const { getTask, createTask, updateTask, deleteTask, getTasksByProject } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTask)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)     
  .delete(protect, deleteTask);

router.get('/project/:projectId', protect, getTasksByProject);


module.exports = router;