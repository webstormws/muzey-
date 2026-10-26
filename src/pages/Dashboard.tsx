import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard(){
  const {user,logout}=useAuth()
  const {data: museums=[]}=useQuery({queryKey:['museums'], queryFn: async()=> (await api.get('/museums/')).data, enabled: !!user})
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="WebStorm IT Company" className="h-10 w-auto"/>
          <div className="font-semibold">WebStorm IT Company</div>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/create" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Muzey yaratish</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Mening muzeylarim</h1>
          <Link to="/create" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">+ Yangi muzey</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {museums.map((m:any)=>(
            <div key={m.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-blue-600/5 transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-white">{m.cover&&<img src={m.cover} className="w-full h-full object-cover"/>}</div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="font-medium">{m.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{m.artworks?.length||0} ta rasm • {m.views_count} ko‘rish</div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link to={`/m/${m.slug}/enter`} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white">Ko‘rish</Link>
                  <Link to={`/m/${m.slug}`} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Ulashish</Link>
                  <Link to={`/edit/${m.id}`} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Tahrirlash</Link>
                </div>
              </div>
            </div>
          ))}
          {museums.length===0 && <div className="col-span-full text-center py-12 text-gray-500">Hali muzey yo‘q. <Link to="/create" className="text-blue-600">Birinchi muzeyingizni yarating</Link></div>}
        </div>
      </main>
    </div>
  )
}
