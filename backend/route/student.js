const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware } = require('../controllers/authController');

router.use(authMiddleware);

router.get('/courses', studentController.getAvailableCourses);

router.post('/quiz/start/:courseId', studentController.startQuiz);

router.post('/quiz/submit/:attemptId', studentController.submitQuiz);

router.get('/quiz/history', studentController.getQuizHistory);

router.get('/quiz/result/:attemptId', studentController.getQuizResult);

module.exports = router;