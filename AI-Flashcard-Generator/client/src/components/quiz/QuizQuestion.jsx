import { useState } from 'react'
import { motion } from 'framer-motion'

export default function QuizQuestion({
  question,
  questionIndex,
  total,
  onAnswer,
}) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (option) => {
    if (submitted) return
    setSelected(option)
  }

  const handleSubmit = () => {
    if (!selected) return

    setSubmitted(true)

    const isCorrect =
      selected.toLowerCase().trim() ===
      getCorrectAnswer().toLowerCase().trim()

    setTimeout(() => {
      onAnswer(selected, isCorrect)
      setSelected(null)
      setSubmitted(false)
    }, 1200)
  }

  const getCorrectAnswer = () => {
    const letterMap = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    }

    const ans = question.correctAnswer?.trim() || ''

    if (
      ans.length <= 2 &&
      letterMap[ans.toUpperCase()] !== undefined
    ) {
      return question.options[letterMap[ans.toUpperCase()]]
    }

    return ans
  }

  const isCorrectOption = (option) => {
    return (
      option.toLowerCase().trim() ===
      getCorrectAnswer().toLowerCase().trim()
    )
  }

  const getOptionClass = (option) => {
    const base =
      'w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm font-medium cursor-pointer'

    if (!submitted) {
      return selected === option
        ? `${base} bg-primary-600/20 border-primary-500/50 text-white`
        : `${base} glass border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20`
    }

    if (isCorrectOption(option)) {
      return `${base} bg-emerald-500/20 border-emerald-500/50 text-emerald-300`
    }

    if (option === selected && !isCorrectOption(option)) {
      return `${base} bg-red-500/20 border-red-500/50 text-red-300`
    }

    return `${base} glass border-white/5 text-white/30`
  }

  const optionLabels = ['A', 'B', 'C', 'D']

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-white/40 mb-2">
          <span>
            Question {questionIndex + 1} of {total}
          </span>

          <span>
            {Math.round(
              ((questionIndex + 1) / total) * 100
            )}
            % complete
          </span>
        </div>

        <div className="h-1.5 bg-white/5 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 to-violet-600 rounded-full"
            initial={{
              width: `${(questionIndex / total) * 100}%`,
            }}
            animate={{
              width: `${((questionIndex + 1) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="glass-card p-6">
        <p className="text-lg font-semibold text-white leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={getOptionClass(option)}
            onClick={() => handleSelect(option)}
          >
            <span className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                {optionLabels[i]}
              </span>

              <span>{option}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {submitted && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 glass rounded-xl border border-primary-500/20"
        >
          <p className="text-xs text-primary-400 font-medium mb-1">
            💡 Explanation
          </p>

          <p className="text-sm text-white/70">
            {question.explanation}
          </p>
        </motion.div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full btn-primary"
        >
          Submit Answer
        </button>
      )}
    </motion.div>
  )
}