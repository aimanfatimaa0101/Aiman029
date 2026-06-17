import { useState, useCallback } from 'react'
import { flashcardAPI } from '../services/api'
import toast from 'react-hot-toast'

export const useFlashcards = () => {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({})

  const fetchSets = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await flashcardAPI.getAll(params)
      setSets(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load flashcard sets')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await flashcardAPI.getStats()
      setStats(res.data.data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteSet = useCallback(async (id) => {
    try {
      await flashcardAPI.delete(id)
      setSets(prev => prev.filter(s => s._id !== id))
      toast.success('Flashcard set deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }, [])

  const updateCardLearned = useCallback(async (setId, cardId, learned) => {
    try {
      const res = await flashcardAPI.updateCard(setId, cardId, { learned })
      setSets(prev => prev.map(s => s._id === setId ? res.data.data : s))
      return res.data.data
    } catch (err) {
      toast.error('Failed to update card status')
    }
  }, [])

  return { sets, loading, stats, pagination, fetchSets, fetchStats, deleteSet, updateCardLearned }
}
