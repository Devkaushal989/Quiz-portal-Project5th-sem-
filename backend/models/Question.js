const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    optionText: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  marks: {
    type: Number,
    required: true,
    default: 1
  },
  questionPool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuestionPool'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);