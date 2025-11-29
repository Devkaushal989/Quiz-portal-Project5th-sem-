const QuizAttempt = require('../models/QuizAttempt');
const User = require('../schema/datamodel');
const Course = require('../models/Course');

// Get all quiz results for teacher
exports.getTeacherResults = async (req, res) => {
  try {
    const results = await QuizAttempt.find({ status: 'completed' })
      .populate('student', 'fullName email program semester')
      .populate('course', 'courseName duration')
      .populate('questionPool', 'poolName category')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get Teacher Results Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
      error: error.message
    });
  }
};

exports.getResultsByProgramSemester = async (req, res) => {
  try {
    const { program, semester, courseId } = req.query;

    const studentQuery = { userType: 'Student' };
    if (program && program !== 'All Programs') studentQuery.program = program;
    if (semester && semester !== 'All Semesters') studentQuery.semester = semester;

    const students = await User.find(studentQuery).select('_id');
    const studentIds = students.map(s => s._id);

    const attemptFilter = { 
      student: { $in: studentIds },
      status: 'completed'
    };
    if (courseId) attemptFilter.course = courseId;

    const results = await QuizAttempt.find(attemptFilter)
      .populate('student', 'fullName email program semester')
      .populate('course', 'courseName duration')
      .populate('questionPool', 'poolName category')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Get Results by Program/Semester Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
      error: error.message
    });
  }
};

exports.getResultDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const result = await QuizAttempt.findById(attemptId)
      .populate('student', 'fullName email program semester')
      .populate('course', 'courseName duration description')
      .populate('questionPool', 'poolName category')
      .populate({
        path: 'questions.question',
        select: 'questionText options correctAnswer marks difficulty'
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get Result Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching result details',
      error: error.message
    });
  }
};

exports.getResultStatistics = async (req, res) => {
  try {
    const { courseId, program, semester } = req.query;

    const filter = { status: 'completed' };
    if (courseId) filter.course = courseId;

    let results = await QuizAttempt.find(filter)
      .populate('student', 'program semester');

    if (program || semester) {
      results = results.filter(result => {
        const student = result.student;
        if (!student) return false;
        
        const matchesProgram = !program || program === 'All Programs' || student.program === program;
        const matchesSemester = !semester || semester === 'All Semesters' || student.semester === semester;
        
        return matchesProgram && matchesSemester;
      });
    }

    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0 
      ? results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts 
      : 0;
    const highestScore = totalAttempts > 0 
      ? Math.max(...results.map(r => r.percentage)) 
      : 0;
    const lowestScore = totalAttempts > 0 
      ? Math.min(...results.map(r => r.percentage)) 
      : 0;
    const passRate = totalAttempts > 0 
      ? (results.filter(r => r.percentage >= 60).length / totalAttempts) * 100 
      : 0;
    const totalCorrectAnswers = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalWrongAnswers = results.reduce((sum, r) => sum + r.wrongAnswers, 0);

    res.status(200).json({
      success: true,
      data: {
        totalAttempts,
        averageScore: parseFloat(averageScore.toFixed(2)),
        highestScore: parseFloat(highestScore.toFixed(2)),
        lowestScore: parseFloat(lowestScore.toFixed(2)),
        passRate: parseFloat(passRate.toFixed(2)),
        totalCorrectAnswers,
        totalWrongAnswers
      }
    });
  } catch (error) {
    console.error('Get Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating statistics',
      error: error.message
    });
  }
};

exports.prepareResultsExport = async (req, res) => {
  try {
    const { program, semester, courseId } = req.query;

    const filter = { status: 'completed' };
    if (courseId) filter.course = courseId;

    let results = await QuizAttempt.find(filter)
      .populate('student', 'fullName email program semester')
      .populate('course', 'courseName')
      .sort({ completedAt: -1 });

    if (program || semester) {
      results = results.filter(result => {
        const student = result.student;
        if (!student) return false;
        
        const matchesProgram = !program || program === 'All Programs' || student.program === program;
        const matchesSemester = !semester || semester === 'All Semesters' || student.semester === semester;
        
        return matchesProgram && matchesSemester;
      });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Prepare Export Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while preparing export',
      error: error.message
    });
  }
};

exports.getStudentQuizHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const history = await QuizAttempt.find({ 
      student: studentId,
      status: 'completed'
    })
      .populate('course', 'courseName duration')
      .populate('questionPool', 'poolName category')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Get Student History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching history',
      error: error.message
    });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId, program, semester, limit = 10 } = req.query;

    const filter = { status: 'completed' };
    if (courseId) filter.course = courseId;

    let results = await QuizAttempt.find(filter)
      .populate('student', 'fullName email program semester')
      .populate('course', 'courseName')
      .sort({ percentage: -1, completedAt: 1 });

    if (program || semester) {
      results = results.filter(result => {
        const student = result.student;
        if (!student) return false;
        
        const matchesProgram = !program || program === 'All Programs' || student.program === program;
        const matchesSemester = !semester || semester === 'All Semesters' || student.semester === semester;
        
        return matchesProgram && matchesSemester;
      });
    }

    const studentBestAttempts = new Map();
    results.forEach(result => {
      const studentId = result.student._id.toString();
      if (!studentBestAttempts.has(studentId) || 
          result.percentage > studentBestAttempts.get(studentId).percentage) {
        studentBestAttempts.set(studentId, result);
      }
    });

    const leaderboard = Array.from(studentBestAttempts.values())
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get Leaderboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
      error: error.message
    });
  }
};

module.exports = exports;