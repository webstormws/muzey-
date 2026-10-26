import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(r=>r, async err => {
  const orig = err.config
  if (err.response?.status === 401 && !orig._retry) {
    orig._retry = true
    const refresh = localStorage.getItem('refresh')
    if (refresh) {
      try {
        const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:8000/api') + '/auth/refresh/', {refresh})
        localStorage.setItem('access', res.data.access)
        orig.headers.Authorization = `Bearer ${res.data.access}`
        return api(orig)
      } catch {}
    }
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    // Don't redirect to login, allow guest usage
  }
  return Promise.reject(err)
})

export default api
