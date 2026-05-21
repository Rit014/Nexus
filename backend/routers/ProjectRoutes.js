const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProjectById, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const Project = require('../models/Project');

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject)

router.route('/:id')
    .get(protect, getProjectById)
    .delete (protect, deleteProject)


module.exports = router;
