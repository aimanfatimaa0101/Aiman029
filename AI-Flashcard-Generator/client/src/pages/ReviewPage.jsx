import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { flashcardAPI } from '../services/api'
import FlipCard from '../components/flashcards/FlipCard'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ReviewPage() {
  const { id } = useParams()
  const [set, setSet] = useState(null)
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filterLearned, setFilterLearned] = useState('all')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    flashcardAPI.getOne(id)
      .then(res => {
        setSet(res.data.data)
        setCards(res.data.data.cards)
      })
      .catch(() => toast.error('Failed to load flashcard set'))
      .finally(() => setLoading(false))
  }, [id])

  const filteredCards = cards.filter(c =>
    filterLearned === 'all' ? true :
    filterLearned === 'learned' ? c.learned :
    !c.learned
  )

  const currentCard = filteredCards[index]

  // Total learned count from the set
  const learnedCount = set?.cards.filter(c => c.learned).length || 0
  const totalCards = set?.cards.length || 0

  const handleNext = () => {
    if (index < filteredCards.length - 1) {
      setIndex(i => i + 1)
    } else {
      setCompleted(true)
    }
  }

  const handlePrev = () => {
    setIndex(i => Math.max(0, i - 1))
    setCompleted(false)
  }

  const handleLearned = async (cardId, learned) => {
    try {
      const res = await flashcardAPI.updateCard(id, cardId, { learned })
      const updatedSet = res.data.data

      // Update the set with fresh data from server
      setSet(updatedSet)

      // Update cards array with new learned status
      setCards(prev => prev.map(c => {
        const updated = updatedSet.cards.find(uc => uc._id === c._id)
        return updated ? updated : c
      }))

      if (learned) {
        toast.success('Marked as learned! ✅')
      }

      // Move to next card
      handleNext()

    } catch {
      toast.error('Failed to update card')
    }
  }

  const handleShuffle = () => {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5))
    setIndex(0)
    setCompleted(false)
    toast.success('Cards shuffled!')
  }

  const handleReset = () => {
    setIndex(0)
    setCompleted(false)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, filteredCards.length])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  if (!set) return (
    <div className="min-h-screen flex items-center justify-center text-white/40">
      Set not found
    </div>
  )

  const progressPct = totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-white/70">{set.title}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{set.title}</h1>
              <p className="text-white/40 text-sm mt-1">
                {set.subject} · {totalCards} cards · {learnedCount} learned
              </p>
            </div>
            <Link to={`/quiz/${id}`} className="btn-primary text-sm whitespace-nowrap">
              🎯 Take Quiz
            </Link>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <select
            value={filterLearned}
            onChange={e => {
              setFilterLearned(e.target.value)
              setIndex(0)
              setCompleted(false)
            }}
            className="input-field w-auto text-sm py-2"
          >
            <option value="all">All cards ({totalCards})</option>
            <option value="unlearned">Unlearned ({totalCards - learnedCount})</option>
            <option value="learned">Learned ({learnedCount})</option>
          </select>
          <button onClick={handleShuffle} className="btn-secondary text-sm py-2">
            🔀 Shuffle
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm py-2">
            ↩ Reset
          </button>
          <div className="ml-auto text-sm text-white/30 hidden sm:block">
            ← → keys to navigate
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50">Overall Progress</span>
            <span className="text-sm font-semibold text-emerald-400">
              {learnedCount}/{totalCards} learned
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/30">0%</span>
            <span className="text-xs text-emerald-400 font-medium">{progressPct}%</span>
            <span className="text-xs text-white/30">100%</span>
          </div>
        </div>

        {/* Card / Completed */}
        <AnimatePresence mode="wait">
          {filteredCards.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🃏</div>
              <p className="text-white/40">No cards match this filter</p>
            </motion.div>

          ) : completed ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-10 text-center"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
              <p className="text-white/40 mb-2">
                You reviewed all {filteredCards.length} cards
              </p>
              <p className="text-emerald-400 font-medium mb-4">
                {learnedCount}/{totalCards} cards learned overall
              </p>

              {/* Progress bar on completion */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-8 max-w-xs mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={handleReset} className="btn-secondary">
                  🔄 Review Again
                </button>
                <button onClick={handleShuffle} className="btn-secondary">
                  🔀 Shuffle & Retry
                </button>
                <Link to={`/quiz/${id}`} className="btn-primary">
                  🎯 Take Quiz
                </Link>
              </div>
            </motion.div>

          ) : (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <FlipCard
                card={currentCard}
                index={index}
                total={filteredCards.length}
                onLearned={handleLearned}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!completed && filteredCards.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={index === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="text-sm text-white/30">
              {index + 1} / {filteredCards.length}
            </span>
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              {index === filteredCards.length - 1 ? 'Finish ✓' : 'Next →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}