const express = require('express');
const router = express.Router();
const { generateFromText, generateQuiz, summarize, explain, agentChat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiGenerateValidation } = require('../middleware/validate');
const { body } = require('express-validator');

router.use(protect);

router.post('/generate', aiGenerateValidation, generateFromText);
router.post('/quiz/:setId', generateQuiz);
router.post('/summarize', [body('text').trim().notEmpty().withMessage('Text is required')], summarize);
router.post('/explain', [body('concept').trim().notEmpty().withMessage('Concept is required')], explain);
router.post('/agent', agentChat);

module.exports = router;
