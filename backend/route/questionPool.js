const express = require('express');
const router = express.Router();
const questionPoolController = require('../controllers/questionPoolController');
const { authMiddleware } = require('../controllers/authController');

// All routes require authentication
router.use(authMiddleware);

// Create question pool
router.post('/', questionPoolController.createQuestionPool);

// Get all question pools
router.get('/', questionPoolController.getQuestionPools);

// Get single question pool
router.get('/:id', questionPoolController.getQuestionPoolById);

// Update question pool
router.put('/:id', questionPoolController.updateQuestionPool);

// Delete question pool
router.delete('/:id', questionPoolController.deleteQuestionPool);

module.exports = router;