import Spinner from '../components/ui/Spinner'

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-white/30 text-sm animate-pulse">Loading…</p>
    </div>
  )
}
