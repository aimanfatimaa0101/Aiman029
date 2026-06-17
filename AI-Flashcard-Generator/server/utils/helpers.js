/**
 * Parse JSON safely — returns null on failure instead of throwing
 */
const safeParseJSON = (str) => {
  try {
    // Strip markdown code fences if present
    const clean = str.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return null
  }
}

/**
 * Validate flashcard array shape
 * Expects: [{ question: string, answer: string }]
 */
const validateFlashcards = (cards) => {
  if (!Array.isArray(cards)) return false
  return cards.every(
    c => typeof c.question === 'string' && c.question.trim() &&
         typeof c.answer   === 'string' && c.answer.trim()
  )
}

/**
 * Validate MCQ array shape
 * Expects: [{ question, options: [4], correctAnswer, explanation }]
 */
const validateQuizQuestions = (qs) => {
  if (!Array.isArray(qs)) return false
  return qs.every(
    q => typeof q.question === 'string' &&
         Array.isArray(q.options) && q.options.length === 4 &&
         typeof q.correctAnswer === 'string'
  )
}

/**
 * Async wrapper — catches errors and passes to next()
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Paginate a Mongoose query
 */
const paginate = (page = 1, limit = 10) => ({
  skip: (Number(page) - 1) * Number(limit),
  limit: Number(limit)
})

module.exports = { safeParseJSON, validateFlashcards, validateQuizQuestions, asyncHandler, paginate }
