const REQUIRED = [
  { key: 'MONGO_URI',     hint: 'e.g. mongodb://localhost:27017/ai_flashcards' },
  { key: 'JWT_SECRET',    hint: 'any long random string' },
  { key: 'GROQ_API_KEY',  hint: 'free key from https://console.groq.com' },
];

const validateEnv = () => {
  const missing = REQUIRED.filter(v => !process.env[v.key]);
  if (missing.length === 0) return;
  console.error('\n❌  Missing environment variables:\n');
  missing.forEach(({ key, hint }) => {
    console.error(`   ${key}`);
    console.error(`      → ${hint}\n`);
  });
  console.error('👉  Edit server/.env and fill in the values.\n');
  process.exit(1);
};

module.exports = { validateEnv };