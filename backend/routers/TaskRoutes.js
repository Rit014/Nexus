const express = require('express');
const router = express.Router();
const { getTask, createTask, updateTask, deleteTask, getTasksByProject } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTask);
router.post('/', protect, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/project/:projectId', protect, getTasksByProject);


module.exports = router;