import { FormEvent, useEffect, useState } from 'react'
import { Kid } from '../store'
import { useI18n, LangSwitch } from '../i18n'
import { apiRequest, ApiError } from '../api'

type SettingsStatus = 'checking' | 'ready' | 'setup' | 'offline'
type SettingsChanges = Partial<Pick<Kid, 'aiEnabled' | 'voiceEnabled' | 'speechRate'>>

export function SettingsView({ kid, onUpdate, onAiToggle }: {
  kid: Kid
  onUpdate: (changes: SettingsChanges) => Promise<void>
  onAiToggle: (enabled: boolean) => Promise<void>
}) {
  const { t } = useI18n()
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [actionError, setActionError] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<SettingsStatus>('checking')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/health', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Settings health check failed')
        return response.json() as Promise<{ aiAvailable?: unknown; dbAvailable?: unknown }>
      })
      .then((result) => setStatus(result.dbAvailable === false ? 'offline' : result.aiAvailable === true ? 'ready' : 'setup'))
      .catch(() => {
        if (!controller.signal.aborted) setStatus('offline')
      })
    return () => controller.abort()
  }, [])

  const unlock = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await apiRequest('/api/auth/reauth', { method: 'POST', body: JSON.stringify({ password }) })
      setUnlocked(true)
      setPassword('')
      setAuthError(false)
    } catch {
      setAuthError(true)
    } finally {
      setSaving(false)
    }
  }

  const updateAI = async (enabled: boolean) => {
    setSaving(true)
    setActionError('')
    try {
      await onAiToggle(enabled)
    } catch (error) {
      setActionError(error instanceof ApiError && error.code === 'REAUTH_REQUIRED'
        ? t('settings_reauth')
        : t('settings_save_error'))
    } finally {
      setSaving(false)
    }
  }

  const updatePreference = (changes: SettingsChanges) => {
    setActionError('')
    void onUpdate(changes).catch(() => setActionError(t('settings_save_error')))
  }

  const rate = kid.speechRate ?? 1
  const aiReady = status === 'ready'

  return (
    <main className="mx-auto max-w-3xl space-y-5 p-4 sm:p-8">
      <header>
        <h1 className="text-3xl font-black text-slate-800">{t('settings_title')}</h1>
        <p className="mt-1 font-medium text-slate-600">{t('settings_parent')}</p>
      </header>

      {!unlocked && (
        <form onSubmit={unlock} className="space-y-3 rounded-3xl border-2 border-purple-200 bg-white p-5 shadow">
          <label htmlFor="parent-settings-password" className="block font-bold text-slate-700">{t('settings_password')}</label>
          <div className="flex flex-wrap gap-2">
            <input
              id="parent-settings-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setAuthError(false)
              }}
              className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2 font-semibold"
            />
            <button type="submit" disabled={!password || saving} className="rounded-xl bg-purple-600 px-4 py-2 font-bold text-white disabled:opacity-50">
              {t('settings_unlock')}
            </button>
          </div>
          {authError && <p role="alert" className="font-semibold text-rose-700">{t('settings_auth_error')}</p>}
        </form>
      )}

      <section className={`space-y-4 rounded-3xl border-2 border-emerald-200 bg-white p-5 shadow ${!unlocked ? 'opacity-60' : ''}`}>
        <div>
          <h2 className="text-xl font-black text-slate-800">{t('settings_ai')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('settings_ai_desc')}</p>
        </div>
        <p role="status" className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700">
          {t(status === 'ready' ? 'settings_ai_ready' : status === 'offline' ? 'settings_api_offline' : status === 'checking' ? 'settings_checking' : 'settings_ai_setup')}
        </p>
        <label className="flex items-center justify-between gap-4 font-bold text-slate-800">
          <span>{t('settings_ai_toggle')}</span>
          <input
            type="checkbox"
            role="switch"
            checked={kid.aiEnabled === true}
            disabled={!unlocked || (!kid.aiEnabled && !aiReady) || saving}
            onChange={(event) => void updateAI(event.target.checked)}
            className="h-6 w-6 accent-emerald-600"
          />
        </label>
        {actionError && <p role="alert" className="font-semibold text-rose-700">{actionError}</p>}
        <p className="text-xs leading-relaxed text-slate-500">{t('settings_ai_privacy')}</p>
      </section>

      <section className={`space-y-4 rounded-3xl border-2 border-amber-200 bg-white p-5 shadow ${!unlocked ? 'opacity-60' : ''}`}>
        <div>
          <h2 className="text-xl font-black text-slate-800">{t('settings_voice')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('settings_voice_desc')}</p>
        </div>
        <label className="flex items-center justify-between gap-4 font-bold text-slate-800">
          <span>{t('settings_voice_enabled')}</span>
          <input
            type="checkbox"
            role="switch"
            checked={kid.voiceEnabled !== false}
            disabled={!unlocked}
            onChange={(event) => updatePreference({ voiceEnabled: event.target.checked })}
            className="h-6 w-6 accent-amber-500"
          />
        </label>
        <label className="block font-bold text-slate-800">
          <span className="flex items-center justify-between gap-2">
            <span>{t('settings_voice_speed')}</span>
            <output className="rounded-lg bg-amber-100 px-2 py-1 text-sm">{rate.toFixed(1)}×</output>
          </span>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.1"
            value={rate}
            disabled={!unlocked || kid.voiceEnabled === false}
            onChange={(event) => updatePreference({ speechRate: Number(event.target.value) })}
            className="mt-3 w-full accent-amber-500 disabled:opacity-50"
          />
        </label>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-sky-200 bg-white p-5 shadow">
        <div>
          <h2 className="text-xl font-black text-slate-800">{t('settings_language')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('settings_language_desc')}</p>
        </div>
        <LangSwitch />
      </section>

      <p className="rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-slate-600">
        {t('settings_age_auto', { age: String(kid.age) })}
      </p>
    </main>
  )
}
