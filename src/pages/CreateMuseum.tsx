import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function CreateMuseum(){
  const [step,setStep]=useState(1)
  const [title,setTitle]=useState(''),[desc,setDesc]=useState('')
  const [files,setFiles]=useState<File[]>([])
  const [museum,setMuseum]=useState<any>(null)
  const nav=useNavigate()

  async function create(){
    if(!title.trim()) return toast.error('Nomi majburiy')
    try{
      const r=await api.post('/museums/',{title,description:desc})
      setMuseum(r.data)
      setStep(2)
    }catch(e:any){ toast.error(e.response?.data?.detail||'Xatolik') }
  }

  async function upload(){
    if(files.length===0) return toast.error('Kamida 1 ta rasm yuklang')
    const fd=new FormData()
    files.forEach(f=>fd.append('images',f))
    try{
      await api.post(`/museums/${museum.id}/artworks/`, fd, {headers:{'Content-Type':'multipart/form-data'}})
      setStep(3)
    }catch(e:any){ toast.error(e.response?.data?.detail||'Yuklashda xatolik') }
  }

  async function publish(){
    try{
      await api.patch(`/museums/${museum.id}/`, {is_public:true})
      nav(`/m/${museum.slug}`, {state:{created:true}})
    }catch{ toast.error('Xatolik') }
  }

  return (
    <div className="min-h-screen bg-[#10131a] text-[#f2f4f8]">
      <header className="px-6 py-4 border-b border-white/10">Muzey yaratish</header>
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {step===1 && <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="font-semibold">1-qadam: Ma’lumotlar</div>
          <input value={title} onChange={e=>setTitle(e.target.value)} maxLength={60} placeholder="Muzey nomi (majburiy)" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10"/>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Qisqacha tavsif" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 h-24"/>
          <button onClick={create} className="px-4 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Keyingi</button>
        </div>}
        {step===2 && <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="font-semibold">2-qadam: Rasmlar</div>
          <label className="block border border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer">
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={e=>setFiles(Array.from(e.target.files||[]))}/>
            <div>Rasmlarni tanlash yoki tortib tashlash</div>
            <div className="text-sm text-white/60">jpg/png/webp, max 10MB, max 48 ta</div>
          </label>
          <div className="text-sm text-white/60">{files.length} ta tanlandi</div>
          <button onClick={upload} className="px-4 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Keyingi</button>
        </div>}
        {step===3 && <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="font-semibold">3-qadam: Nashr qilish</div>
          <div>“{title}” muzeyi tayyor.</div>
          <button onClick={publish} className="px-4 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Muzeyni yaratish</button>
        </div>}
      </main>
    </div>
  )
}
