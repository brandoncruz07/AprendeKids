import { FormEvent, useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useI18n, LangSwitch } from '../i18n'
import { Acct, hashPw, uid } from '../store'
import { CHARACTERS } from '../data/gameData'

export function AuthScreen({ db, onAuth }: { db: Acct[]; onAuth: (a: Acct, isNew: boolean) => void }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'reg'>(db.length ? 'login' : 'reg')
  const [f, setF] = useState({ name: '', email: '', pw: '' })
  const [err, setErr] = useState('')
  const reg = mode === 'reg'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (!email.includes('@') || f.pw.length < 4 || (reg && !f.name.trim())) return setErr(t('e_fill'))
    const found = db.find((a) => a.email === email)
    if (reg) {
      if (found) return setErr(t('e_exist'))
      const salt = uid()
      onAuth({ id: uid(), name: f.name.trim(), email, salt, hash: await hashPw(f.pw, salt), kids: [] }, true)
    } else {
      if (!found || (await hashPw(f.pw, found.salt)) !== found.hash) return setErr(t('e_cred'))
      onAuth(found, false)
    }
  }
  const inp = 'w-full px-4 py-3 rounded-2xl bg-slate-100 border-2 border-slate-200 focus:border-purple-400 outline-none font-bold text-slate-800'

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-indigo-200 to-purple-300 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10"><LangSwitch /></div>
      {['☁️', '🌈', '⭐', '🎈'].map((e, i) => (
        <span key={e} className="absolute text-5xl opacity-80 animate-float pointer-events-none" style={{ top: `${10 + i * 20}%`, left: i % 2 ? '85%' : '6%', animationDelay: `${i * 0.7}s` }}>{e}</span>
      ))}
      <div className="relative z-10 text-center mb-4">
        <div className="flex justify-center gap-2 text-5xl mb-2">
          {CHARACTERS.map((c, i) => <span key={c.id} className="animate-bounce-gentle" style={{ animationDelay: `${i * 0.2}s` }}>{c.emoji}</span>)}
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white font-fredoka drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]">{t('app')}</h1>
        <p className="text-white font-bold text-lg drop-shadow mt-1">{t('tag')}</p>
      </div>
      <form onSubmit={submit} className="relative z-10 w-full max-w-sm bg-white/95 rounded-3xl p-6 border-4 border-yellow-300 shadow-2xl space-y-3">
        {reg && <input className={inp} placeholder={t('pname')} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        <input className={inp} type="email" placeholder={t('email')} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className={inp} type="password" placeholder={t('pass')} value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} />
        {err && <p className="text-rose-600 font-bold text-sm text-center">{err}</p>}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl border-b-4 border-teal-700 active:translate-y-1 cursor-pointer">
          {reg ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />} {t(reg ? 'reg' : 'login')}
        </button>
        <button type="button" onClick={() => { setMode(reg ? 'login' : 'reg'); setErr('') }} className="w-full text-purple-700 font-extrabold text-sm cursor-pointer">
          {t(reg ? 'to_login' : 'to_reg')}
        </button>
      </form>
    </div>
  )
}
