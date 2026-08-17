import React from 'react'
import { Character } from '../data/gameData'
import { Star, Coins, Trophy, ShoppingBag, ArrowLeft, Map } from 'lucide-react'

interface TopBarProps {
  character: Character
  stars: number
  coins: number
  activeTab: 'map' | 'shop' | 'achievements'
  onTabChange: (tab: 'map' | 'shop' | 'achievements') => void
  onChangeCharacter: () => void
}

export const TopBar: React.FC<TopBarProps> = ({
  character,
  stars,
  coins,
  activeTab,
  onTabChange,
  onChangeCharacter
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-yellow-300 shadow-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left side: Character Avatar & Switch button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onChangeCharacter}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 text-amber-900 font-extrabold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border-2 border-yellow-400 shadow-sm transition-transform active:scale-95 cursor-pointer"
            title="Cambiar personaje"
          >
            <span className="text-2xl sm:text-3xl animate-bounce-gentle">{character.avatarSvg}</span>
            <div className="text-left hidden sm:block">
              <p className="text-xs text-amber-800 leading-none">Acompañante</p>
              <p className="text-sm font-black font-fredoka text-amber-950 leading-tight">{character.name}</p>
            </div>
            <span className="text-xs bg-white text-amber-800 px-1.5 py-0.5 rounded-full font-bold sm:hidden">
              {character.name}
            </span>
          </button>
        </div>

        {/* Center: Navigation Buttons (Mundo / Tienda / Logros) */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden xs:inline">Mapa de Aventuras</span>
            <span className="xs:hidden">Mapa</span>
          </button>

          <button
            onClick={() => onTabChange('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'shop'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tienda</span>
          </button>

          <button
            onClick={() => onTabChange('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 ${
              activeTab === 'achievements'
                ? 'bg-purple-500 text-white border-purple-600 shadow-md scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden xs:inline">Logros</span>
            <span className="xs:hidden">Premios</span>
          </button>
        </nav>

        {/* Right side: Stats (Estrellas y Monedas) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Estrellas */}
          <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl shadow-inner">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-pulse-glow" />
            <span className="font-black text-amber-900 text-sm sm:text-base font-fredoka">{stars}</span>
          </div>

          {/* Monedas */}
          <div className="flex items-center gap-1.5 bg-yellow-100 border-2 border-yellow-300 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl shadow-inner">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 fill-yellow-400" />
            <span className="font-black text-yellow-950 text-sm sm:text-base font-fredoka">{coins}</span>
          </div>
        </div>

      </div>
    </header>
  )
}
