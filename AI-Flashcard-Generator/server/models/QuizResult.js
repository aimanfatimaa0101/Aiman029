const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flashcardSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlashcardSet',
    required: true
  },
  setTitle: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  answers: [{
    question: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

quizResultSchema.pre('save', function (next) {
  this.percentage = Math.round((this.score / this.totalQuestions) * 100);
  next();
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
