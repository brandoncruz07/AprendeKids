import React from 'react'
import { Achievement } from '../data/gameData'
import { Trophy, Star, CheckCircle, Lock, Award } from 'lucide-react'

interface AchievementsViewProps {
  achievements: Achievement[]
  stars: number
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements, stars }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-purple-50 via-indigo-100 to-purple-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-4 border-purple-300 shadow-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center text-4xl shadow-md border-2 border-white text-white">
              🏆
            </div>
            <div>
              <h1 className="text-3xl font-black text-purple-950 font-fredoka">
                Salón de Medallas y Logros
              </h1>
              <p className="text-sm font-bold text-slate-600">
                ¡Colecciona todas las medallas demostrando tus habilidades!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-100 border-2 border-purple-300 px-5 py-2.5 rounded-2xl shadow-inner">
            <Award className="w-7 h-7 text-purple-600" />
            <div>
              <p className="text-xs font-extrabold text-purple-800">Desbloqueadas</p>
              <p className="text-2xl font-black font-fredoka text-purple-950">
                {achievements.filter((a) => a.unlocked).length} / {achievements.length}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`bg-white rounded-3xl p-5 border-4 shadow-lg flex items-center gap-4 transition-all ${
                ach.unlocked
                  ? 'border-purple-300 bg-white'
                  : 'border-slate-200 bg-slate-50 opacity-80'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ach.color} flex items-center justify-center text-4xl shadow-md border-2 border-white shrink-0`}
              >
                {ach.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                    {ach.category}
                  </span>
                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs">
                      <CheckCircle className="w-4 h-4" /> ¡Conseguido!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400 font-extrabold text-xs">
                      <Lock className="w-3.5 h-3.5" /> En progreso
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-800 font-fredoka mt-1">{ach.title}</h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{ach.description}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                    />
                  </div>
                  <p className="text-right text-[10px] font-extrabold text-slate-500 mt-1">
                    {ach.progress} / {ach.maxProgress}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
