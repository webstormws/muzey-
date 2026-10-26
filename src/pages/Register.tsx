import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register(){
  const [first_name,setFirst]=useState('')
  const [last_name,setLast]=useState('')
  const [phone,setPhone]=useState('')
  const [password,setPassword]=useState('')
  const [agree,setAgree]=useState(false)
  const {register}=useAuth()
  const nav=useNavigate()
  async function submit(e:any){
    e.preventDefault()
    if(!first_name.trim()) return toast.error('Ism kiritilishi shart')
    if(!last_name.trim()) return toast.error('Familiya kiritilishi shart')
    if(!phone.trim()) return toast.error('Telefon raqami kiritilishi shart')
    if(!password.trim()) return toast.error('Parol kiritilishi shart')
    if(password.trim().length < 6) return toast.error('Parol kamida 6 ta belgi bo\'lishi kerak')
    if(!agree) return toast.error('Rozilik shartnomasini qabul qiling')
    try{
      await register({first_name, last_name, phone: phone.trim(), password: password.trim()})
      toast.success('Ro\'yxatdan o\'tish muvaffaqiyatli')
      nav('/dashboard')
    }catch(err:any){ 
      const msg = err.response?.data
      const text = typeof msg === 'string' ? msg : msg?.detail || msg?.email?.[0] || msg?.username?.[0] || 'Ro\'yxatdan o\'tishda xatolik'
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
            <h1 className="text-2xl font-semibold">Ro‘yxatdan o‘tish</h1>
            <p className="text-sm text-gray-500 mt-1">Ma’lumotlaringizni kiriting</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input value={first_name} onChange={e=>setFirst(e.target.value)} placeholder="Ism" autoComplete="given-name" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
              <input value={last_name} onChange={e=>setLast(e.target.value)} placeholder="Familiya" autoComplete="family-name" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
            </div>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Telefon raqami" autoComplete="tel" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Parol" autoComplete="new-password" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
            <label className="flex items-start gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mt-1"/>
              <span>Men <a href="#" className="text-blue-600">rozilik shartnomasi</a> va <a href="#" className="text-blue-600">foydalanish qoidalari</a> bilan tanishdim va roziman</span>
            </label>
            <button className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Ro‘yxatdan o‘tish</button>
          </form>
          <div className="text-sm text-gray-500 mt-4">Hisobingiz bormi? <Link to="/login" className="text-blue-600">Kirish</Link></div>
        </div>
      </main>
    </div>
  )
}
