import { useParams, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MuseumPublic(){
  const {slug}=useParams()
  const loc = useLocation() as any
  const {data}=useQuery({queryKey:['pub',slug], queryFn: async()=> (await api.get(`/public/museums/${slug}/`)).data})
  const url = window.location.origin + `/m/${slug}/enter`
  const [copied,setCopied]=useState(false)
  function copy(){
    navigator.clipboard.writeText(url)
    setCopied(true); toast.success('Nusxalandi'); setTimeout(()=>setCopied(false),1500)
  }
  function share(){
    if(navigator.share){ navigator.share({title:data?.title, url}) }
  }
  return (
    <div className="min-h-screen bg-[#10131a] text-[#f2f4f8]">
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="font-bold">Virtual 3D Muzey</div>
        <Link to="/" className="text-white/60">Bosh sahifa</Link>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {loc.state?.created && <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300">Muvaffaqiyatli yaratildi!</div>}
          <h1 className="text-3xl font-bold">{data?.title}</h1>
          <p className="text-white/70">{data?.description}</p>
          <div className="text-sm text-white/60">Muallif: {data?.owner_name} • {data?.views_count} ko‘rish • {data?.artworks?.length||0} ta rasm</div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/m/${slug}/enter`} className="px-4 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Muzeyga kirish</Link>
            <button onClick={copy} className="px-4 py-2 rounded-lg bg-white/10">{copied?'Nusxalandi':'Havolani nusxalash'}</button>
            <button onClick={share} className="px-4 py-2 rounded-lg bg-white/10">Ulashish</button>
          </div>
          <div className="flex gap-2 text-sm">
            <a className="px-2 py-1 rounded-lg bg-white/10" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(data?.title||'')}`}>Telegram</a>
            <a className="px-2 py-1 rounded-lg bg-white/10" href={`https://wa.me/?text=${encodeURIComponent(url)}`}>WhatsApp</a>
            <a className="px-2 py-1 rounded-lg bg-white/10" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}>Facebook</a>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
          <QRCodeSVG value={url} size={220} bgColor="transparent" fgColor="#f2f4f8"/>
          <div className="text-sm text-white/60">{url}</div>
          <Link to="/create" className="text-[#f5b335]">O‘z muzeyingni yarat</Link>
        </div>
      </main>
    </div>
  )
}
