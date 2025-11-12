const mongoose = require('mongoose');

const questionPoolSchema = new mongoose.Schema({
  poolName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['physics', 'mathematics', 'chemistry', 'biology', 'other']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  easyQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  mediumQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  hardQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  easyCount: {
    type: Number,
    default: 0
  },
  mediumCount: {
    type: Number,
    default: 0
  },
  hardCount: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

questionPoolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalQuestions = this.easyCount + this.mediumCount + this.hardCount;
  next();
});

module.exports = mongoose.model('QuestionPool', questionPoolSchema);
