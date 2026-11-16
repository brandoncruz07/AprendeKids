import { Map as MapIcon, ShoppingBag, TrendingUp, Trophy, Star, Coins } from 'lucide-react'
import { useI18n, LangSwitch } from '../i18n'
import { Character } from '../data/gameData'
import { Kid } from '../store'

export type Tab = 'map' | 'shop' | 'prog' | 'ach'
const TABS = [['map', MapIcon, 'bg-emerald-500'], ['shop', ShoppingBag, 'bg-amber-500'], ['prog', TrendingUp, 'bg-sky-500'], ['ach', Trophy, 'bg-purple-500']] as const

export function TopBar({ kid, char, tab, onTab, onSwitch }: { kid: Kid; char: Character; tab: Tab; onTab: (t: Tab) => void; onSwitch: () => void }) {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-yellow-300 shadow-md px-3 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <button onClick={onSwitch} className="flex items-center gap-2 bg-yellow-100 border-2 border-yellow-400 px-3 py-1.5 rounded-2xl font-black text-amber-950 cursor-pointer">
          <span className="text-3xl animate-bounce-gentle">{char.emoji}</span>{kid.name}
        </button>
        <nav className="flex gap-1.5">
          {TABS.map(([id, Icon, c]) => (
            <button key={id} onClick={() => onTab(id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-black text-sm border-2 cursor-pointer transition ${tab === id ? `${c} text-white border-white shadow-md scale-105` : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
              <Icon className="w-5 h-5" /><span className="hidden sm:inline">{t(id)}</span>
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-2xl font-black font-fredoka"><Star className="w-5 h-5 text-amber-500 fill-amber-400" />{kid.stars}</span>
          <span className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-300 px-3 py-1 rounded-2xl font-black font-fredoka"><Coins className="w-5 h-5 text-yellow-600 fill-yellow-400" />{kid.coins}</span>
          <LangSwitch />
        </div>
      </div>
    </header>
  )
}
