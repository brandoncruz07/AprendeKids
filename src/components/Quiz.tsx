import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n'
import { Attempt, Kid, levelFor } from '../store'
import { genQ } from '../content'
import { useCompanion } from './Companion'
import { WORLDS } from './MapView'

const ROUNDS = 5

export function Quiz({ world, kid, onAttempt, onFinish, onBack }: {
  world: string; kid: Kid; onAttempt: (a: Attempt) => void; onFinish: (stars: number, coins: number) => void; onBack: () => void
}) {
  const { t, lang } = useI18n()
  const bot = useCompanion()
  const w = WORLDS.find((x) => x.id === world)!
  const [lvl] = useState(() => levelFor(kid.attempts, world))
  const [qs] = useState(() => Array.from({ length: ROUNDS }, () => genQ(world, lang, lvl, t)))
  const [i, setI] = useState(0)
  const [bad, setBad] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [t0, setT0] = useState(Date.now())
  const [end, setEnd] = useState<{ stars: number; coins: number } | null>(null)
  const q = qs[Math.min(i, ROUNDS - 1)]

  useEffect(() => { bot.say(q.p) }, [i]) // la mascota lee cada pregunta en voz alta // eslint-disable-line

  const pick = (idx: number) => {
    if (end || bad.includes(idx)) return
    if (idx !== q.a) { setBad([...bad, idx]); return bot.no() }
    const first = bad.length === 0 // acierto a la primera = lo que mide la curva de aprendizaje
    onAttempt({ t: Date.now(), w: world, ok: first, ms: Date.now() - t0, l: lvl })
    const total = score + (first ? 1 : 0)
    setScore(total)
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
    if (i + 1 < ROUNDS) {
      bot.ok()
      setTimeout(() => { setI(i + 1); setBad([]); setT0(Date.now()) }, 1300)
    } else {
      const r = { stars: Math.max(1, total), coins: total * 4 + 2 }
      setTimeout(() => { setEnd(r); onFinish(r.stars, r.coins); bot.win(); confetti({ particleCount: 150, spread: 100 }) }, 900)
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto pb-32">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl font-extrabold border-2 border-slate-300 cursor-pointer"><ArrowLeft className="w-4 h-4" />{t('back')}</button>
          <span className="font-extrabold bg-white px-3 py-1.5 rounded-2xl border-2 border-slate-200">{t('level')} {'⭐'.repeat(lvl)}</span>
        </div>
        <div className="flex gap-1.5 mb-4">{qs.map((_, k) => <div key={k} className={`h-3 flex-1 rounded-full ${k < i || end ? 'bg-emerald-400' : k === i ? 'bg-yellow-400' : 'bg-slate-200'}`} />)}</div>

        <div className={`bg-white rounded-3xl p-6 border-4 shadow-xl text-center`} style={{ borderColor: 'transparent', backgroundClip: 'padding-box', outline: '4px solid #fcd34d' }}>
          <span className={`inline-block text-white text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${w.grad}`}>{w.icon} {t('w_' + world)}</span>
          <h2 className="text-2xl sm:text-3xl font-black font-fredoka text-slate-800 mt-3">{q.p}</h2>
          <div key={i} className="animate-pop text-6xl sm:text-7xl my-6 tracking-wide font-fredoka font-black text-slate-800 break-words">{q.e}</div>
          <div className={`grid gap-3 ${q.o.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            {q.o.map((o, k) => (
              <button key={k} onClick={() => pick(k)}
                className={`py-5 rounded-2xl font-black font-fredoka text-3xl sm:text-4xl border-b-4 transition active:translate-y-1 cursor-pointer ${
                  bad.includes(k) ? 'bg-rose-200 text-rose-400 border-rose-300 animate-shake' : `bg-gradient-to-b ${w.grad} text-white border-black/20 hover:brightness-110`}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {end && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="animate-pop bg-white rounded-3xl p-8 border-4 border-yellow-400 shadow-2xl max-w-sm w-full text-center">
            <div className="text-6xl">🎉🏆🎉</div>
            <h2 className="text-3xl font-black font-fredoka text-slate-800 mt-2">{t('done')}</h2>
            <div className="flex justify-center gap-3 my-5 text-2xl font-black font-fredoka">
              <span className="bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-2xl">+{end.stars} ⭐</span>
              <span className="bg-yellow-100 border-2 border-yellow-300 px-4 py-2 rounded-2xl">+{end.coins} 🪙</span>
            </div>
            <button onClick={onBack} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl border-b-4 border-teal-700 cursor-pointer">{t('cont')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
