import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { flashcardAPI } from '../services/api'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function EditSetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [set, setSet] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    flashcardAPI.getOne(id)
      .then(res => {
        const s = res.data.data
        setSet(s)
        setTitle(s.title)
        setDescription(s.description || '')
        setCards(s.cards.map(c => ({ ...c })))
      })
      .catch(() => toast.error('Failed to load set'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCardChange = (index, field, value) => {
    setCards(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  const addCard = () => {
    setCards(prev => [...prev, { question: '', answer: '', learned: false }])
    setTimeout(() => {
      document.getElementById(`card-${cards.length}`)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const removeCard = (index) => {
    if (cards.length <= 1) return toast.error('Must have at least 1 card')
    setCards(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Title is required')
    const validCards = cards.filter(c => c.question.trim() && c.answer.trim())
    if (validCards.length === 0) return toast.error('At least one complete card is required')
    setSaving(true)
    try {
      await flashcardAPI.update(id, { title, description, cards: validCards })
      toast.success('Flashcard set updated!')
      navigate(`/review/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!set) return <div className="min-h-screen flex items-center justify-center text-white/40">Set not found</div>

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
              <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
              <span>/</span>
              <span className="text-white/70">Edit Set</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">✏️ Edit Flashcard Set</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving ? <><Spinner size="sm" /> Saving…</> : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Set Info */}
        <div className="glass-card p-6 mb-6 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="input-field" placeholder="Set title" maxLength={100} />
          </div>
          <div>
            <label className="label">Description <span className="text-white/30">(optional)</span></label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              className="input-field" placeholder="Brief description…" maxLength={200} />
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">{cards.length} Cards</h2>
            <button onClick={addCard} className="btn-secondary text-sm py-2 flex items-center gap-1.5">
              + Add Card
            </button>
          </div>

          <AnimatePresence>
            {cards.map((card, i) => (
              <motion.div
                key={i}
                id={`card-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/40">Card {i + 1}</span>
                  <div className="flex items-center gap-2">
                    {card.learned && <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">✅ Learned</span>}
                    <button onClick={() => removeCard(i)} className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10">
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Question</label>
                    <textarea
                      value={card.question}
                      onChange={e => handleCardChange(i, 'question', e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Enter question…"
                    />
                  </div>
                  <div>
                    <label className="label">Answer</label>
                    <textarea
                      value={card.answer}
                      onChange={e => handleCardChange(i, 'answer', e.target.value)}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Enter answer…"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between glass-card p-4">
          <div className="text-sm text-white/40">
            {cards.filter(c => c.question && c.answer).length} / {cards.length} complete
          </div>
          <div className="flex gap-2">
            <button onClick={addCard} className="btn-secondary text-sm">+ Add Card</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving ? <><Spinner size="sm" /> Saving…</> : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
