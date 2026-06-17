import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, max = 100, label, showPct = true, color = 'primary', className = '' }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100)

  const colors = {
    primary: 'from-primary-600 to-violet-600',
    green:   'from-emerald-600 to-teal-500',
    orange:  'from-orange-500 to-amber-500',
    red:     'from-red-600 to-rose-500',
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPct) && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-white/40">
          {label && <span>{label}</span>}
          {showPct && <span>{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
    </div>
  )
}
