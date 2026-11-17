import { Coins, Map as MapIcon, Settings2, ShoppingBag, Star, TrendingUp, Trophy } from 'lucide-react'
import { useI18n, LangSwitch } from '../i18n'
import { Character } from '../data/gameData'
import { Kid } from '../store'
import { CharacterAvatar } from './CharacterAvatar'

export type Tab = 'map' | 'shop' | 'prog' | 'ach' | 'settings'
const TABS = [
  ['map', MapIcon, 'bg-emerald-500'],
  ['shop', ShoppingBag, 'bg-amber-500'],
  ['prog', TrendingUp, 'bg-sky-500'],
  ['ach', Trophy, 'bg-purple-500'],
  ['settings', Settings2, 'bg-slate-600']
] as const

export function TopBar({ kid, char, tab, onTab, onSwitch }: {
  kid: Kid
  char: Character
  tab: Tab
  onTab: (tab: Tab) => void
  onSwitch: () => void
}) {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 border-b-4 border-yellow-300 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSwitch}
          aria-label={`Cambiar acompañante de ${kid.name}`}
          className="flex items-center gap-2 rounded-2xl border-2 border-yellow-400 bg-yellow-100 px-3 py-1.5 font-black text-amber-950"
        >
          <CharacterAvatar character={char} className="h-9 w-9 animate-bounce-gentle" />{kid.name}
        </button>
        <nav className="flex gap-1.5" aria-label="Navegación principal">
          {TABS.map(([id, Icon, color]) => (
            <button
              key={id}
              type="button"
              onClick={() => onTab(id)}
              aria-label={t(id)}
              title={t(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`flex cursor-pointer items-center gap-1.5 rounded-2xl border-2 px-2 py-2 text-xs font-black transition sm:px-3 sm:text-sm ${
                tab === id ? `${color} scale-105 border-white text-white shadow-md` : 'border-slate-300 bg-slate-100 text-slate-700'
              }`}
            >
              <Icon className="h-5 w-5" /><span className="hidden sm:inline">{t(id)}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-2xl border-2 border-amber-300 bg-amber-100 px-2 py-1 font-fredoka font-black sm:px-3">
            <Star className="h-5 w-5 fill-amber-400 text-amber-500" />{kid.stars}
          </span>
          <span className="flex items-center gap-1 rounded-2xl border-2 border-yellow-300 bg-yellow-100 px-2 py-1 font-fredoka font-black sm:px-3">
            <Coins className="h-5 w-5 fill-yellow-400 text-yellow-600" />{kid.coins}
          </span>
          <LangSwitch />
        </div>
      </div>
    </header>
  )
}
