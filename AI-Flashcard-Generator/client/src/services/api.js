import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// Flashcards
export const flashcardAPI = {
  getAll: (params) => api.get('/flashcards', { params }),
  getOne: (id) => api.get(`/flashcards/${id}`),
  create: (data) => api.post('/flashcards', data),
  update: (id, data) => api.put(`/flashcards/${id}`, data),
  delete: (id) => api.delete(`/flashcards/${id}`),
  updateCard: (setId, cardId, data) => api.patch(`/flashcards/${setId}/cards/${cardId}`, data),
  getStats: () => api.get('/flashcards/stats'),
}

// Quiz
export const quizAPI = {
  saveResult: (data) => api.post('/quiz/results', data),
  getResults: () => api.get('/quiz/results'),
  getStats: () => api.get('/quiz/stats'),
}

// AI
export const aiAPI = {
  generate: (data) => api.post('/ai/generate', data),
  generateQuiz: (setId, data) => api.post(`/ai/quiz/${setId}`, data),
  summarize: (data) => api.post('/ai/summarize', data),
  explain: (data) => api.post('/ai/explain', data),
  agent: (data) => api.post('/ai/agent', data),
}

export default api
