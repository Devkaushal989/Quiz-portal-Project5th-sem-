const express = require('express');
const router = express.Router();
const questionPoolController = require('../controllers/questionPoolController');
const { authMiddleware } = require('../controllers/authController');

router.use(authMiddleware);

router.post('/', questionPoolController.createQuestionPool);

router.get('/', questionPoolController.getQuestionPools);

router.get('/:id', questionPoolController.getQuestionPoolById);

router.put('/:id', questionPoolController.updateQuestionPool);

router.delete('/:id', questionPoolController.deleteQuestionPool);

module.exports = router;