/**
 * Seed script — populates the DB with a demo user and sample flashcard sets.
 * Usage: node server/scripts/seed.js
 */

require('dotenv').config({ path: __dirname + '/../.env' })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const FlashcardSet = require('../models/FlashcardSet')
const QuizResult = require('../models/QuizResult')

const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@flashai.com',
  password: 'demo123'
}

const SAMPLE_SETS = [
  {
    title: 'Biology: Cell Division',
    subject: 'Biology',
    description: 'Key concepts in mitosis and meiosis',
    tags: ['biology', 'cells'],
    cards: [
      { question: 'What is mitosis?', answer: 'The process of cell division that produces two genetically identical daughter cells.' },
      { question: 'What are the four phases of mitosis?', answer: 'Prophase, Metaphase, Anaphase, and Telophase.' },
      { question: 'What is meiosis?', answer: 'Cell division that produces four genetically unique haploid cells for sexual reproduction.' },
      { question: 'What is a chromosome?', answer: 'A thread-like structure of nucleic acids and protein found in cell nuclei, carrying genetic information.' },
      { question: 'What is cytokinesis?', answer: 'The physical division of the cytoplasm following nuclear division.' },
    ]
  },
  {
    title: 'JavaScript Fundamentals',
    subject: 'Computer Science',
    description: 'Core JS concepts every developer should know',
    tags: ['javascript', 'programming', 'ai-generated'],
    cards: [
      { question: 'What is a closure in JavaScript?', answer: 'A closure is a function that retains access to its lexical scope even when executed outside that scope.' },
      { question: 'What is the difference between == and ===?', answer: '== performs type coercion before comparison, while === checks both value and type without coercion.' },
      { question: 'What is the event loop?', answer: 'A mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the browser APIs and processing callbacks in a queue.' },
      { question: 'What is a Promise?', answer: 'An object representing the eventual completion or failure of an asynchronous operation.' },
      { question: 'What does "use strict" do?', answer: 'It enables strict mode, which catches common coding mistakes and prevents the use of potentially problematic features.' },
    ]
  },
  {
    title: 'World War II Key Events',
    subject: 'History',
    description: 'Major events and dates of WWII',
    tags: ['history', 'wwii'],
    cards: [
      { question: 'When did World War II begin?', answer: 'September 1, 1939, when Germany invaded Poland.' },
      { question: 'What was Operation Overlord?', answer: 'The codename for the Allied invasion of Normandy on June 6, 1944 (D-Day).' },
      { question: 'What was the Manhattan Project?', answer: 'The US research and development program that produced the first nuclear weapons during WWII.' },
      { question: 'When did WWII end in Europe?', answer: 'May 8, 1945 (V-E Day) when Germany surrendered unconditionally.' },
      { question: 'What were the Nuremberg Trials?', answer: 'Military tribunals held after WWII to prosecute prominent Nazi leaders for war crimes and crimes against humanity.' },
    ]
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing demo data
    const existing = await User.findOne({ email: DEMO_USER.email })
    if (existing) {
      await FlashcardSet.deleteMany({ userId: existing._id })
      await QuizResult.deleteMany({ userId: existing._id })
      await User.deleteOne({ _id: existing._id })
      console.log('🗑️  Cleared existing demo data')
    }

    // Create demo user
    const salt = await bcrypt.genSalt(12)
    const hashed = await bcrypt.hash(DEMO_USER.password, salt)
    const user = await User.create({ ...DEMO_USER, password: hashed })
    console.log(`👤 Created demo user: ${DEMO_USER.email} / ${DEMO_USER.password}`)

    // Create flashcard sets
    for (const setData of SAMPLE_SETS) {
      const set = await FlashcardSet.create({ userId: user._id, ...setData })
      console.log(`📚 Created set: "${set.title}" (${set.cards.length} cards)`)
    }

    // Create a sample quiz result
    const sets = await FlashcardSet.find({ userId: user._id })
    if (sets.length > 0) {
      await QuizResult.create({
        userId: user._id,
        flashcardSetId: sets[0]._id,
        setTitle: sets[0].title,
        score: 4,
        totalQuestions: 5,
        answers: sets[0].cards.slice(0, 5).map((c, i) => ({
          question: c.question,
          userAnswer: c.answer,
          correctAnswer: c.answer,
          isCorrect: i !== 2
        }))
      })
      console.log('🎯 Created sample quiz result')
    }

    console.log('\n✨ Seed complete!')
    console.log('────────────────────────────────')
    console.log(`Email:    ${DEMO_USER.email}`)
    console.log(`Password: ${DEMO_USER.password}`)
    console.log('────────────────────────────────')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err)
    process.exit(1)
  }
}

seed()
