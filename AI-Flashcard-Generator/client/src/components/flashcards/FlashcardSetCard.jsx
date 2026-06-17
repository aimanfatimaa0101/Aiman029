import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function FlashcardSetCard({ set, onDelete, index = 0 }) {
  const progress = set.totalCards > 0
    ? Math.round((set.learnedCards / set.totalCards) * 100)
    : 0

  // Use slug for clean URLs, fall back to _id for old sets
  const identifier = set.slug || set._id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card-hover p-5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
            {set.title}
          </h3>
          {set.description && (
            <p className="text-xs text-white/40 mt-0.5 truncate">{set.description}</p>
          )}
        </div>
        <span className="ml-2 badge bg-primary-500/10 text-primary-400 border border-primary-500/20 shrink-0">
          {set.totalCards} cards
        </span>
      </div>

      {/* Subject & Tags */}
      <div className="flex items-center gap-2 mb-4">
        <span className="badge bg-white/5 text-white/40 border border-white/5 text-xs">
          {set.subject || 'General'}
        </span>
        {set.tags?.includes('ai-generated') && (
          <span className="badge bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs">
            ✨ AI
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/40 mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-600 to-violet-600 rounded-full"
          />
        </div>
        <p className="text-xs text-white/30 mt-1">
          {set.learnedCards}/{set.totalCards} learned
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          to={`/review/${identifier}`}
          className="flex-1 text-center btn-primary text-sm py-2 px-3"
        >
          📖 Review
        </Link>
        <Link
          to={`/quiz/${identifier}`}
          className="btn-secondary text-sm py-2 px-3"
        >
          🎯 Quiz
        </Link>
        <Link
          to={`/edit/${identifier}`}
          className="btn-secondary text-sm py-2 px-3"
        >
          ✏️
        </Link>
        <button
          onClick={() => onDelete(set._id)}
          className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  )
}