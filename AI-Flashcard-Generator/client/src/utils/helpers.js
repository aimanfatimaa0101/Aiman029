/**
 * Format a date to a readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

/**
 * Format a date as relative time (e.g. "2 days ago")
 */
export const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return formatDate(date)
}

/**
 * Truncate text to a max length
 */
export const truncate = (str, max = 60) =>
  str?.length > max ? str.slice(0, max) + '…' : str

/**
 * Shuffle an array (Fisher-Yates)
 */
export const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Get a grade label from a percentage score
 */
export const getGrade = (pct) => {
  if (pct >= 90) return { label: 'A+', color: 'text-yellow-400', emoji: '🏆' }
  if (pct >= 80) return { label: 'A',  color: 'text-emerald-400', emoji: '🎉' }
  if (pct >= 70) return { label: 'B',  color: 'text-blue-400',    emoji: '👍' }
  if (pct >= 60) return { label: 'C',  color: 'text-orange-400',  emoji: '📚' }
  return           { label: 'F',  color: 'text-red-400',     emoji: '💪' }
}

/**
 * Count words in a string
 */
export const wordCount = (str) =>
  str.trim().split(/\s+/).filter(Boolean).length

/**
 * Clamp a number between min and max
 */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)
