import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard(){
  const {user,logout}=useAuth()
  const {data: museums=[]}=useQuery({queryKey:['museums'], queryFn: async()=> (await api.get('/museums/')).data, enabled: !!user})
  return (
    <div className="min-h-screen bg-[#10131a] text-[#f2f4f8]">
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-bold">Virtual 3D Muzey</Link>
        <div className="flex items-center gap-3">
          {user && <span className="text-white/60">{user?.email}</span>}
          {user && <button onClick={logout} className="px-3 py-2 rounded-lg bg-white/5">Chiqish</button>}
          <Link to="/create" className="px-3 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">Muzey yaratish</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Mening muzeylarim</h1>
        {user ? <div className="grid md:grid-cols-3 gap-4">
          {museums.map((m:any)=>(
            <div key={m.id} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <div className="h-40 bg-black/40">{m.cover&&<img src={m.cover} className="w-full h-full object-cover"/>}</div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-sm text-white/60">{m.artworks?.length||0} ta rasm • {m.views_count} ko‘rish</div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <Link to={`/m/${m.slug}/enter`} className="px-2 py-1 rounded-lg bg-[#f5b335] text-black">Kirish</Link>
                  <Link to={`/m/${m.slug}`} className="px-2 py-1 rounded-lg bg-white/10">Ulashish</Link>
                  <Link to={`/edit/${m.id}`} className="px-2 py-1 rounded-lg bg-white/10">Tahrirlash</Link>
                </div>
              </div>
            </div>
          ))}
          {museums.length===0 && <div className="text-white/60">Hali muzey yo‘q</div>}
        </div> : <div className="text-white/60">Ro‘yxatdan o‘tmasdan ham muzey yaratish mumkin. <Link to="/create" className="text-[#f5b335]">Boshlash</Link></div>}
      </main>
    </div>
  )
}
