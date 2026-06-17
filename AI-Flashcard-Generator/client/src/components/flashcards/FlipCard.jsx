import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlipCard({ card, index, total, onLearned }) {
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFlip = () => setFlipped(f => !f)

  const handleLearned = async (learned) => {
    setLoading(true)
    await onLearned(card._id, learned)
    setFlipped(false)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card counter */}
      <div className="flex items-center gap-2 text-sm text-white/40">
        <span>Card</span>
        <span className="px-3 py-0.5 glass rounded-full font-mono text-white/60">
          {index + 1} / {total}
        </span>
      </div>

      {/* Flip Card */}
      <div
        className="perspective w-full max-w-2xl cursor-pointer"
        style={{ height: '320px' }}
        onClick={!loading ? handleFlip : undefined}
      >
        <div className={`flip-card w-full h-full ${flipped ? 'flipped' : ''}`}>

          {/* Front - Question */}
          <div className="card-face absolute inset-0 glass-card flex flex-col items-center justify-center p-8 text-center">
            <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-4 text-xs uppercase tracking-wider">
              Question
            </span>
            <p className="text-xl font-semibold text-white leading-relaxed">
              {card.question}
            </p>
            <p className="text-sm text-white/30 mt-6">Click to reveal answer</p>
          </div>

          {/* Back - Answer */}
          <div className="card-face card-back absolute inset-0 glass-card flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary-900/30 to-violet-900/30">
            <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 text-xs uppercase tracking-wider">
              Answer
            </span>
            <p className="text-lg text-white/90 leading-relaxed">
              {card.answer}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons - only show when flipped */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={(e) => { e.stopPropagation(); handleLearned(false) }}
            disabled={loading}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            😓 Still Learning
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleLearned(true) }}
            disabled={loading}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 font-medium px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-50"
          >
            ✅ Got it!
          </button>
        </motion.div>
      )}

      {/* Learned badge */}
      {card.learned && !flipped && (
        <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          ✅ Learned
        </span>
      )}
    </div>
  )
}