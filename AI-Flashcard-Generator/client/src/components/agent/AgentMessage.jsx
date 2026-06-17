import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'

const toolIcons = {
  generate_flashcards: '⚡',
  summarize_notes: '📝',
  explain_concept: '🔬',
  create_quiz_questions: '🎯',
  suggest_study_plan: '📅',
}

const ToolResultDisplay = ({ toolUsed, toolResult }) => {
  if (!toolResult) return null

  return (
    <div className="mt-3 glass rounded-xl border border-primary-500/20 overflow-hidden">
      <div className="px-4 py-2 bg-primary-500/10 border-b border-primary-500/20 flex items-center gap-2">
        <span>{toolIcons[toolUsed] || '🛠️'}</span>
        <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">
          {toolUsed?.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="p-4">
        {toolResult.type === 'flashcards' && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {toolResult.data?.map((card, i) => (
              <div key={i} className="p-2.5 bg-white/5 rounded-lg text-sm">
                <p className="font-medium text-white">Q: {card.question}</p>
                <p className="text-white/60 mt-1">A: {card.answer}</p>
              </div>
            ))}
          </div>
        )}
        {toolResult.type === 'quiz' && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {toolResult.data?.map((q, i) => (
              <div key={i} className="p-2.5 bg-white/5 rounded-lg text-sm">
                <p className="font-medium text-white">{i + 1}. {q.question}</p>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {q.options?.map((opt, j) => (
                    <span key={j} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40'}`}>
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {(toolResult.type === 'summary' || toolResult.type === 'explanation' || toolResult.type === 'study_plan') && (
          <div className="markdown text-sm max-h-48 overflow-y-auto">
            <ReactMarkdown>{toolResult.data}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgentMessage({ msg, index }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs">🤖</div>
            <span className="text-xs text-white/40">AI Agent</span>
            {msg.toolUsed && (
              <span className="badge bg-primary-500/10 text-primary-400 border border-primary-500/20 text-xs">
                {toolIcons[msg.toolUsed]} {msg.toolUsed?.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        )}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-600/30 border border-primary-500/30 text-white rounded-tr-sm'
            : 'glass border-white/10 text-white/90 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <div className="markdown">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          )}
          {msg.toolResult && (
            <ToolResultDisplay toolUsed={msg.toolUsed} toolResult={msg.toolResult} />
          )}
        </div>
        <p className="text-xs text-white/20 mt-1 px-1">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}
