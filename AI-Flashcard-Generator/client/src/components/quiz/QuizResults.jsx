import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function QuizResults({ score, total, answers, setId, onRetry }) {
  const percentage = Math.round((score / total) * 100)
  const grade = percentage >= 90 ? { label: 'Excellent!', emoji: '🏆', color: 'text-yellow-400' }
    : percentage >= 70 ? { label: 'Great Job!', emoji: '🎉', color: 'text-emerald-400' }
    : percentage >= 50 ? { label: 'Good Effort', emoji: '👍', color: 'text-blue-400' }
    : { label: 'Keep Practicing', emoji: '💪', color: 'text-orange-400' }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      {/* Score circle */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-6xl">{grade.emoji}</div>
        <h2 className={`text-3xl font-bold ${grade.color}`}>{grade.label}</h2>
        <div className="text-7xl font-black text-white">{percentage}<span className="text-3xl text-white/30">%</span></div>
        <p className="text-white/50">{score} out of {total} correct</p>
      </div>

      {/* Answer breakdown */}
      <div className="glass-card p-5 text-left space-y-3 max-h-64 overflow-y-auto">
        <h3 className="font-semibold text-white/70 text-sm uppercase tracking-wider mb-4">Review Answers</h3>
        {answers.map((a, i) => (
          <div key={i} className={`p-3 rounded-xl border text-sm ${a.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className="font-medium text-white mb-1">{a.question}</p>
            <p className={a.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
              {a.isCorrect ? '✅' : '❌'} Your answer: {a.userAnswer}
            </p>
            {!a.isCorrect && <p className="text-white/50 text-xs mt-0.5">Correct: {a.correctAnswer}</p>}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-center">
        <button onClick={onRetry} className="btn-secondary">🔄 Retry Quiz</button>
        <Link to={`/review/${setId}`} className="btn-secondary">📖 Review Cards</Link>
        <Link to="/dashboard" className="btn-primary">🏠 Dashboard</Link>
      </div>
    </motion.div>
  )
}
