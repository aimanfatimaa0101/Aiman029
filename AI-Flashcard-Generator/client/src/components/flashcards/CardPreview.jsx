export default function CardPreview({ cards = [], max = 3 }) {
  const preview = cards.slice(0, max)
  return (
    <div className="space-y-1.5">
      {preview.map((c, i) => (
        <div key={i} className="p-2 bg-white/3 rounded-lg border border-white/5 text-xs text-white/50 truncate">
          <span className="text-white/30 mr-1.5">Q:</span>{c.question}
        </div>
      ))}
      {cards.length > max && (
        <p className="text-xs text-white/25 pl-1">+{cards.length - max} more cards</p>
      )}
    </div>
  )
}
