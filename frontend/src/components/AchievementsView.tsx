import { useI18n } from '../i18n'
import { Kid } from '../store'
import { ACHIEVEMENTS, achievementProgress } from '../data/achievements'

export function AchievementsView({ kid }: { kid: Kid }) {
  const { t } = useI18n()
  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-purple-50 via-indigo-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5 pb-32">
        {ACHIEVEMENTS.map((achievement) => {
          const value = achievementProgress(kid, achievement)
          const done = value >= achievement.max
          return (
            <div key={achievement.id} className={`bg-white rounded-3xl p-4 border-4 shadow-lg flex items-center gap-4 ${done ? 'border-yellow-400' : 'border-slate-200'}`}>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${achievement.color} flex items-center justify-center text-5xl shrink-0 ${done ? 'animate-bounce-gentle' : 'grayscale opacity-60'}`}>{achievement.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-black font-fredoka text-slate-800">{t(achievement.id)} {done && '🏅'}</h3>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mt-2"><div className={`h-full bg-gradient-to-r ${achievement.color} transition-all duration-700`} style={{ width: `${(value / achievement.max) * 100}%` }} /></div>
                <p className="text-right text-xs font-extrabold text-slate-500 mt-1">{value} / {achievement.max}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
