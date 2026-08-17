import React from 'react'
import { Character } from '../data/gameData'
import { BookOpen, Book, Hash, Brain, Sparkles, Lock, Play, Compass } from 'lucide-react'

export interface WorldInfo {
  id: string
  name: string
  subtitle: string
  icon: string
  LucideIcon: React.ElementType
  color: string
  bgGradient: string
  borderColor: string
  textColor: string
  badgeColor: string
  activitiesCount: number
  unlocked: boolean
  description: string
  pathStyle: string
}

export const WORLDS: WorldInfo[] = [
  {
    id: 'letters',
    name: 'Mundo de las Letras',
    subtitle: 'Vocales, Abecedario y Sílabas',
    icon: '🔤',
    LucideIcon: BookOpen,
    color: 'bg-purple-500',
    bgGradient: 'from-purple-500 via-indigo-500 to-violet-600',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800',
    activitiesCount: 6,
    unlocked: true,
    description: 'Aprende las vocales, sonidos del abecedario, letras mayúsculas, minúsculas y cómo unir sílabas.',
    pathStyle: 'top-10 left-10'
  },
  {
    id: 'reading',
    name: 'Mundo de la Lectura',
    subtitle: 'Palabras y Cuentos Mágicos',
    icon: '📖',
    LucideIcon: Book,
    color: 'bg-pink-500',
    bgGradient: 'from-pink-500 via-rose-500 to-red-500',
    borderColor: 'border-pink-600',
    textColor: 'text-pink-900',
    badgeColor: 'bg-pink-100 text-pink-800',
    activitiesCount: 5,
    unlocked: true,
    description: 'Relaciona palabras con imágenes, ordena oraciones, aprende puntos y comas, y lee pequeños cuentos.',
    pathStyle: 'top-40 right-12'
  },
  {
    id: 'numbers',
    name: 'Mundo de los Números',
    subtitle: 'Conteo, Sumas y Restas',
    icon: '🔢',
    LucideIcon: Hash,
    color: 'bg-emerald-500',
    bgGradient: 'from-emerald-500 via-teal-500 to-green-600',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-900',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    activitiesCount: 6,
    unlocked: true,
    description: 'Cuenta manzanas, reconoce números, relacionas cantidades y resuelve sumas y restas divertidas.',
    pathStyle: 'top-80 left-16'
  },
  {
    id: 'dinosaurs',
    name: 'Valle de los Dinosaurios',
    subtitle: 'Aventuras Prehistóricas',
    icon: '🌋',
    LucideIcon: Compass,
    color: 'bg-amber-500',
    bgGradient: 'from-amber-500 via-orange-500 to-yellow-600',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800',
    activitiesCount: 4,
    unlocked: true,
    description: 'Ayuda a Dino y Luna a desenterrar números fósiles, huellas y encontrar tesoros prehistóricos.',
    pathStyle: 'top-120 right-20'
  },
  {
    id: 'thinking',
    name: 'Juegos para Pensar',
    subtitle: 'Memoria, Sopas y Puzles',
    icon: '🧩',
    LucideIcon: Brain,
    color: 'bg-cyan-500',
    bgGradient: 'from-cyan-500 via-sky-500 to-blue-600',
    borderColor: 'border-cyan-600',
    textColor: 'text-cyan-900',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    activitiesCount: 7,
    unlocked: true,
    description: 'Ejercita tu cerebro con sopas de letras, parejas de memoria, rompecabezas, laberintos y secuencias.',
    pathStyle: 'top-160 left-12'
  }
]

interface MapViewProps {
  character: Character
  onSelectWorld: (worldId: string) => void
  completedCount: number
}

export const MapView: React.FC<MapViewProps> = ({ character, onSelectWorld, completedCount }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-sky-200 via-emerald-100 to-teal-200 py-8 px-4 overflow-hidden">
      
      {/* Decorative environment background graphics */}
      <div className="absolute top-10 left-6 text-6xl animate-float opacity-70 pointer-events-none">☁️</div>
      <div className="absolute top-28 right-12 text-7xl animate-float opacity-70 pointer-events-none" style={{ animationDelay: '1.2s' }}>☁️</div>
      <div className="absolute top-1/2 left-4 text-5xl opacity-40 pointer-events-none">🌴</div>
      <div className="absolute bottom-20 right-6 text-6xl opacity-40 pointer-events-none">⛰️</div>
      <div className="absolute bottom-10 left-12 text-5xl opacity-50 pointer-events-none">🍄</div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Companion Welcome Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-4 border-yellow-300 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${character.bgGradient} flex items-center justify-center text-4xl sm:text-5xl shadow-md border-2 border-white`}>
                {character.avatarSvg}
              </div>
              <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-amber-950 font-black text-xs px-2 py-0.5 rounded-full border border-white shadow">
                Guía
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-fredoka">
                  ¡Hola! Soy {character.name}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Nivel Infantil
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-xl">
                Toca cualquier mundo en el mapa para explorar actividades divertidas con música, dibujos y premios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-yellow-50 border-2 border-yellow-200 px-4 py-2 rounded-2xl shrink-0">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
            <div>
              <p className="text-xs font-extrabold text-amber-800">Actividades completadas</p>
              <p className="text-lg font-black font-fredoka text-amber-950">{completedCount} / 28</p>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 font-fredoka tracking-wide drop-shadow-sm">
            🗺️ El Mapa de las Aventuras
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
            Escoge un mundo para aprender jugando
          </p>
        </div>

        {/* Worlds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WORLDS.map((world, idx) => {
            const Icon = world.LucideIcon
            return (
              <div
                key={world.id}
                onClick={() => onSelectWorld(world.id)}
                className="group relative cursor-pointer bg-white rounded-3xl p-5 border-4 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl flex flex-col justify-between"
                style={{ borderColor: world.color.replace('bg-', '') }}
              >
                {/* World Banner Header */}
                <div>
                  <div className={`h-28 rounded-2xl bg-gradient-to-r ${world.bgGradient} p-4 flex items-center justify-between text-white relative overflow-hidden shadow-inner mb-4`}>
                    <div className="z-10">
                      <span className="text-xs font-extrabold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Mundo {idx + 1}
                      </span>
                      <h3 className="text-2xl font-black font-fredoka mt-1 leading-tight text-white drop-shadow">
                        {world.name}
                      </h3>
                      <p className="text-xs font-bold text-white/90">{world.subtitle}</p>
                    </div>

                    <div className="text-5xl sm:text-6xl z-10 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {world.icon}
                    </div>

                    {/* Background faint icon */}
                    <div className="absolute -right-4 -bottom-4 text-8xl opacity-15 text-white pointer-events-none">
                      {world.icon}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                    {world.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${world.badgeColor}`}>
                    {world.activitiesCount} Actividades
                  </span>

                  <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black px-4 py-2 rounded-xl text-sm shadow-md border-b-2 border-amber-600 transition-transform active:scale-95 group-hover:translate-x-1">
                    <span>¡Entrar!</span>
                    <Play className="w-4 h-4 fill-amber-950" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
