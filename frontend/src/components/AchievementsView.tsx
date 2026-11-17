import { useI18n } from '../i18n'
import { Attempt, Kid } from '../store'

const good = (a: Attempt[], w: string) => a.filter((x) => x.ok && x.w === w).length
const bestRun = (a: Attempt[]) => { let b = 0, m = 0; for (const x of a) { b = x.ok ? b + 1 : 0; m = Math.max(m, b) } return m }
// Los logros se calculan a partir de los intentos reales del niño
const ACH: { id: string; icon: string; max: number; f: (a: Attempt[]) => number; c: string }[] = [
  { id: 'a_first', icon: '🌟', max: 1, f: (a) => a.length, c: 'from-yellow-400 to-amber-500' },
  { id: 'a_let', icon: '🔤', max: 10, f: (a) => good(a, 'letters'), c: 'from-purple-400 to-indigo-500' },
  { id: 'a_num', icon: '🔢', max: 10, f: (a) => good(a, 'numbers'), c: 'from-emerald-400 to-teal-500' },
  { id: 'a_rd', icon: '📚', max: 10, f: (a) => good(a, 'reading'), c: 'from-pink-400 to-rose-500' },
  { id: 'a_exp', icon: '🗺️', max: 5, f: (a) => new Set(a.map((x) => x.w)).size, c: 'from-cyan-400 to-blue-500' },
  { id: 'a_str', icon: '🔥', max: 5, f: bestRun, c: 'from-orange-400 to-red-500' },
]

export function AchievementsView({ kid }: { kid: Kid }) {
  const { t } = useI18n()
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-purple-50 via-indigo-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 pb-32">
        {ACH.map((a) => {
          const v = Math.min(a.f(kid.attempts), a.max)
          const done = v >= a.max
          return (
            <div key={a.id} className={`bg-white rounded-3xl p-4 border-4 shadow-lg flex items-center gap-4 ${done ? 'border-yellow-400' : 'border-slate-200'}`}>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${a.c} flex items-center justify-center text-5xl shrink-0 ${done ? 'animate-bounce-gentle' : 'grayscale opacity-60'}`}>{a.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-black font-fredoka text-slate-800">{t(a.id)} {done && '🏅'}</h3>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mt-2"><div className={`h-full bg-gradient-to-r ${a.c} transition-all duration-700`} style={{ width: `${(v / a.max) * 100}%` }} /></div>
                <p className="text-right text-xs font-extrabold text-slate-500 mt-1">{v} / {a.max}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
