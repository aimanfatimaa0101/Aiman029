const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const flashcardSetValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('cards').isArray({ min: 1 }).withMessage('At least one card is required'),
  body('cards.*.question').trim().notEmpty().withMessage('Card question is required'),
  body('cards.*.answer').trim().notEmpty().withMessage('Card answer is required'),
  handleValidation
];

const aiGenerateValidation = [
  body('text').trim().notEmpty().withMessage('Text content is required')
    .isLength({ min: 50, max: 10000 }).withMessage('Text must be between 50 and 10,000 characters'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  handleValidation
];

module.exports = {
  registerValidation,
  loginValidation,
  flashcardSetValidation,
  aiGenerateValidation
};
