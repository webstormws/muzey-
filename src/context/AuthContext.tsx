import { createContext, useContext, useState, ReactNode } from 'react'

type AuthContextType = {
  user: any
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  async function login(email: string, password: string) {
    // TODO: o'z API'ingizga almashtiring
    // const res = await api.post('/auth/login', { email, password })
    // const u = res.data.user
    const u = { email }
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }

  async function register(email: string, password: string, username?: string) {
    // TODO: o'z API'ingizga almashtiring
    // const res = await api.post('/auth/register', { email, password, username })
    // const u = res.data.user
    const u = { email, username }
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}