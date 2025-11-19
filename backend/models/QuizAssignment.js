const mongoose = require('mongoose');

const quizAssignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questionPool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPool',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedToAll: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date
  },
  maxAttempts: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('QuizAssignment', quizAssignmentSchema);
