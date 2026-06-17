import { motion } from 'framer-motion'

export default function StatCard({ icon, label, value, color = 'primary', delay = 0 }) {
  const colors = {
    primary: 'from-primary-600/20 to-violet-600/20 border-primary-500/20 text-primary-400',
    green: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/20 text-emerald-400',
    orange: 'from-orange-600/20 to-amber-600/20 border-orange-500/20 text-orange-400',
    blue: 'from-blue-600/20 to-cyan-600/20 border-blue-500/20 text-blue-400',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-card bg-gradient-to-br ${colors[color]} p-5`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-2xl font-bold ${colors[color].split(' ').pop()}`}>{value}</span>
      </div>
      <p className="text-sm text-white/50">{label}</p>
    </motion.div>
  )
}
