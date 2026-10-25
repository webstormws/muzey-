import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Home(){
  const {t}=useTranslation()
  return (
    <div className="min-h-screen bg-[#10131a] text-[#f2f4f8]">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-lg font-bold">Virtual 3D Muzey</div>
        <nav className="flex gap-3">
          <Link to="/create" className="px-3 py-2 rounded-lg bg-[#f5b335] text-black font-semibold">{t('create_museum')}</Link>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">O‘zingizning 3D muzeyingizni yarating</h1>
          <p className="mt-4 text-white/70">Rasmlaringizni yuklang, pingvin bilan yurib ko‘ring, do‘stlaringizga ulashing.</p>
          <Link to="/create" className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#f5b335] text-black font-semibold">{t('create_museum')}</Link>
        </div>
        <div className="relative h-[320px] rounded-2xl bg-gradient-to-br from-[#f5b335]/20 to-transparent border border-white/10 flex items-center justify-center">
          <div className="text-6xl">🐧</div>
        </div>
      </main>
    </div>
  )
}
