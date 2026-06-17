import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { aiAPI, quizAPI, flashcardAPI } from '../services/api'
import QuizQuestion from '../components/quiz/QuizQuestion'
import QuizResults from '../components/quiz/QuizResults'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function QuizPage() {
  const { id } = useParams()
  const [set, setSet] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState('setup') // setup | loading | quiz | results
  const [count, setCount] = useState(5)

  useEffect(() => {
    flashcardAPI.getOne(id)
      .then(res => setSet(res.data.data))
      .catch(() => toast.error('Failed to load set'))
  }, [id])

  const startQuiz = async () => {
    if (!set || set.cards.length < 2) return toast.error('Need at least 2 cards for a quiz')
    setPhase('loading')
    try {
      const res = await aiAPI.generateQuiz(id, { count: Math.min(count, set.cards.length) })
      setQuestions(res.data.data.questions)
      setCurrentIndex(0)
      setAnswers([])
      setScore(0)
      setPhase('quiz')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz. Check your OpenAI API key.')
      setPhase('setup')
    }
  }

  const handleAnswer = async (userAnswer, isCorrect) => {
    const q = questions[currentIndex]
    const newAnswer = {
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect
    }
    const newAnswers = [...answers, newAnswer]
    const newScore = score + (isCorrect ? 1 : 0)
    setAnswers(newAnswers)
    setScore(newScore)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      // Save result
      try {
        await quizAPI.saveResult({
          flashcardSetId: id,
          setTitle: set.title,
          score: newScore,
          totalQuestions: questions.length,
          answers: newAnswers
        })
      } catch {}
      setPhase('results')
    }
  }

  const handleRetry = () => {
    setPhase('setup')
    setQuestions([])
    setAnswers([])
    setScore(0)
    setCurrentIndex(0)
  }

  if (!set && phase !== 'results') return (
    <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/40 mb-3">
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <span>/</span>
            <Link to={`/review/${id}`} className="hover:text-white">{set?.title}</Link>
            <span>/</span>
            <span className="text-white/70">Quiz</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl border border-orange-500/20">🎯</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Quiz Mode</h1>
              <p className="text-white/40 text-sm">{set?.title}</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Setup */}
          {phase === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card p-8 text-center space-y-6">
              <div className="text-5xl">🧠</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Ready to test your knowledge?</h2>
                <p className="text-white/40 text-sm">AI will generate multiple-choice questions from your flashcards</p>
              </div>
              <div className="glass rounded-xl p-4 text-left">
                {[
                  { icon: '🃏', label: 'Source cards', value: `${set?.cards.length} flashcards` },
                  { icon: '🤖', label: 'Generation', value: 'AI-powered MCQs' },
                  { icon: '💡', label: 'Includes', value: 'Answer explanations' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-sm">
                    <span className="text-white/40 flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                    <span className="text-white/70">{item.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="label text-center mb-3">Number of questions</label>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[3, 5, 8, 10].filter(n => n <= set?.cards.length).map(n => (
                    <button key={n} onClick={() => setCount(n)}
                      className={`w-12 h-12 rounded-xl font-semibold transition-all ${count === n ? 'bg-primary-600 text-white' : 'glass text-white/60 hover:text-white border border-white/10'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={startQuiz} className="btn-primary w-full py-3 text-base">
                Start Quiz ✨
              </button>
            </motion.div>
          )}

          {/* Loading */}
          {phase === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-16 text-center space-y-4">
              <Spinner size="lg" className="mx-auto" />
              <p className="text-white/60">Generating quiz questions…</p>
              <p className="text-white/30 text-sm">AI is crafting {count} unique questions from your cards</p>
            </motion.div>
          )}

          {/* Quiz */}
          {phase === 'quiz' && questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <QuizQuestion
                  key={currentIndex}
                  question={questions[currentIndex]}
                  questionIndex={currentIndex}
                  total={questions.length}
                  onAnswer={handleAnswer}
                />
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results */}
          {phase === 'results' && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 sm:p-8">
              <QuizResults
                score={score}
                total={questions.length}
                answers={answers}
                setId={id}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
