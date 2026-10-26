import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login(){
  const [phone,setPhone]=useState(''),[password,setPassword]=useState('')
  const {login}=useAuth()
  const nav=useNavigate()
  async function submit(e:any){
    e.preventDefault()
    const p = phone.trim()
    const pass = password.trim()
    if(!p) return toast.error('Telefon raqami kiritilishi shart')
    if(!pass) return toast.error('Parol kiritilishi shart')
    try{ 
      await login(p, pass)
      toast.success('Muvaffaqiyatli kirildi')
      nav('/dashboard')
    }catch(err:any){ 
      const msg = err.response?.data
      const text = typeof msg === 'string' ? msg : msg?.detail || msg?.email?.[0] || msg?.username?.[0] || 'Telefon raqami yoki parol noto\'g\'ri'
      toast.error(text)
    }
  }
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="px-6 md:px-12 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="WebStorm IT Company" className="h-10 w-auto"/>
          <div className="font-semibold">WebStorm IT Company</div>
        </Link>
        <Link to="/" className="text-gray-600 hover:text-gray-900">Bosh sahifa</Link>
      </header>
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Kirish</h1>
            <p className="text-sm text-gray-500 mt-1">Telefon raqami va parol orqali kiring</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Telefon raqami" autoComplete="username" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Parol" autoComplete="current-password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
            <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Kirish</button>
          </form>
          <div className="text-sm text-gray-500 mt-4">Hisob yo‘qmi? <Link to="/register" className="text-blue-600">Ro‘yxatdan o‘tish</Link></div>
        </div>
      </main>
    </div>
  )
}
