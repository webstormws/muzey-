import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import toast from 'react-hot-toast'

export default function CreateMuseum(){
  const [step,setStep]=useState(1)
  const [title,setTitle]=useState(''),[desc,setDesc]=useState('')
  const [files,setFiles]=useState<File[]>([])
  const [museum,setMuseum]=useState<any>(null)
  const [artworks,setArtworks]=useState<any[]>([])
  const nav=useNavigate()

  async function create(){
    if(!title.trim()) return toast.error('Nomi majburiy')
    try{
      const r=await api.post('/museums/',{title,description:desc})
      setMuseum(r.data)
      setStep(2)
    }catch(e:any){ toast.error(e.response?.data?.detail||'Xatolik') }
  }

  const [uploading,setUploading]=useState(false)
  async function upload(){
    if(files.length===0) return toast.error('Kamida 1 ta rasm yuklang')
    setUploading(true)
    try{
      const toUpload = [...files]
      const results: any[] = []
      for (let i=0;i<toUpload.length;i+=10) {
        const batch = toUpload.slice(i,i+10)
        const fd=new FormData()
        batch.forEach(f=>fd.append('images',f))
        const res = await api.post(`/museums/${museum.id}/artworks/`, fd, {headers:{'Content-Type':'multipart/form-data'}})
        results.push(...(res.data||[]))
      }
      setArtworks(prev=>[...prev, ...results])
      setFiles([])
      setUploading(false)
      toast.success(`${results.length} ta rasm yuklandi`)
    }catch(e:any){ setUploading(false); toast.error(e.response?.data?.detail||'Yuklashda xatolik') }
  }

  async function publish(){
    try{
      await api.patch(`/museums/${museum.id}/`, {is_public:true})
      nav(`/m/${museum.slug}`, {state:{created:true}})
    }catch{ toast.error('Xatolik') }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="px-6 md:px-12 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="WebStorm IT Company" className="h-10 w-auto"/>
          <div className="font-semibold">Muzey yaratish</div>
        </div>
        <div className="text-sm text-gray-500">Qadam {step}/3</div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {step===1 && <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <div className="text-lg font-semibold">Muzey ma’lumotlari</div>
            <div className="text-sm text-gray-500 mt-1">Asosiy ma’lumotlarni kiriting</div>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-700">Muzey nomi *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} maxLength={60} placeholder="Masalan: San'at galereyasi" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"/>
          </div>
          <div className="space-y-3">
            <label className="text-sm text-gray-700">Tavsif</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Muzeyingiz haqida qisqacha..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none h-28"/>
          </div>
          <button onClick={create} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Davom etish</button>
        </div>}
        {step===2 && <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <div className="text-lg font-semibold">Rasmlarni yuklash</div>
            <div className="text-sm text-gray-500 mt-1">Muzeyingizga ko‘rgazma rasmlarini qo‘shing</div>
          </div>
          <label className="block border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-10 text-center cursor-pointer transition-colors">
            <input type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={(e:any)=>{const f=Array.from(e.target.files||[]); if(f.length) { setFiles(prev=>[...prev,...(f as any)]); } e.target.value=''}}/>
            <div className="text-lg mb-1">Rasmlarni tanlang yoki tashlang</div>
            <div className="text-sm text-gray-500">Bir nechta rasmni bir vaqtda tanlashingiz mumkin</div>
            <div className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Maks 10MB • Maks 48 ta</div>
          </label>
          {files.length>0 && <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">{files.length} ta rasm tanlandi</div>
              <div className="flex gap-2">
                <button onClick={()=>setFiles([])} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Tozalash</button>
                <button onClick={upload} disabled={uploading} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50">{uploading?'Yuklanmoqda...':'Yuklash'}</button>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {files.map((f:any,i)=>(<div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative"><img src={URL.createObjectURL(f)} className="w-full h-full object-cover"/><button onClick={()=>setFiles(files.filter((_,idx)=>idx!==i))} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs">×</button></div>) )}
            </div>
          </div>}
          {artworks.length>0 && <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="text-sm text-gray-700">Yuklangan rasmlar ({artworks.length}/48)</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {artworks.map((a:any,i)=>(<div key={i} className="aspect-square bg-gray-50 rounded-lg overflow-hidden"><img src={a.thumbnail||a.image} className="w-full h-full object-cover"/></div>) )}
            </div>
          </div>}
          <div className="flex gap-2">
            <button onClick={()=>setStep(1)} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Orqaga</button>
            <button onClick={()=>setStep(3)} disabled={artworks.length===0} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-40">Davom etish</button>
          </div>
        </div>}
        {step===3 && <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
          <div>
            <div className="text-lg font-semibold">Nashr qilish</div>
            <div className="text-sm text-gray-500 mt-1">Muzeyingiz tayyor</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="font-medium text-blue-900">“{title}”</div>
            <div className="text-sm text-blue-700 mt-1">{artworks.length} ta rasm yuklangan</div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setStep(2)} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Orqaga</button>
            <button onClick={publish} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Muzeyni yaratish</button>
          </div>
        </div>}
      </main>
    </div>
  )
}
