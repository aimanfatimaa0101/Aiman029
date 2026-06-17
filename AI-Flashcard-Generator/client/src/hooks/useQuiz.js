import { useState, useCallback } from 'react'
import { quizAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useQuiz = () => {
  const [results, setResults] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const res = await quizAPI.getResults()
      setResults(res.data.data)
    } catch {
      toast.error('Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await quizAPI.getStats()
      setStats(res.data.data)
    } catch {}
  }, [])

  const saveResult = useCallback(async (data) => {
    try {
      const res = await quizAPI.saveResult(data)
      return res.data.data
    } catch {
      toast.error('Failed to save quiz result')
    }
  }, [])

  return { results, stats, loading, fetchResults, fetchStats, saveResult }
}
