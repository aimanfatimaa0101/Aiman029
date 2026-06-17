import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useFlashcards } from '../hooks/useFlashcards'
import { quizAPI } from '../services/api'
import FlashcardSetCard from '../components/flashcards/FlashcardSetCard'
import StatCard from '../components/ui/StatCard'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const { sets, loading, stats, pagination, fetchSets, fetchStats, deleteSet } = useFlashcards()
  const [search, setSearch] = useState('')
  const [quizStats, setQuizStats] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchSets({ page, limit: 12, search })
    fetchStats()
    quizAPI.getStats().then(r => setQuizStats(r.data.data)).catch(() => {})
  }, [page, search])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteSet(deleteTarget)
    setDeleteTarget(null)
    fetchStats()
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-white/40 mt-1">Here's your study overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📚" label="Flashcard Sets" value={stats?.totalSets ?? '—'} color="primary" delay={0} />
          <StatCard icon="🃏" label="Total Cards" value={stats?.totalCards ?? '—'} color="blue" delay={0.05} />
          <StatCard icon="✅" label="Cards Learned" value={stats?.learnedCards ?? '—'} color="green" delay={0.1} />
          <StatCard icon="🎯" label="Quizzes Taken" value={quizStats?.totalQuizzes ?? '—'} color="orange" delay={0.15} />
        </div>

        {/* Mastery Progress */}
        {stats && stats.totalCards > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">Overall Mastery</h3>
                <p className="text-sm text-white/40">{stats.learnedCards} of {stats.totalCards} cards learned</p>
              </div>
              <span className="text-2xl font-bold gradient-text">{stats.masteryRate}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.masteryRate}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-primary-600 to-violet-600 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              type="text" value={search} onChange={handleSearch}
              placeholder="Search flashcard sets..."
              className="input-field pl-10 w-full"
            />
          </div>
          <Link to="/generate" className="btn-primary whitespace-nowrap flex items-center gap-2">
            <span>✨</span> New Set
          </Link>
        </div>

        {/* Sets Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : sets.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {search ? 'No sets match your search' : 'No flashcard sets yet'}
            </h3>
            <p className="text-white/40 mb-6">
              {search ? 'Try a different search term' : 'Create your first AI-powered flashcard set'}
            </p>
            {!search && (
              <Link to="/generate" className="btn-primary inline-flex items-center gap-2">
                ✨ Generate with AI
              </Link>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sets.map((set, i) => (
                <FlashcardSetCard key={set._id} set={set} index={i} onDelete={setDeleteTarget} />
              ))}
            </div>
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm">← Prev</button>
                <span className="text-white/40 text-sm px-3">{page} / {pagination.pages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages} className="btn-secondary px-4 py-2 text-sm">Next →</button>
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/generate', icon: '✨', title: 'AI Generator', desc: 'Paste text → instant flashcards', color: 'from-primary-600/20 to-violet-600/20 border-primary-500/20' },
            { to: '/agent', icon: '🤖', title: 'Study Agent', desc: 'Chat with your AI study assistant', color: 'from-violet-600/20 to-pink-600/20 border-violet-500/20' },
            { to: '/dashboard', icon: '📊', title: 'Quiz History', desc: `${quizStats?.avgScore ?? 0}% average score`, color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/20' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className={`glass-card bg-gradient-to-br ${item.color} p-5 hover:scale-[1.02] transition-all duration-200`}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-white/40 mt-1">{item.desc}</p>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Flashcard Set">
        <p className="text-white/60 mb-6">Are you sure you want to delete this flashcard set? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} className="btn-danger">Delete Set</button>
        </div>
      </Modal>
    </div>
  )
}
