const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { authMiddleware } = require('../controllers/authController');

// Teacher routes
router.get('/teacher/all', authMiddleware, resultController.getTeacherResults);
router.get('/teacher/filter', authMiddleware, resultController.getResultsByProgramSemester);
router.get('/statistics', authMiddleware, resultController.getResultStatistics);
router.get('/export', authMiddleware, resultController.prepareResultsExport);
router.get('/leaderboard', authMiddleware, resultController.getLeaderboard);

// Student routes
router.get('/student/history', authMiddleware, resultController.getStudentQuizHistory);

// Common routes
router.get('/details/:attemptId', authMiddleware, resultController.getResultDetails);

module.exports = router;