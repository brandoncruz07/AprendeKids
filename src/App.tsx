import { useEffect, useState } from 'react'
import { LangProvider } from './i18n'
import { Acct, Kid, Attempt, loadDb, saveDb, getSess, setSess } from './store'
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

export default function App() {
  return <LangProvider><Root /></LangProvider>
}

function Root() {
  const [db, setDb] = useState<Acct[]>(loadDb)
  const [sid, setSid] = useState<string | null>(getSess)
  const [kidId, setKidId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('map')
  const [world, setWorld] = useState<string | null>(null)
  useEffect(() => saveDb(db), [db])

  const acct = db.find((a) => a.id === sid)
  const kid = acct?.kids.find((k) => k.id === kidId)
  const upAcct = (fn: (a: Acct) => Acct) => setDb((d) => d.map((a) => (a.id === sid ? fn(a) : a)))
  const upKid = (fn: (k: Kid) => Kid) => upAcct((a) => ({ ...a, kids: a.kids.map((k) => (k.id === kidId ? fn(k) : k)) }))

  if (!acct) {
    return <AuthScreen db={db} onAuth={(a, isNew) => { if (isNew) setDb((d) => [...d, a]); setSess(a.id); setSid(a.id) }} />
  }
  if (!kid) {
    return <ProfilePicker acct={acct} onPick={(k) => { setKidId(k.id); setTab('map'); setWorld(null) }}
      onAdd={(k) => upAcct((a) => ({ ...a, kids: [...a.kids, k] }))} onOut={() => { setSess(null); setSid(null) }} />
  }

  const char = CHARACTERS.find((c) => c.id === kid.char)!
  const buy = (it: ShopItem) => kid.coins >= it.price && upKid((k) => ({
    ...k, coins: k.coins - it.price,
    acc: it.kind === 'acc' ? [...k.acc, it.id] : k.acc, bgs: it.kind === 'bg' ? [...k.bgs, it.id] : k.bgs,
  }))
  const equip = (it: ShopItem) => upKid((k) => it.kind === 'acc' ? { ...k, eqAcc: k.eqAcc === it.id ? '' : it.id } : { ...k, bg: k.bg === it.id ? '' : it.id })

  return (
    <Companion key={kid.id} kid={kid} char={char}>
      <div className="min-h-screen bg-slate-100">
        <TopBar kid={kid} char={char} tab={tab} onTab={(t) => { setTab(t); setWorld(null) }} onSwitch={() => setKidId(null)} />
        {world ? (
          <Quiz key={world} world={world} kid={kid} onBack={() => setWorld(null)}
            onAttempt={(a: Attempt) => upKid((k) => ({ ...k, attempts: [...k.attempts, a] }))}
            onFinish={(stars, coins) => upKid((k) => ({ ...k, stars: k.stars + stars, coins: k.coins + coins }))} />
        ) : tab === 'map' ? <MapView kid={kid} onPick={setWorld} />
          : tab === 'shop' ? <ShopView kid={kid} onBuy={buy} onEquip={equip} />
          : tab === 'prog' ? <ProgressView kid={kid} />
          : <AchievementsView kid={kid} />}
      </div>
    </Companion>
  )
}
