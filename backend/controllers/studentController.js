const Course = require('../models/Course');
const QuestionPool = require('../models/QuestionPool');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

exports.getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('questionPool')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: error.message
    });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate('questionPool');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const pool = await QuestionPool.findById(course.questionPool._id)
      .populate('easyQuestions')
      .populate('mediumQuestions')
      .populate('hardQuestions');

    if (!pool) {
      return res.status(404).json({
        success: false,
        message: 'Question pool not found'
      });
    }

    if (pool.easyQuestions.length < 10 || pool.mediumQuestions.length < 5 || pool.hardQuestions.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Not enough questions in the pool. Need at least 20 Easy, 10 Medium, and 10 Hard questions.',
        available: {
          easy: pool.easyQuestions.length,
          medium: pool.mediumQuestions.length,
          hard: pool.hardQuestions.length
        }
      });
    }

    const randomEasy = pool.easyQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    const randomMedium = pool.mediumQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    const randomHard = pool.hardQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const selectedQuestions = [...randomEasy, ...randomMedium, ...randomHard];
    
    const shuffledQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

    
    const questionsForStudent = shuffledQuestions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({ optionText: opt.optionText })),
      marks: q.marks,
      difficulty: q.difficulty
    }));

    const totalMarks = shuffledQuestions.reduce((sum, q) => sum + q.marks, 0);

    const quizAttempt = await QuizAttempt.create({
      student: req.user._id,
      course: courseId,
      questionPool: pool._id,
      questions: shuffledQuestions.map(q => ({
        question: q._id,
        selectedAnswer: null,
        isCorrect: false,
        marksObtained: 0
      })),
      totalQuestions: 20,
      totalMarks: totalMarks,
      status: 'in-progress'
    });

    res.status(200).json({
      success: true,
      data: {
        attemptId: quizAttempt._id,
        courseName: course.courseName,
        duration: course.duration,
        totalQuestions: 20,
        totalMarks: totalMarks,
        questions: questionsForStudent
      }
    });
  } catch (error) {
    console.error('Start Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting quiz',
      error: error.message
    });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, timeTaken } = req.body;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate('questions.question');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    if (attempt.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Quiz already submitted'
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let marksObtained = 0;

    attempt.questions.forEach(attemptQuestion => {
      const question = attemptQuestion.question;
      const studentAnswer = answers.find(a => a.questionId === question._id.toString());

      if (studentAnswer) {
        attemptQuestion.selectedAnswer = studentAnswer.selectedAnswer;
        
        if (studentAnswer.selectedAnswer === question.correctAnswer) {
          attemptQuestion.isCorrect = true;
          attemptQuestion.marksObtained = question.marks;
          correctAnswers++;
          marksObtained += question.marks;
        } else {
          attemptQuestion.isCorrect = false;
          attemptQuestion.marksObtained = 0;
          wrongAnswers++;
        }
      } else {
        wrongAnswers++;
      }
    });

    attempt.correctAnswers = correctAnswers;
    attempt.wrongAnswers = wrongAnswers;
    attempt.marksObtained = marksObtained;
    attempt.percentage = (marksObtained / attempt.totalMarks) * 100;
    attempt.timeTaken = timeTaken || 0;
    attempt.status = 'completed';
    attempt.completedAt = Date.now();

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        totalQuestions: attempt.totalQuestions,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        totalMarks: attempt.totalMarks,
        marksObtained: marksObtained,
        percentage: attempt.percentage.toFixed(2),
        timeTaken: timeTaken
      }
    });
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting quiz',
      error: error.message
    });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user._id,
      status: 'completed'
    })
      .populate('course', 'courseName duration')
      .populate('questionPool', 'poolName category')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('Get Quiz History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz history',
      error: error.message
    });
  }
};

exports.getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate('course')
      .populate('questionPool')
      .populate('questions.question');

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found'
      });
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.status(200).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    console.error('Get Quiz Result Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching quiz result',
      error: error.message
    });
  }
};