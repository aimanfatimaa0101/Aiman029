const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_flashcards_test';

const app = require('../server');

// ─── Connect before all tests ─────────────────────────────────────────────
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

// ─── Cleanup after all tests ──────────────────────────────────────────────
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ══════════════════════════════════════════════════════════════════════════
// AUTH API TESTS
// ══════════════════════════════════════════════════════════════════════════

describe('Auth API', () => {
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };
  let token;

  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  test('POST /api/auth/register - should reject duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register - should reject invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'invalid-email' });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/register - should reject short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'short@test.com', password: '123' });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login - should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('POST /api/auth/login - should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@nowhere.com', password: 'password123' });

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/me - should return current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('GET /api/auth/me - should reject request without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/me - should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.statusCode).toBe(401);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// FLASHCARD API TESTS
// ══════════════════════════════════════════════════════════════════════════

describe('Flashcard API', () => {
  let token;
  let setId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Flash User',
        email: `flash_${Date.now()}@example.com`,
        password: 'password123'
      });
    token = res.body.token;
  });

  test('POST /api/flashcards - should create flashcard set', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Flashcard Set',
        cards: [
          { question: 'What is React?', answer: 'A JavaScript library for building UIs' },
          { question: 'What is Node.js?', answer: 'A JavaScript runtime built on Chrome V8' }
        ],
        subject: 'Computer Science'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cards).toHaveLength(2);
    expect(res.body.data.title).toBe('Test Flashcard Set');
    setId = res.body.data._id;
  });

  test('POST /api/flashcards - should reject set without title', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        cards: [{ question: 'Q?', answer: 'A' }]
      });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/flashcards - should reject set without cards', async () => {
    const res = await request(app)
      .post('/api/flashcards')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No Cards Set', cards: [] });

    expect(res.statusCode).toBe(400);
  });

  test('GET /api/flashcards - should return user sets', async () => {
    const res = await request(app)
      .get('/api/flashcards')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/flashcards - should reject without token', async () => {
    const res = await request(app)
      .get('/api/flashcards');

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/flashcards - should support search query', async () => {
    const res = await request(app)
      .get('/api/flashcards?search=Test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/flashcards/:id - should return single set', async () => {
    const res = await request(app)
      .get(`/api/flashcards/${setId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(setId);
  });

  test('GET /api/flashcards/:id - should return 404 for wrong id', async () => {
    const res = await request(app)
      .get('/api/flashcards/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/flashcards/:id - should update set title', async () => {
    const res = await request(app)
      .put(`/api/flashcards/${setId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  test('PATCH /api/flashcards/:id/cards/:cardId - should update card learned status', async () => {
    // First get the set to find a cardId
    const setRes = await request(app)
      .get(`/api/flashcards/${setId}`)
      .set('Authorization', `Bearer ${token}`);

    const cardId = setRes.body.data.cards[0]._id;

    const res = await request(app)
      .patch(`/api/flashcards/${setId}/cards/${cardId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ learned: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/flashcards/stats - should return statistics', async () => {
    const res = await request(app)
      .get('/api/flashcards/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalSets');
    expect(res.body.data).toHaveProperty('totalCards');
    expect(res.body.data).toHaveProperty('learnedCards');
    expect(res.body.data).toHaveProperty('masteryRate');
  });

  test('DELETE /api/flashcards/:id - should delete set', async () => {
    const res = await request(app)
      .delete(`/api/flashcards/${setId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/flashcards/:id - should return 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/flashcards/${setId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// QUIZ API TESTS
// ══════════════════════════════════════════════════════════════════════════

describe('Quiz API', () => {
  let token;
  let setId;

  beforeAll(async () => {
    // Register user
    const authRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Quiz User',
        email: `quiz_${Date.now()}@example.com`,
        password: 'password123'
      });
    token = authRes.body.token;

    // Create a flashcard set for quiz testing
    const setRes = await request(app)
      .post('/api/flashcards')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Quiz Test Set',
        cards: [
          { question: 'What is MongoDB?', answer: 'A NoSQL database' },
          { question: 'What is Express?', answer: 'A Node.js web framework' },
          { question: 'What is React?', answer: 'A frontend JavaScript library' }
        ]
      });
    setId = setRes.body.data._id;
  });

  test('POST /api/quiz/results - should save quiz result', async () => {
    const res = await request(app)
      .post('/api/quiz/results')
      .set('Authorization', `Bearer ${token}`)
      .send({
        flashcardSetId: setId,
        setTitle: 'Quiz Test Set',
        score: 3,
        totalQuestions: 3,
        answers: [
          { question: 'What is MongoDB?', userAnswer: 'A NoSQL database', correctAnswer: 'A NoSQL database', isCorrect: true },
          { question: 'What is Express?', userAnswer: 'A Node.js web framework', correctAnswer: 'A Node.js web framework', isCorrect: true },
          { question: 'What is React?', userAnswer: 'A frontend JavaScript library', correctAnswer: 'A frontend JavaScript library', isCorrect: true }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBe(3);
    expect(res.body.data.percentage).toBe(100);
  });

  test('GET /api/quiz/results - should return quiz history', async () => {
    const res = await request(app)
      .get('/api/quiz/results')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/quiz/stats - should return quiz statistics', async () => {
    const res = await request(app)
      .get('/api/quiz/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalQuizzes');
    expect(res.body.data).toHaveProperty('avgScore');
    expect(res.body.data).toHaveProperty('bestScore');
  });

  test('GET /api/quiz/results - should reject without token', async () => {
    const res = await request(app)
      .get('/api/quiz/results');

    expect(res.statusCode).toBe(401);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ══════════════════════════════════════════════════════════════════════════

describe('Health Check', () => {
  test('GET /api/health - should return ok', async () => {
    const res = await request(app)
      .get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is running');
    expect(res.body.timestamp).toBeDefined();
  });

  test('GET /api/unknown - should return 404', async () => {
    const res = await request(app)
      .get('/api/unknown-route');

    expect(res.statusCode).toBe(404);
  });
});