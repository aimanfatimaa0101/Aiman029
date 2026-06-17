const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

const {
  generateFlashcards,
  summarizeNotes,
  explainConcept,
  generateQuizQuestions,
  generateStudyPlan
} = require('../services/openaiService');

const { runAgent } = require('../agents/studyAgent');

// Generate Flashcards
const generateFromText = async (req, res, next) => {
  try {
    const { text, title, count = 10, subject, description } = req.body;

    const cards = await generateFlashcards(text, count);

    const set = await FlashcardSet.create({
      userId: req.user._id,
      title,
      description:
        description || `AI-generated from ${count} key concepts`,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        learned: false
      })),
      subject: subject || 'General',
      tags: ['ai-generated']
    });

    res.status(201).json({
      success: true,
      message: `Generated ${cards.length} flashcards successfully`,
      data: set
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid response. Please try again.'
      });
    }

    next(error);
  }
};

// Generate Quiz
const generateQuiz = async (req, res, next) => {
  try {
    const { count = 5 } = req.body;
    const { setId } = req.params;

    let set;

    // Support both MongoDB ID and slug
    if (mongoose.Types.ObjectId.isValid(setId)) {
      set = await FlashcardSet.findOne({
        _id: setId,
        userId: req.user._id
      });
    } else {
      set = await FlashcardSet.findOne({
        slug: setId,
        userId: req.user._id
      });
    }

    if (!set) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }

    if (!set.cards || set.cards.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Need at least 2 cards to generate a quiz'
      });
    }

    const questions = await generateQuizQuestions(
      set.cards,
      Math.min(count, set.cards.length)
    );

    res.status(200).json({
      success: true,
      data: {
        questions,
        setTitle: set.title,
        setId: set._id
      }
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid response. Please try again.'
      });
    }

    next(error);
  }
};

// Summarize Notes
const summarize = async (req, res, next) => {
  try {
    const { text } = req.body;

    const summary = await summarizeNotes(text);

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    next(error);
  }
};

// Explain Concept
const explain = async (req, res, next) => {
  try {
    const { concept } = req.body;

    const explanation = await explainConcept(concept);

    res.json({
      success: true,
      data: { explanation }
    });
  } catch (error) {
    next(error);
  }
};

// AI Study Agent
const agentChat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 3 characters'
      });
    }

    const result = await runAgent(message, history);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateFromText,
  generateQuiz,
  summarize,
  explain,
  agentChat
};