import { FormEvent, useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { useI18n, LangSwitch } from '../i18n'
import { Acct, loadDb } from '../store'
import { apiRequest, ApiError } from '../api'
import { CHARACTERS } from '../data/gameData'
import { CharacterAvatar } from './CharacterAvatar'

type AuthResponse = { account: Acct }

export function AuthScreen({ onAuth }: { onAuth: (account: Acct) => void }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'reg'>(() => loadDb().length ? 'login' : 'reg')
  const [f, setF] = useState({ name: '', email: '', pw: '' })
  const [guardianConsent, setGuardianConsent] = useState(false)
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const reg = mode === 'reg'

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (!email.includes('@') || f.pw.length < 12 || (reg && (!f.name.trim() || !guardianConsent))) {
      setErr(t(f.pw.length < 12 ? 'e_password' : reg && !guardianConsent ? 'guardian_consent_error' : 'e_fill'))
      return
    }

    const localAccount = loadDb().find((account) => account.email.toLowerCase() === email)
    setSubmitting(true)
    setErr('')
    try {
      const path = reg ? '/api/auth/register' : '/api/auth/login'
      const result = await apiRequest<AuthResponse>(path, {
        method: 'POST',
        body: JSON.stringify(reg ? {
          name: f.name.trim(),
          email,
          password: f.pw,
          guardianConsent: true,
          legacyKids: localAccount?.kids ?? []
        } : {
          email,
          password: f.pw,
          importLegacy: Boolean(localAccount?.kids.length),
          legacyKids: localAccount?.kids ?? []
        })
      })
      onAuth(result.account)
    } catch (error) {
      if (error instanceof ApiError) {
        const messages: Record<string, string> = {
          INVALID_CREDENTIALS: t('e_cred'),
          ACCOUNT_EXISTS: t('e_exist'),
          GUARDIAN_CONSENT_REQUIRED: t('guardian_consent_error'),
          INVALID_LEGACY_DATA: t('e_import'),
          DATABASE_UNAVAILABLE: t('e_backend'),
          RATE_LIMITED: t('e_rate')
        }
        setErr(messages[error.code] ?? t('e_backend'))
      } else {
        setErr(t('e_backend'))
      }
    } finally {
      setSubmitting(false)
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
        <div className="mb-2 flex flex-wrap justify-center gap-1">
          {CHARACTERS.map((character) => (
            <CharacterAvatar key={character.id} character={character} className="h-12 w-12 animate-bounce-gentle sm:h-16 sm:w-16" />
          ))}
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white font-fredoka drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]">{t('app')}</h1>
        <p className="text-white font-bold text-lg drop-shadow mt-1">{t('tag')}</p>
      </div>
      <form onSubmit={submit} className="relative z-10 w-full max-w-sm bg-white/95 rounded-3xl p-6 border-4 border-yellow-300 shadow-2xl space-y-3">
        {reg && <input className={inp} placeholder={t('pname')} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" required />}
        <input className={inp} type="email" placeholder={t('email')} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" required />
        <input className={inp} type="password" placeholder={t('pass')} value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} autoComplete={reg ? 'new-password' : 'current-password'} required />
        {reg && (
          <label className="flex items-start gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={guardianConsent} onChange={(event) => setGuardianConsent(event.target.checked)} className="mt-1 accent-purple-600" />
            <span>{t('guardian_consent')}</span>
          </label>
        )}
        {err && <p role="alert" className="text-rose-600 font-bold text-sm text-center">{err}</p>}
        <button disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xl border-b-4 border-teal-700 active:translate-y-1 cursor-pointer disabled:opacity-60">
          {reg ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />} {t(reg ? 'reg' : 'login')}
        </button>
        <button type="button" onClick={() => { setMode(reg ? 'login' : 'reg'); setErr('') }} className="w-full text-purple-700 font-extrabold text-sm cursor-pointer">
          {t(reg ? 'to_login' : 'to_reg')}
        </button>
      </form>
    </div>
  )
}
