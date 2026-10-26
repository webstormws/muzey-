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
    <div className="min-h-screen bg-white text-gray-900">
      <header className="px-6 md:px-12 py-5 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="WebStorm IT Company" className="h-10 w-auto"/>
          <div className="font-semibold">WebStorm IT Company</div>
        </Link>
        <Link to="/" className="text-gray-600 hover:text-gray-900">Bosh sahifa</Link>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          {loc.state?.created && <div className="px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">Muvaffaqiyatli yaratildi!</div>}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{data?.title}</h1>
            {data?.description && <p className="mt-3 text-gray-600">{data?.description}</p>}
          </div>
          <div className="text-sm text-gray-500">Muallif: {data?.owner_name} • {data?.views_count} ko‘rish • {data?.artworks?.length||0} ta rasm</div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/m/${slug}/enter`} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Muzeyga kirish</Link>
            <button onClick={copy} className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50">{copied?'Nusxalandi':'Havolani nusxalash'}</button>
            <button onClick={share} className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50">Ulashish</button>
          </div>
          <div className="flex gap-2 text-sm">
            <a className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(data?.title||'')}`} target="_blank" rel="noreferrer">Telegram</a>
            <a className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" href={`https://wa.me/?text=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <QRCodeSVG value={url} size={220} bgColor="transparent" fgColor="#111827"/>
          <div className="text-sm text-gray-500 text-center break-all">{url}</div>
          <Link to="/create" className="text-blue-600 hover:text-blue-700">O‘z muzeyingni yarat</Link>
        </div>
      </main>
    </div>
  )
}
