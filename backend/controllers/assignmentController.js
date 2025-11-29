const QuizAssignment = require('../models/QuizAssignment');
const Course = require('../models/Course');
const QuestionPool = require('../models/QuestionPool');
const User = require('../schema/datamodel'); 

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ userType: 'Student' })
      .select('fullName email program semester')
      .sort({ program: 1, semester: 1, fullName: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message
    });
  }
};

exports.assignQuiz = async (req, res) => {
  try {
    const { courseId, studentIds, assignToAll, dueDate, maxAttempts, program, semester } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (!assignToAll && (!studentIds || studentIds.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one student or assign to all'
      });
    }

    const course = await Course.findById(courseId).populate('questionPool');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const existingAssignment = await QuizAssignment.findOne({
      course: courseId,
      assignedBy: req.user._id,
      isActive: true
    });

    if (existingAssignment) {
      
      if (assignToAll) {
        existingAssignment.assignedToAll = true;
        existingAssignment.assignedTo = [];
        existingAssignment.program = undefined;
        existingAssignment.semester = undefined;
      } else if (program && semester) {
        
        existingAssignment.assignedToAll = false;
        existingAssignment.assignedTo = studentIds;
        existingAssignment.program = program;
        existingAssignment.semester = semester;
      } else {
        
        existingAssignment.assignedToAll = false;
        existingAssignment.assignedTo = studentIds;
        existingAssignment.program = undefined;
        existingAssignment.semester = undefined;
      }
      
      existingAssignment.dueDate = dueDate;
      existingAssignment.maxAttempts = maxAttempts || 1;
      await existingAssignment.save();

      return res.status(200).json({
        success: true,
        message: 'Quiz assignment updated successfully',
        data: existingAssignment
      });
    }

    const assignmentData = {
      course: courseId,
      questionPool: course.questionPool._id,
      assignedBy: req.user._id,
      assignedTo: assignToAll ? [] : studentIds,
      assignedToAll: assignToAll,
      dueDate: dueDate,
      maxAttempts: maxAttempts || 1
    };

    if (program && semester && !assignToAll) {
      assignmentData.program = program;
      assignmentData.semester = semester;
    }

    const assignment = await QuizAssignment.create(assignmentData);

   
    let message = '';
    if (assignToAll) {
      message = 'Quiz assigned successfully to all students';
    } else if (program && semester) {
      message = `Quiz assigned successfully to ${studentIds.length} student(s) in ${program} - Semester ${semester}`;
    } else {
      message = `Quiz assigned successfully to ${studentIds.length} student(s)`;
    }

    res.status(201).json({
      success: true,
      message: message,
      data: assignment
    });
  } catch (error) {
    console.error('Assign Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning quiz',
      error: error.message
    });
  }
};

exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await QuizAssignment.find({ 
      assignedBy: req.user._id,
      isActive: true
    })
      .populate('course', 'courseName duration')
      .populate('questionPool', 'poolName category totalQuestions')
      .populate('assignedTo', 'fullName email program semester')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (error) {
    console.error('Get Assignments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message
    });
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

   
    const assignments = await QuizAssignment.find({
      $or: [
        { assignedTo: req.user._id },
        { assignedToAll: true },
        { 
          program: student.program, 
          semester: student.semester,
          assignedToAll: false 
        }
      ],
      isActive: true
    })
      .populate('course', 'courseName duration description')
      .populate('questionPool', 'poolName category totalQuestions')
      .populate('assignedBy', 'fullName')
      .sort({ createdAt: -1 });

    const uniqueAssignments = assignments.filter((assignment, index, self) =>
      index === self.findIndex((a) => a._id.toString() === assignment._id.toString())
    );

    res.status(200).json({
      success: true,
      count: uniqueAssignments.length,
      data: uniqueAssignments
    });
  } catch (error) {
    console.error('Get Student Assignments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message
    });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await QuizAssignment.findOneAndUpdate(
      { _id: req.params.id, assignedBy: req.user._id },
      { isActive: false },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Delete Assignment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting assignment',
      error: error.message
    });
  }
};

exports.getStudentsByProgramSemester = async (req, res) => {
  try {
    const { program, semester } = req.query;

    if (!program || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Program and semester are required'
      });
    }

    const students = await User.find({ 
      userType: 'Student',
      program: program,
      semester: semester
    })
      .select('fullName email program semester')
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get Students by Program/Semester Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message
    });
  }
};