import { useI18n } from '../i18n'
import { Kid, levelFor } from '../store'
import { SHOP_ITEMS } from '../data/gameData'

export const WORLDS = [
  { id: 'letters', icon: '🔤', grad: 'from-purple-500 to-indigo-600' },
  { id: 'reading', icon: '📖', grad: 'from-pink-500 to-rose-600' },
  { id: 'numbers', icon: '🔢', grad: 'from-emerald-500 to-teal-600' },
  { id: 'dinosaurs', icon: '🌋', grad: 'from-amber-500 to-orange-600' },
  { id: 'thinking', icon: '🧩', grad: 'from-cyan-500 to-blue-600' },
]

export function MapView({ kid, onPick }: { kid: Kid; onPick: (id: string) => void }) {
  const { t } = useI18n()
  const bg = SHOP_ITEMS.find((i) => i.id === kid.bg)?.bg || 'from-sky-300 via-emerald-200 to-teal-300'
  return (
    <div className={`relative min-h-[calc(100vh-72px)] bg-gradient-to-b ${bg} p-4 sm:p-8 overflow-hidden`}>
      {['☁️', '🌴', '🍄', '⛰️'].map((e, i) => (
        <span key={e} className="absolute text-6xl opacity-50 animate-float pointer-events-none" style={{ top: `${8 + i * 22}%`, left: i % 2 ? '88%' : '2%', animationDelay: `${i * 0.9}s` }}>{e}</span>
      ))}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-center text-3xl sm:text-5xl font-black font-fredoka text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]">🗺️ {t('choose')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 pb-32">
          {WORLDS.map((w, i) => {
            const n = kid.attempts.filter((a) => a.w === w.id).length
            return (
              <button key={w.id} onClick={() => onPick(w.id)} className="group text-left bg-white rounded-3xl p-4 border-4 border-white shadow-xl hover:scale-105 hover:-rotate-1 transition cursor-pointer">
                <div className={`h-32 rounded-2xl bg-gradient-to-r ${w.grad} p-4 flex items-center justify-between text-white relative overflow-hidden`}>
                  <div>
                    <span className="text-xs font-extrabold bg-white/25 px-2.5 py-1 rounded-full">{i + 1}</span>
                    <h3 className="text-2xl font-black font-fredoka leading-tight mt-1 drop-shadow">{t('w_' + w.id)}</h3>
                  </div>
                  <span className="text-6xl group-hover:scale-125 group-hover:rotate-6 transition-transform">{w.icon}</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-extrabold text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{t('level')} {'⭐'.repeat(levelFor(kid.attempts, w.id))}</span>
                  <span className="bg-yellow-400 text-amber-950 font-black px-4 py-2 rounded-xl border-b-2 border-amber-600">{t('play')} ▶</span>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2">{n} {t('tries').toLowerCase()}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
