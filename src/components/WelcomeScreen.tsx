import React, { useState } from 'react'
import { CHARACTERS, Character } from '../data/gameData'
import { Sparkles, ArrowRight, Volume2, Heart } from 'lucide-react'

interface WelcomeProps {
  onSelectCharacter: (character: Character) => void
}

export const WelcomeScreen: React.FC<WelcomeProps> = ({ onSelectCharacter }) => {
  const [selected, setSelected] = useState<Character>(CHARACTERS[0])
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null)

  const speakGreeting = (char: Character) => {
    setIsPlayingAudio(char.id)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(char.voiceGreeting)
      utterance.lang = 'es-ES'
      utterance.pitch = 1.3
      utterance.rate = 0.95
      utterance.onend = () => setIsPlayingAudio(null)
      utterance.onerror = () => setIsPlayingAudio(null)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlayingAudio(null), 1500)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-sky-300 via-indigo-200 to-purple-300 overflow-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Decorative animated elements in background */}
      <div className="absolute top-8 left-8 text-5xl animate-float opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-12 right-12 text-6xl animate-float opacity-80 pointer-events-none" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute bottom-16 left-12 text-4xl animate-bounce-gentle opacity-70 pointer-events-none">⭐</div>
      <div className="absolute top-1/3 right-8 text-5xl animate-bounce-gentle opacity-70 pointer-events-none" style={{ animationDelay: '1.5s' }}>🎈</div>
      <div className="absolute top-24 left-1/3 text-4xl animate-bounce-gentle opacity-70 pointer-events-none" style={{ animationDelay: '0.8s' }}>🌈</div>

      {/* Title Header */}
      <header className="relative z-10 text-center mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 bg-yellow-400 text-amber-950 font-black px-6 py-2 rounded-full border-4 border-yellow-200 shadow-xl mb-3 text-sm sm:text-base tracking-wide animate-pulse-glow">
          <Sparkles className="w-5 h-5 fill-amber-950" />
          ¡APRENDIZAJE DIVERTIDO Y MÁGICO!
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] tracking-wide font-fredoka flex items-center justify-center gap-3">
          <span>Aprende</span>
          <span className="text-yellow-300 transform -rotate-2 inline-block">Jugando</span>
        </h1>
        <p className="text-white text-lg sm:text-2xl font-bold drop-shadow-md mt-2 max-w-xl mx-auto">
          ¡Elige a tu compañero de aventura y explora mundos increíbles!
        </p>
      </header>

      {/* Character Selector Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full my-auto py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {CHARACTERS.map((char) => {
            const isSelected = selected.id === char.id
            return (
              <div
                key={char.id}
                onClick={() => {
                  setSelected(char)
                  speakGreeting(char)
                }}
                className={`relative group cursor-pointer rounded-3xl p-4 sm:p-5 transition-all duration-300 flex flex-col items-center justify-between text-center border-4 ${
                  isSelected
                    ? `bg-white shadow-2xl scale-105 ${char.borderColor} ring-4 ring-yellow-300 ring-offset-2`
                    : 'bg-white/80 hover:bg-white hover:scale-102 border-white/60 shadow-lg'
                }`}
              >
                {/* Active badge */}
                {isSelected && (
                  <div className="absolute -top-3 bg-yellow-400 text-amber-950 font-bold text-xs px-3 py-1 rounded-full border-2 border-white shadow-md animate-bounce-gentle flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    ¡Elegido!
                  </div>
                )}

                {/* Subject badge */}
                <span className={`text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${char.badgeColor}`}>
                  {char.subject}
                </span>

                {/* Character Icon / Avatar */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br ${char.bgGradient} flex items-center justify-center text-5xl sm:text-6xl md:text-7xl shadow-inner border-2 border-white/50 my-2 transition-transform duration-300 ${
                    isSelected ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                  }`}
                >
                  {char.avatarSvg}
                </div>

                {/* Name and Role */}
                <div>
                  <h3 className={`text-xl sm:text-2xl font-black ${char.textColor} font-fredoka`}>
                    {char.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 line-clamp-1">
                    {char.role}
                  </p>
                </div>

                {/* Voice button preview */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected(char)
                    speakGreeting(char)
                  }}
                  className={`mt-3 p-2 rounded-full transition-colors ${
                    isPlayingAudio === char.id ? 'bg-yellow-400 text-amber-900 animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Escuchar voz del personaje"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Selected character description detail banner */}
        <div className="mt-6 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-4 border-yellow-300 shadow-xl max-w-3xl mx-auto text-center flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-4 text-left">
            <div className={`text-4xl sm:text-5xl p-3 rounded-2xl bg-gradient-to-br ${selected.bgGradient} shadow-md`}>
              {selected.avatarSvg}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-black text-slate-800 font-fredoka">{selected.name}</h4>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${selected.badgeColor}`}>
                  {selected.role}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-600 mt-0.5">
                "{selected.voiceGreeting}"
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCharacter(selected)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-2xl border-b-4 border-teal-700 active:translate-y-1 transition-all flex items-center justify-center gap-3 shrink-0 group cursor-pointer"
          >
            <span>¡JUGAR AHORA!</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 text-center text-white/90 font-bold text-xs sm:text-sm py-2">
        ✨ Sin anuncios • Sin registro • 100% seguro para niños ✨
      </footer>
    </div>
  )
}
