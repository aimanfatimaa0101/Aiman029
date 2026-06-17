const variants = {
  default:  'bg-white/5 text-white/50 border-white/10',
  primary:  'bg-primary-500/10 text-primary-400 border-primary-500/20',
  success:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:   'bg-red-500/10 text-red-400 border-red-500/20',
  violet:   'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
