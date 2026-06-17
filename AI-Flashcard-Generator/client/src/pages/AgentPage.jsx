import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiAPI } from '../services/api'
import AgentMessage from '../components/agent/AgentMessage'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  { text: 'Explain photosynthesis in simple terms', icon: '🔬' },
  { text: 'Create flashcards from: The mitochondria is the powerhouse of the cell. DNA carries genetic information. Cells are the basic unit of life.', icon: '⚡' },
  { text: 'Summarize the main concepts of World War II', icon: '📝' },
  { text: 'Create a 3-day study plan for biology exam', icon: '📅' },
  { text: 'Create quiz questions about the solar system', icon: '🎯' },
]

export default function AgentPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg = { role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build history for API (last 10 messages)
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))

    try {
      const res = await aiAPI.agent({ message: msg, history })
      const { message: agentMsg, toolUsed, toolResult } = res.data.data
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: agentMsg,
        toolUsed,
        toolResult,
        timestamp: new Date()
      }])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Agent failed. Check your OpenAI API key.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared')
  }

  const toolIcons = {
    generate_flashcards: '⚡ Flashcard Generator',
    summarize_notes: '📝 Note Summarizer',
    explain_concept: '🔬 Concept Explainer',
    create_quiz_questions: '🎯 Quiz Creator',
    suggest_study_plan: '📅 Study Planner',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col flex-1 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Study Agent</h1>
              <p className="text-white/40 text-sm">Powered by GPT-3.5 with function calling</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-secondary text-sm py-2">🗑️ Clear</button>
          )}
        </motion.div>

        {/* Tools row */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Object.entries(toolIcons).map(([key, label]) => (
            <span key={key} className="badge bg-white/5 text-white/40 border border-white/5 text-xs py-1 px-2.5">
              {label}
            </span>
          ))}
        </div>

        {/* Chat area */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col" style={{ minHeight: '480px' }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="text-5xl mb-4">🤖</div>
                <h2 className="text-xl font-semibold text-white mb-2">Your AI Study Assistant</h2>
                <p className="text-white/40 text-sm mb-8 max-w-md">
                  Ask me to explain concepts, create flashcards, summarize notes, generate quizzes, or plan your studies.
                  I'll automatically pick the best tool for your request.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => sendMessage(s.text)}
                      className="text-left p-3 glass border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all text-sm text-white/60 hover:text-white"
                    >
                      <span className="mr-2">{s.icon}</span>
                      {s.text.length > 55 ? s.text.slice(0, 55) + '…' : s.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <AgentMessage key={i} msg={msg} index={i} />
                ))}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm shrink-0">🤖</div>
                    <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm border border-white/10 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <motion.div key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                            animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                        ))}
                      </div>
                      <span className="text-white/40 text-sm">Thinking…</span>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything… (Enter to send, Shift+Enter for new line)"
                className="input-field flex-1 resize-none min-h-[44px] max-h-32 py-2.5"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn-primary px-4 py-2.5 shrink-0 flex items-center gap-1.5 self-end"
              >
                {loading ? <Spinner size="sm" /> : '↑'}
              </button>
            </div>
            <p className="text-xs text-white/20 mt-2 text-center">
              Agent automatically selects: Flashcard Generator · Note Summarizer · Concept Explainer · Quiz Creator · Study Planner
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
