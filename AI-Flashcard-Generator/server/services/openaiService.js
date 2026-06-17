const Groq = require('groq-sdk');

let _client = null;

const getClient = () => {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set. Get free key at https://console.groq.com');
    }
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
};

const ask = async (prompt) => {
  const client = getClient();
  const response = await client.chat.completions.create({
   model: "llama-3.3-70b-versatile",
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};

const parseJSON = (text) => {
  const clean = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim();
  return JSON.parse(clean);
};

const generateFlashcards = async (text, count = 10) => {
  const prompt = `You are an expert educator. Generate exactly ${count} flashcards from the text below.
Return ONLY a valid JSON array with no extra text or markdown:
[{"question": "...", "answer": "..."}]
Text: ${text}`;
  const raw = await ask(prompt);
  return parseJSON(raw);
};

const summarizeNotes = async (text) => {
  return await ask(
    `Summarize these notes clearly with key points using markdown:\n${text}`
  );
};

const explainConcept = async (concept) => {
  return await ask(
    `Explain this concept clearly with examples using markdown:\n${concept}`
  );
};

const generateQuizQuestions = async (cards, count = 5) => {
  const cardsText = cards
    .map((c, i) => `${i + 1}. Q: ${c.question} A: ${c.answer}`)
    .join('\n');
    
  const prompt = `You are a quiz generator. Create exactly ${count} multiple choice questions.

IMPORTANT RULES:
- "correctAnswer" must be the FULL TEXT of the correct option
- NEVER use "A", "B", "C", "D" as the correctAnswer
- Copy the correct option text EXACTLY into correctAnswer

BAD example (never do this):
{"question":"...","options":["Paris","London","Berlin","Madrid"],"correctAnswer":"A"}

GOOD example (always do this):
{"question":"What is capital of France?","options":["Paris","London","Berlin","Madrid"],"correctAnswer":"Paris","explanation":"Paris is the capital of France."}

Return ONLY a JSON array. No extra text. No markdown.

Flashcards:
${cardsText}`;

  const raw = await ask(prompt);
  const parsed = parseJSON(raw);

  // Auto-fix if AI still returns A/B/C/D as correctAnswer
  return parsed.map(q => {
    const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const ans = q.correctAnswer.trim();
    
    // If correctAnswer is just a letter like "A", "B", "C", "D"
    if (ans.length <= 2 && letterMap[ans.toUpperCase()] !== undefined) {
      const index = letterMap[ans.toUpperCase()];
      const fixedAnswer = q.options[index];
      console.log(`Fixed answer: "${ans}" → "${fixedAnswer}"`);
      return { ...q, correctAnswer: fixedAnswer };
    }
    
    // If correctAnswer is like "A." or "A)"
    const letterMatch = ans.match(/^([A-D])[.)]\s*/i);
    if (letterMatch) {
      const index = letterMap[letterMatch[1].toUpperCase()];
      const fixedAnswer = q.options[index];
      console.log(`Fixed answer: "${ans}" → "${fixedAnswer}"`);
      return { ...q, correctAnswer: fixedAnswer };
    }
    
    return q;
  });
};

const generateStudyPlan = async (topics, duration = '1 week') => {
  return await ask(
    `Create a detailed ${duration} study plan for: ${topics.join(', ')}. Use markdown.`
  );
};

const runAgentTool = async (toolName, args) => {
  switch (toolName) {
    case 'generate_flashcards':
      return await generateFlashcards(args.text, args.count || 8);
    case 'summarize_notes':
      return await summarizeNotes(args.text);
    case 'explain_concept':
      return await explainConcept(args.concept);
case 'create_quiz_questions': {
  const raw = await ask(
    `Create ${args.count || 5} MCQ questions about: ${args.topic}

IMPORTANT: correctAnswer must be full text copied from options, NEVER just "A" "B" "C" "D"

Return ONLY valid JSON array:
[{"question":"...","options":["full text 1","full text 2","full text 3","full text 4"],"correctAnswer":"full text 1","explanation":"..."}]`
  );
  const parsed = parseJSON(raw);
  
  // Auto-fix letter answers
  const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  return parsed.map(q => {
    const ans = q.correctAnswer.trim();
    if (ans.length <= 2 && letterMap[ans.toUpperCase()] !== undefined) {
      return { ...q, correctAnswer: q.options[letterMap[ans.toUpperCase()]] };
    }
    return q;
  });
}
    case 'suggest_study_plan':
      return await generateStudyPlan(args.topics, args.duration || '1 week');
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
};

module.exports = {
  openai: { chat: null },
  getClient,
  ask,
  parseJSON,
  generateFlashcards,
  summarizeNotes,
  explainConcept,
  generateQuizQuestions,
  generateStudyPlan,
  runAgentTool
};