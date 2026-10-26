import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

export default function Home(){
  const {t}=useTranslation()
  const {data:museums}=useQuery({queryKey:['my'], queryFn: async()=>{try{const r=await api.get('/museums/');return r.data}catch{return []}}})
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="WebStorm IT Company" className="h-10 w-auto"/>
          <div className="text-lg font-semibold">WebStorm IT Company</div>
        </div>
        <nav className="flex gap-2 items-center">
          <Link to="/create" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">{t('create_museum')}</Link>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">O‘z 3D muzeyingizni bir zumda yarating</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">Rasmlaringizni yuklang, interaktiv 3D galereyada namoyish eting va do‘stlaringizga ulashing.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/create" className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">{t('create_museum')}</Link>
            <a href="#museums" className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Muzeylarni ko‘rish</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-600/10 border border-gray-100">
            <div className="w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
              <div className="text-8xl">🐧</div>
            </div>
          </div>
        </div>
      </main>
      {museums?.length>0 && <section id="museums" className="max-w-6xl mx-auto px-6 md:px-12 pb-16">
        <h2 className="text-2xl font-semibold mb-6">Mening muzeylarim</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {museums.map((m:any)=>(
            <Link to={`/m/${m.slug}`} key={m.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-blue-600/5 transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                {m.cover ? <img src={m.cover} className="w-full h-full object-cover"/> : <div className="text-4xl">🖼️</div>}
              </div>
              <div className="p-4">
                <div className="font-medium group-hover:text-blue-600 transition-colors">{m.title}</div>
                <div className="text-sm text-gray-500 mt-1">{m.artworks?.length||0} ta rasm • {m.views_count} ko‘rish</div>
              </div>
            </Link>
          ))}
        </div>
      </section>}
      <section id="how" className="max-w-6xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-blue-600/5 transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">1</div>
          <h3 className="mt-4 text-lg font-semibold">Muzey yaratish</h3>
          <p className="mt-2 text-gray-600">Nom va tavsif berib, muzeyingizni yarating</p>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-blue-600/5 transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">2</div>
          <h3 className="mt-4 text-lg font-semibold">Rasmlarni yuklash</h3>
          <p className="mt-2 text-gray-600">Ko‘p rasmni bir zumda yuklang</p>
        </div>
        <div className="p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-blue-600/5 transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">3</div>
          <h3 className="mt-4 text-lg font-semibold">Ulashish</h3>
          <p className="mt-2 text-gray-600">Havola orqali 3D muzeyga taklif qiling</p>
        </div>
      </section>
      <footer className="border-t border-gray-100 py-8 text-center text-gray-500">
        <div className="max-w-6xl mx-auto px-6">© {new Date().getFullYear()} Virtual 3D Muzey</div>
      </footer>
    </div>
  )
}
