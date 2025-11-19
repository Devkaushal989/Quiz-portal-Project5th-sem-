const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authMiddleware } = require('../controllers/authController');

router.use(authMiddleware);

router.get('/students', assignmentController.getAllStudents);
router.post('/assign', assignmentController.assignQuiz);
router.get('/teacher/assignments', assignmentController.getTeacherAssignments);
router.delete('/:id', assignmentController.deleteAssignment);

router.get('/student/assignments', assignmentController.getStudentAssignments);

module.exports = router;
