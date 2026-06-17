const FlashcardSet = require('../models/FlashcardSet');

// Helper to generate unique slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const makeUniqueSlug = async (title, userId, excludeId = null) => {
  let slug = generateSlug(title)
  let exists = await FlashcardSet.findOne({
    slug,
    userId,
    ...(excludeId ? { _id: { $ne: excludeId } } : {})
  })
  let counter = 1
  while (exists) {
    slug = `${generateSlug(title)}-${counter}`
    exists = await FlashcardSet.findOne({
      slug,
      userId,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    })
    counter++
  }
  return slug
}

// Find by slug OR id
const findSet = async (identifier, userId) => {
  // Try by ID first
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    return await FlashcardSet.findOne({ _id: identifier, userId })
  }
  // Try by slug
  return await FlashcardSet.findOne({ slug: identifier, userId })
}

// GET /api/flashcards
const getFlashcardSets = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query
    const query = { userId: req.user._id }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const total = await FlashcardSet.countDocuments(query)
    const sets = await FlashcardSet.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({
      success: true,
      data: sets,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/flashcards/:identifier
const getFlashcardSet = async (req, res, next) => {
  try {
    const set = await findSet(req.params.id, req.user._id)
    if (!set) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' })
    }
    res.json({ success: true, data: set })
  } catch (error) {
    next(error)
  }
}

// POST /api/flashcards
const createFlashcardSet = async (req, res, next) => {
  try {
    const { title, description, cards, tags, subject } = req.body
    const slug = await makeUniqueSlug(title, req.user._id)

    const set = await FlashcardSet.create({
      userId: req.user._id,
      title,
      slug,
      description,
      cards,
      tags: tags || [],
      subject: subject || 'General'
    })

    res.status(201).json({
      success: true,
      message: 'Flashcard set created',
      data: set
    })
  } catch (error) {
    next(error)
  }
}

// PUT /api/flashcards/:id
const updateFlashcardSet = async (req, res, next) => {
  try {
    const set = await findSet(req.params.id, req.user._id)
    if (!set) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' })
    }

    // Regenerate slug if title changed
    if (req.body.title && req.body.title !== set.title) {
      req.body.slug = await makeUniqueSlug(req.body.title, req.user._id, set._id)
    }

    const updated = await FlashcardSet.findByIdAndUpdate(
      set._id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({ success: true, message: 'Flashcard set updated', data: updated })
  } catch (error) {
    next(error)
  }
}

// DELETE /api/flashcards/:id
const deleteFlashcardSet = async (req, res, next) => {
  try {
    const set = await findSet(req.params.id, req.user._id)
    if (!set) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' })
    }
    await FlashcardSet.findByIdAndDelete(set._id)
    res.json({ success: true, message: 'Flashcard set deleted' })
  } catch (error) {
    next(error)
  }
}

// PATCH /api/flashcards/:id/cards/:cardId
const updateCardStatus = async (req, res, next) => {
  try {
    const { learned } = req.body
    const set = await findSet(req.params.id, req.user._id)
    if (!set) {
      return res.status(404).json({ success: false, message: 'Flashcard set not found' })
    }
    const card = set.cards.id(req.params.cardId)
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' })
    }
    card.learned = learned
    await set.save()
    res.json({ success: true, message: 'Card updated', data: set })
  } catch (error) {
    next(error)
  }
}

// GET /api/flashcards/stats
const getStats = async (req, res, next) => {
  try {
    const sets = await FlashcardSet.find({ userId: req.user._id })
    const totalSets = sets.length
    const totalCards = sets.reduce((sum, s) => sum + s.cards.length, 0)
    const learnedCards = sets.reduce((sum, s) => sum + s.cards.filter(c => c.learned).length, 0)

    res.json({
      success: true,
      data: {
        totalSets,
        totalCards,
        learnedCards,
        masteryRate: totalCards ? Math.round((learnedCards / totalCards) * 100) : 0
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getFlashcardSets,
  getFlashcardSet,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  updateCardStatus,
  getStats
}