import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/generate', label: 'Generate', icon: '✨' },
  { to: '/agent', label: 'AI Agent', icon: '🤖' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-lg shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all">
              ⚡
            </div>
            <span className="font-bold text-white hidden sm:block">FlashAI</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-xl">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-white/70">{user?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/50 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-xl hover:bg-red-500/10"
            >
              Logout
            </button>
            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/70 hover:text-white p-2"
              onClick={() => setMenuOpen(o => !o)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-white/5 px-4 py-3 space-y-1"
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
