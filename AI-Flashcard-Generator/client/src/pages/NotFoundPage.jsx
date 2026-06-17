import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">🃏</div>
        <h1 className="text-6xl font-black text-white mb-3">404</h1>
        <p className="text-xl text-white/50 mb-8">This page doesn't exist</p>
        <Link to="/dashboard" className="btn-primary px-8 py-3 text-base">
          ← Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
