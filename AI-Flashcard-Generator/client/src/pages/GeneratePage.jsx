import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

const SUBJECTS = ['General', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'History', 'Geography', 'Literature', 'Computer Science', 'Economics', 'Psychology', 'Philosophy']

export default function GeneratePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', text: '', count: 10, subject: 'General', description: '' })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [step, setStep] = useState(1) // 1 = input, 2 = preview

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleGenerate = async e => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Please enter a title')
    if (form.text.trim().length < 50) return toast.error('Text must be at least 50 characters')
    setLoading(true)
    try {
      const res = await aiAPI.generate({ ...form, count: Number(form.count) })
      toast.success(`Generated ${res.data.data.cards.length} flashcards!`)
      navigate(`/review/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Check your OpenAI API key.')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = form.text.trim().split(/\s+/).filter(Boolean).length
  const charCount = form.text.length

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center text-xl border border-primary-500/20">✨</div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Flashcard Generator</h1>
              <p className="text-white/40 text-sm">Paste your notes → get instant flashcards</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleGenerate}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main input */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-600/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">1</span>
                  Set Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Title *</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange}
                      placeholder="e.g. Biology Chapter 5 - Cell Division"
                      className="input-field" maxLength={100} />
                  </div>
                  <div>
                    <label className="label">Description <span className="text-white/30">(optional)</span></label>
                    <input type="text" name="description" value={form.description} onChange={handleChange}
                      placeholder="Brief description of the topic..."
                      className="input-field" maxLength={200} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Cards to generate</label>
                      <select name="count" value={form.count} onChange={handleChange} className="input-field">
                        {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} cards</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary-600/30 rounded-full flex items-center justify-center text-xs font-bold text-primary-400">2</span>
                  Paste Your Content *
                </h2>
                <textarea
                  name="text" value={form.text} onChange={handleChange}
                  placeholder="Paste your lecture notes, textbook content, article, or any study material here...

The AI will analyze the content and extract the most important concepts to create focused flashcards."
                  className="input-field resize-none font-mono text-sm leading-relaxed"
                  rows={14}
                  maxLength={10000}
                />
                <div className="flex items-center justify-between mt-2 text-xs text-white/30">
                  <span>{wordCount} words</span>
                  <span className={charCount > 9000 ? 'text-orange-400' : ''}>{charCount.toLocaleString()} / 10,000</span>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
                <h3 className="font-semibold text-white mb-4">Summary</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Title', value: form.title || '—', truncate: true },
                    { label: 'Subject', value: form.subject },
                    { label: 'Cards', value: `${form.count} flashcards` },
                    { label: 'Content', value: wordCount > 0 ? `${wordCount} words` : 'Not added yet' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-2">
                      <span className="text-white/40 shrink-0">{item.label}</span>
                      <span className={`text-white/80 text-right ${item.truncate ? 'truncate max-w-[140px]' : ''}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading || !form.title || form.text.length < 50}
                  className="btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3">
                  {loading ? <><Spinner size="sm" /> Generating...</> : <><span>✨</span> Generate Cards</>}
                </button>

                {loading && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/40 text-center mt-3">
                    AI is analyzing your content…
                  </motion.p>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
                <h3 className="font-semibold text-white mb-3 text-sm">💡 Tips for best results</h3>
                <ul className="space-y-2 text-xs text-white/40">
                  <li className="flex items-start gap-2"><span className="text-primary-400 shrink-0">→</span> Use structured notes with clear concepts</li>
                  <li className="flex items-start gap-2"><span className="text-primary-400 shrink-0">→</span> Longer text (200+ words) yields better cards</li>
                  <li className="flex items-start gap-2"><span className="text-primary-400 shrink-0">→</span> Specific topics work better than vague summaries</li>
                  <li className="flex items-start gap-2"><span className="text-primary-400 shrink-0">→</span> Use 10-15 cards for comprehensive coverage</li>
                  <li className="flex items-start gap-2"><span className="text-primary-400 shrink-0">→</span> Review and edit generated cards if needed</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
