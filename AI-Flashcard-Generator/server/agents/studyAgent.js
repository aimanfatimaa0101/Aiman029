const { ask, runAgentTool } = require('../services/openaiService');

const detectIntent = (message) => {
  const m = message.toLowerCase();
  if (m.includes('flashcard') || m.includes('create card') || m.includes('generate card'))
    return 'generate_flashcards';
  if (m.includes('summariz') || m.includes('summary') || m.includes('key point'))
    return 'summarize_notes';
  if (m.includes('explain') || m.includes('what is') || m.includes('what are') || m.includes('how does'))
    return 'explain_concept';
  if (m.includes('quiz') || m.includes('mcq') || m.includes('test me') || m.includes('question'))
    return 'create_quiz_questions';
  if (m.includes('study plan') || m.includes('schedule') || m.includes('how to study'))
    return 'suggest_study_plan';
  return 'general';
};

const extractArgs = (intent, message) => {
  switch (intent) {
    case 'generate_flashcards':
      return { text: message, count: 8 };
    case 'summarize_notes':
      return { text: message };
    case 'explain_concept':
      return { concept: message.replace(/explain|what is|what are|how does|tell me about/gi, '').trim() || message };
    case 'create_quiz_questions':
      return { topic: message.replace(/create|generate|quiz|questions?|mcq|test me/gi, '').replace(/about|from|on/gi, '').trim() || message, count: 5 };
    case 'suggest_study_plan':
      return { topics: [message.replace(/study plan|schedule|how to study|create|plan/gi, '').replace(/for|about/gi, '').trim() || message], duration: '1 week' };
    default:
      return {};
  }
};

const runAgent = async (userMessage, conversationHistory = []) => {
  const intent = detectIntent(userMessage);
  const historyText = conversationHistory.slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  if (intent === 'general') {
    const prompt = `You are a friendly AI study assistant. Answer helpfully and concisely.
${historyText ? `\nConversation so far:\n${historyText}\n` : ''}
User: ${userMessage}
Assistant:`;
    const message = await ask(prompt);
    return { message, toolUsed: null, toolResult: null };
  }

  const args = extractArgs(intent, userMessage);
  try {
    const data = await runAgentTool(intent, args);
    let toolResult = null;
    if (intent === 'generate_flashcards')
      toolResult = { type: 'flashcards', data, message: `Generated ${data.length} flashcards!` };
    else if (intent === 'summarize_notes')
      toolResult = { type: 'summary', data };
    else if (intent === 'explain_concept')
      toolResult = { type: 'explanation', data };
    else if (intent === 'create_quiz_questions')
      toolResult = { type: 'quiz', data, message: `Created ${data.length} quiz questions!` };
    else if (intent === 'suggest_study_plan')
      toolResult = { type: 'study_plan', data };

    const summaryPrompt = `You are a study assistant. The user asked: "${userMessage}"
You completed the "${intent}" task. Write a short friendly 1-2 sentence response.`;
    const message = await ask(summaryPrompt);
    return { message, toolUsed: intent, toolResult };
  } catch (err) {
    const fallback = await ask(`You are a study assistant. Answer helpfully: ${userMessage}`);
    return { message: fallback, toolUsed: null, toolResult: null };
  }
};

module.exports = { runAgent };