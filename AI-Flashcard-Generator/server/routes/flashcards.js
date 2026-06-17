const express = require('express');
const router = express.Router();
const {
  getFlashcardSets, getFlashcardSet, createFlashcardSet,
  updateFlashcardSet, deleteFlashcardSet, updateCardStatus, getStats
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/auth');
const { flashcardSetValidation } = require('../middleware/validate');

router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getFlashcardSets).post(flashcardSetValidation, createFlashcardSet);
router.route('/:id').get(getFlashcardSet).put(updateFlashcardSet).delete(deleteFlashcardSet);
router.patch('/:id/cards/:cardId', updateCardStatus);

module.exports = router;
