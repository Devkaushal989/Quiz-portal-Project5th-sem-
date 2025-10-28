const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware } = require('../controllers/authController');

// All routes require authentication
router.use(authMiddleware);

// Create course
router.post('/', courseController.createCourse);

// Get all courses
router.get('/', courseController.getCourses);

// Get single course
router.get('/:id', courseController.getCourseById);

// Update course
router.put('/:id', courseController.updateCourse);

// Delete course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;