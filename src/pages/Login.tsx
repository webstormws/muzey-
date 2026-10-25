import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login(){
  const [email,setEmail]=useState(''),[password,setPassword]=useState('')
  const {login}=useAuth()
  const nav=useNavigate()
  async function submit(e:any){
    e.preventDefault()
    try{ await login(email,password); nav('/dashboard') }catch{ toast.error("Kirishda xatolik") }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10131a] text-[#f2f4f8]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Kirish</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Parol" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
        <button className="w-full py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Kirish</button>
        <div className="text-sm text-white/60">Hisob yo‘qmi? <Link to="/register" className="text-[#f5b335]">Ro‘yxatdan o‘tish</Link></div>
      </form>
    </div>
  )
}