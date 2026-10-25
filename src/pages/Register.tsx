import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register(){
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[username,setUsername]=useState('')
  const {register}=useAuth()
  const nav=useNavigate()
  async function submit(e:any){
    e.preventDefault()
    try{ await register(email,password,username); nav('/dashboard') }catch{ toast.error("Ro‘yxatdan o‘tishda xatolik") }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10131a] text-[#f2f4f8]">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Ro‘yxatdan o‘tish</h1>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Foydalanuvchi nomi (ixtiyoriy)" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Parol" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
        <button className="w-full py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Ro‘yxatdan o‘tish</button>
        <div className="text-sm text-white/60">Hisob bormi? <Link to="/login" className="text-[#f5b335]">Kirish</Link></div>
      </form>
    </div>
  )
}
