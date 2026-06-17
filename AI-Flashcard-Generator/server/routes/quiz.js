const express = require('express');
const router = express.Router();
const { saveQuizResult, getQuizResults, getQuizStats } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/results', saveQuizResult);
router.get('/results', getQuizResults);
router.get('/stats', getQuizStats);

module.exports = router;
