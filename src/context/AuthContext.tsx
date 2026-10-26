import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client'

type User = any
type AuthCtx = {
  user: User | null
  loading: boolean
  login: (phone: string, password: string) => Promise<any>
  register: (data: any) => Promise<any>
  logout: () => void
}

const Ctx = createContext<AuthCtx>({} as any)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({children}:{children:any}){
  const [user,setUser]=useState<User|null>(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const token = localStorage.getItem('access')
    if(!token){ setLoading(false); return }
    api.get('/auth/me/').then(r=>setUser(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  },[])

  async function login(phone:string,password:string){
    const clean = phone.trim()
    try {
      const r = await api.post('/auth/login/', {email: clean, password})
      localStorage.setItem('access', r.data.access)
      localStorage.setItem('refresh', r.data.refresh)
      try { const me = await api.get('/auth/me/'); setUser(me.data); return me.data } catch { return r.data }
    } catch {
      try {
        const r = await api.post('/auth/login/', {username: clean, password})
        localStorage.setItem('access', r.data.access)
        localStorage.setItem('refresh', r.data.refresh)
        try { const me = await api.get('/auth/me/'); setUser(me.data); return me.data } catch { return r.data }
      } catch {
        throw new Error('login_failed')
      }
    }
  }

  async function register(data:any){
    const phone = data.phone || ''
    const payload: any = {
      username: phone || data.first_name || 'user',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      password: data.password,
      phone: phone,
    }
    const r = await api.post('/auth/register/', payload)
    try {
      await login(phone, data.password)
    } catch (e) {
    }
    return r.data
  }

  function logout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    window.location.href = '/'
  }

  return <Ctx.Provider value={{user,loading,login,register,logout}}>{children}</Ctx.Provider>
}
