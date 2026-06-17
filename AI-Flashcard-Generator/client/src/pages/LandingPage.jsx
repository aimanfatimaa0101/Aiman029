import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '✨', title: 'AI-Powered Generation', desc: 'Paste any text and get instant flashcards powered by GPT-3.5' },
  { icon: '🤖', title: 'Study Agent', desc: 'Smart AI agent that summarizes, explains, and creates quizzes on demand' },
  { icon: '🎯', title: 'Quiz Mode', desc: 'Auto-generated MCQs with score tracking and detailed feedback' },
  { icon: '🃏', title: 'Review Mode', desc: 'Interactive flip cards with progress tracking and learned marking' },
  { icon: '📊', title: 'Progress Stats', desc: 'Track your mastery rate and study streaks across all subjects' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication with bcrypt password hashing' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary-500/30">⚡</div>
          <span className="font-bold text-xl text-white">FlashAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-32 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 badge bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6 px-4 py-1.5 text-sm">
            <span>✨</span> Powered by GPT-3.5 & Function Calling
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            Study Smarter with<br />
            <span className="gradient-text">AI Flashcards</span>
          </h1>
          <p className="text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform any lecture notes, articles, or textbook content into intelligent flashcards in seconds.
            An AI agent helps you learn, quiz yourself, and master any subject.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Start for Free →
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Hero card preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 glass-card p-8 max-w-lg mx-auto"
        >
          <div className="perspective" style={{ height: '160px' }}>
            <div className="glass-card flex flex-col items-center justify-center p-6 h-full border-primary-500/20 bg-primary-500/5">
              <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-3 text-xs">Question</span>
              <p className="text-white font-semibold text-center">What is the process by which plants convert sunlight into energy?</p>
              <p className="text-white/30 text-sm mt-4">Click to reveal →</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to ace your studies</h2>
          <p className="text-white/40">AI-powered tools designed for serious learners</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 hover:border-primary-500/30 transition-all"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <div className="glass-card max-w-2xl mx-auto p-12 bg-gradient-to-br from-primary-900/30 to-violet-900/30">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to study smarter?</h2>
          <p className="text-white/50 mb-8">Join thousands of students using AI to accelerate their learning.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-white/20 text-sm border-t border-white/5">
        <p>© 2025 FlashAI. Built with ⚡ React + Node.js + OpenAI</p>
      </footer>
    </div>
  )
}
