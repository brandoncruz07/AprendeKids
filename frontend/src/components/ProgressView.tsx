import { ArrowLeft, Download } from 'lucide-react'
import { useI18n } from '../i18n'
import { Attempt, Kid } from '../store'
import { CHARACTERS } from '../data/gameData'
import { WORLDS } from './MapView'
import { CharacterAvatar } from './CharacterAvatar'

const pct = (x: Attempt[]) => (x.length ? Math.round((100 * x.filter((v) => v.ok).length) / x.length) : 0)

export function ProgressView({ kid, onBack }: { kid: Kid; onBack?: () => void }) {
  const { t } = useI18n()
  const a = kid.attempts

  // Curva: % de aciertos con promedio móvil de 5 intentos (últimos 60)
  const last = a.slice(-60)
  const pts = last.map((_, i) => pct(last.slice(Math.max(0, i - 4), i + 1)))
  const half = Math.floor(a.length / 2)
  const diff = a.length >= 10 ? pct(a.slice(half)) - pct(a.slice(0, half)) : 0
  const trend = diff > 5 ? 'up' : diff < -5 ? 'down' : 'flat'

  const days = new Set(a.map((x) => new Date(x.t).toDateString()))
  let streak = 0
  const d = new Date()
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1)
  while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1) }
  const mins = Math.round(a.reduce((s, x) => s + Math.min(x.ms, 60000), 0) / 60000)

  const byW = WORLDS.map((w) => ({ w, n: a.filter((x) => x.w === w.id).length, p: pct(a.filter((x) => x.w === w.id)) }))
  const weak = byW.filter((x) => x.n >= 3).sort((x, y) => x.p - y.p)[0]

  const X = (i: number) => 20 + (i * 360) / Math.max(pts.length - 1, 1)
  const Y = (p: number) => 140 - p * 1.2
  const line = pts.map((p, i) => `${X(i)},${Y(p)}`).join(' ')

  const csv = () => {
    const rows = ['date,world,level,correct_first_try,seconds', ...a.map((x) => [new Date(x.t).toISOString(), x.w, x.l, x.ok ? 1 : 0, Math.round(x.ms / 1000)].join(','))]
    const l = document.createElement('a')
    l.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    l.download = `${kid.name}-progress.csv`
    l.click()
  }
  const stat = (v: string | number, k: string, c: string) => (
    <div className={`rounded-2xl p-3 text-center border-2 ${c}`}><p className="text-3xl font-black font-fredoka">{v}</p><p className="text-xs font-extrabold">{k}</p></div>
  )

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-purple-50 via-indigo-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          {onBack ? <button onClick={onBack} className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl font-extrabold border-2 border-slate-300 cursor-pointer"><ArrowLeft className="w-4 h-4" />{t('back')}</button> : <span />}
          <button onClick={csv} className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl font-extrabold border-2 border-slate-300 cursor-pointer"><Download className="w-4 h-4" />{t('csv')}</button>
        </div>
        <h1 className="flex items-center gap-2 text-3xl font-black font-fredoka text-purple-950">
          <CharacterAvatar character={CHARACTERS.find((item) => item.id === kid.char) ?? CHARACTERS[0]} className="h-12 w-12" />
          {kid.name} · {t('prog')}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stat(a.length, t('tries'), 'bg-sky-100 border-sky-300 text-sky-900')}
          {stat(`${pct(a)}%`, t('acc'), 'bg-emerald-100 border-emerald-300 text-emerald-900')}
          {stat(`🔥 ${streak}`, t('streak'), 'bg-orange-100 border-orange-300 text-orange-900')}
          {stat(mins, t('mins'), 'bg-pink-100 border-pink-300 text-pink-900')}
        </div>

        <div className="bg-white rounded-3xl p-5 border-4 border-purple-300 shadow-xl">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-black font-fredoka text-purple-950">📈 {t('curve')}</h2>
            {a.length >= 10 && <span className="font-extrabold text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{t(trend)}</span>}
          </div>
          <p className="text-xs font-bold text-slate-500 mb-2">{t('curve_h')}</p>
          {pts.length < 2 ? (
            <p className="text-center font-bold text-slate-500 py-10">{t('nodata')}</p>
          ) : (
            <svg viewBox="0 0 400 160" className="w-full">
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a855f7" stopOpacity=".35" /><stop offset="1" stopColor="#a855f7" stopOpacity="0" /></linearGradient></defs>
              {[0, 50, 100].map((p) => (<g key={p}><line x1="20" x2="380" y1={Y(p)} y2={Y(p)} stroke="#e2e8f0" /><text x="0" y={Y(p) + 4} fontSize="10" fill="#64748b">{p}</text></g>))}
              <polygon points={`${X(0)},140 ${line} ${X(pts.length - 1)},140`} fill="url(#g)" />
              <polyline points={line} fill="none" stroke="#7e22ce" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p, i) => i === pts.length - 1 && <circle key={i} cx={X(i)} cy={Y(p)} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />)}
            </svg>
          )}
        </div>

        <div className="bg-white rounded-3xl p-5 border-4 border-purple-300 shadow-xl space-y-3">
          <h2 className="text-xl font-black font-fredoka text-purple-950">{t('byw')}</h2>
          {byW.map(({ w, n, p }) => (
            <div key={w.id} className="flex items-center gap-3">
              <span className="text-3xl w-10">{w.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-extrabold text-slate-600"><span>{t('w_' + w.id)}</span><span>{n ? `${p}% · ${n}` : '—'}</span></div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${w.grad} transition-all duration-700`} style={{ width: `${p}%` }} /></div>
              </div>
            </div>
          ))}
          {weak && weak.p < 70 && <p className="font-extrabold text-amber-800 bg-amber-100 rounded-xl px-3 py-2">💡 {t('reinf')} {weak.w.icon} {t('w_' + weak.w.id)}</p>}
        </div>
      </div>
    </div>
  )
}
