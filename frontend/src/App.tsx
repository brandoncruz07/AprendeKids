import { useEffect, useRef, useState } from 'react'
import { LangProvider, useI18n } from './i18n'
import { Acct, Attempt, Kid } from './store'
import { CHARACTERS, ShopItem } from './data/gameData'
import { AuthScreen } from './components/AuthScreen'
import { ProfilePicker } from './components/ProfilePicker'
import { Companion } from './components/Companion'
import { TopBar, Tab } from './components/TopBar'
import { MapView } from './components/MapView'
import { Quiz } from './components/Quiz'
import { ShopView } from './components/ShopView'
import { ProgressView } from './components/ProgressView'
import { AchievementsView } from './components/AchievementsView'
import { SettingsView } from './components/SettingsView'
import { WorldId } from './data/levelData'
import { apiRequest, ApiError } from './api'

export default function App() {
  return <LangProvider><Root /></LangProvider>
}

function Root() {
  const { t } = useI18n()
  const [acct, setAcct] = useState<Acct | null>(null)
  const [loading, setLoading] = useState(true)
  const [kidId, setKidId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('map')
  const [world, setWorld] = useState<WorldId | null>(null)
  const [level, setLevel] = useState<number | null>(null)
  const [syncError, setSyncError] = useState<'backend' | 'save' | ''>('')
  const acctRef = useRef<Acct | null>(null)
  const syncQueue = useRef<Promise<void>>(Promise.resolve())
  const syncRevision = useRef(0)

  useEffect(() => {
    let active = true
    apiRequest<{ account: Acct }>('/api/auth/me')
      .then(({ account }) => {
        if (active) {
          acctRef.current = account
          setAcct(account)
        }
      })
      .catch((error: unknown) => {
        if (!active) return
        if (!(error instanceof ApiError && error.status === 401)) {
          setSyncError('backend')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const acceptAccount = (account: Acct | null) => {
    syncRevision.current += 1
    acctRef.current = account
    setAcct(account)
    setKidId(null)
    setSyncError('')
  }

  const enqueueAccountUpdate = (request: () => Promise<Acct>) => {
    const revision = ++syncRevision.current
    const task = syncQueue.current.catch(() => undefined).then(request)
    syncQueue.current = task.then(() => undefined, () => undefined)
    return task.then((account) => {
      if (revision === syncRevision.current) {
        acctRef.current = account
        setAcct(account)
        setSyncError('')
      }
    }).catch((error: unknown) => {
      setSyncError('save')
      throw error
    })
  }

  const updateKid = (profileId: string, update: (profile: Kid) => Kid) => {
    const current = acctRef.current
    const profile = current?.kids.find((item) => item.id === profileId)
    if (!current || !profile) return Promise.resolve()
    const updatedProfile = update(profile)
    const updatedAccount = {
      ...current,
      kids: current.kids.map((item) => item.id === profileId ? updatedProfile : item)
    }
    acctRef.current = updatedAccount
    setAcct(updatedAccount)
    return enqueueAccountUpdate(async () => {
      const result = await apiRequest<{ account: Acct }>(`/api/kids/${encodeURIComponent(profileId)}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedProfile)
      })
      return result.account
    })
  }

  const updateAI = (profileId: string, enabled: boolean) => enqueueAccountUpdate(async () => {
    const result = await apiRequest<{ account: Acct }>(`/api/kids/${encodeURIComponent(profileId)}/ai`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled })
    })
    return result.account
  })

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 font-bold text-slate-600">{t('settings_checking')}</div>
  }

  if (!acct) {
    return (
      <>
        {syncError && <p role="alert" className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-800">{syncError === 'backend' ? t('e_backend') : t('settings_save_error')}</p>}
        <AuthScreen onAuth={acceptAccount} />
      </>
    )
  }

  const kid = acct.kids.find((profile) => profile.id === kidId)
  const syncErrorMessage = syncError === 'backend' ? t('e_backend') : t('settings_save_error')
  if (!kid) {
    return (
      <>
        {syncError && <p role="alert" className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-800">{syncErrorMessage}</p>}
        <ProfilePicker
          acct={acct}
          onPick={(profile) => {
            setKidId(profile.id)
            setTab('map')
            setWorld(null)
            setLevel(null)
          }}
          onAdd={(profile) => {
            void enqueueAccountUpdate(async () => {
              const result = await apiRequest<{ account: Acct }>('/api/kids', {
                method: 'POST',
                body: JSON.stringify(profile)
              })
              return result.account
            })
          }}
          onOut={async () => {
            try {
              await syncQueue.current
              await apiRequest('/api/auth/logout', { method: 'POST' })
              acceptAccount(null)
            } catch {
              setSyncError('save')
            }
          }}
        />
      </>
    )
  }

  const character = CHARACTERS.find((item) => item.id === kid.char) ?? CHARACTERS[0]
  const buy = (item: ShopItem) => {
    const alreadyOwned = item.kind === 'acc'
      ? kid.acc.includes(item.id)
      : kid.bgs.includes(item.id)
    if (kid.coins < item.price || alreadyOwned) return

    void updateKid(kid.id, (profile) => ({
      ...profile,
      coins: profile.coins - item.price,
      acc: item.kind === 'acc' ? [...profile.acc, item.id] : profile.acc,
      bgs: item.kind === 'bg' ? [...profile.bgs, item.id] : profile.bgs
    }))
  }
  const equip = (item: ShopItem) => void updateKid(kid.id, (profile) => item.kind === 'acc'
    ? { ...profile, eqAcc: profile.eqAcc === item.id ? '' : item.id }
    : { ...profile, bg: profile.bg === item.id ? '' : item.id })

  return (
    <Companion
      key={kid.id}
      kid={kid}
      char={character}
      worldId={world}
      levelNumber={level}
      onVoiceEnabledChange={(enabled) => void updateKid(kid.id, (profile) => ({ ...profile, voiceEnabled: enabled }))}
    >
      <div className="min-h-screen bg-slate-100">
        {syncError && <p role="alert" className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-xl bg-rose-100 px-4 py-2 font-bold text-rose-800">{syncErrorMessage}</p>}
        <TopBar
          kid={kid}
          char={character}
          tab={tab}
          onTab={(nextTab) => {
            setTab(nextTab)
            setWorld(null)
            setLevel(null)
          }}
          onSwitch={() => setKidId(null)}
        />
        {world ? (
          <Quiz
            key={`${world}-${level}`}
            world={world}
            level={level ?? 1}
            kid={kid}
            onBack={() => {
              setWorld(null)
              setLevel(null)
            }}
            onAttempt={(attempt: Attempt) => void updateKid(kid.id, (profile) => ({
              ...profile,
              attempts: [...profile.attempts, attempt]
            }))}
            onFinish={(earnedStars, earnedCoins) => void updateKid(kid.id, (profile) => {
              const levelId = `${world}-${level ?? 1}`
              const completedLevels = profile.completedLevels ?? []
              if (completedLevels.includes(levelId)) return profile
              return {
                ...profile,
                stars: profile.stars + earnedStars,
                coins: profile.coins + earnedCoins,
                completedLevels: [...completedLevels, levelId]
              }
            })}
          />
        ) : tab === 'map' ? (
          <MapView
            kid={kid}
            onPick={(nextWorld, nextLevel) => {
              setWorld(nextWorld)
              setLevel(nextLevel)
            }}
          />
        ) : tab === 'shop' ? (
          <ShopView kid={kid} onBuy={buy} onEquip={equip} />
        ) : tab === 'prog' ? (
          <ProgressView kid={kid} />
        ) : tab === 'ach' ? (
          <AchievementsView kid={kid} />
        ) : (
          <SettingsView
            kid={kid}
            onUpdate={(changes) => updateKid(kid.id, (profile) => ({ ...profile, ...changes }))}
            onAiToggle={(enabled) => updateAI(kid.id, enabled)}
          />
        )}
      </div>
    </Companion>
  )
}
