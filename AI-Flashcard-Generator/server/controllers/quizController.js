const QuizResult = require('../models/QuizResult');
const FlashcardSet = require('../models/FlashcardSet');

// @desc    Save quiz result
// @route   POST /api/quiz/results
// @access  Private
const saveQuizResult = async (req, res, next) => {
  try {
    const { flashcardSetId, score, totalQuestions, answers, setTitle } = req.body;

    const result = await QuizResult.create({
      userId: req.user._id,
      flashcardSetId,
      setTitle,
      score,
      totalQuestions,
      answers
    });

    res.status(201).json({ success: true, message: 'Quiz result saved', data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz results for user
// @route   GET /api/quiz/results
// @access  Private
const getQuizResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('flashcardSetId', 'title');

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz stats
// @route   GET /api/quiz/stats
// @access  Private
const getQuizStats = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });
    const totalQuizzes = results.length;
    const avgScore = totalQuizzes
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes ? Math.max(...results.map(r => r.percentage)) : 0;

    res.json({ success: true, data: { totalQuizzes, avgScore, bestScore } });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveQuizResult, getQuizResults, getQuizStats };
