const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true
  },
  learned: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const flashcardSetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  cards: [cardSchema],
  tags: [{
    type: String,
    trim: true
  }],
  subject: {
    type: String,
    trim: true,
    default: 'General'
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

// Auto-generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

flashcardSetSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title)
  }
  next()
})

flashcardSetSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() })
  next()
})

flashcardSetSchema.virtual('totalCards').get(function () {
  return this.cards ? this.cards.length : 0;
});

flashcardSetSchema.virtual('learnedCards').get(function () {
  return this.cards
    ? this.cards.filter(card => card.learned).length
    : 0;
});

flashcardSetSchema.set('toJSON', { virtuals: true })
flashcardSetSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema)