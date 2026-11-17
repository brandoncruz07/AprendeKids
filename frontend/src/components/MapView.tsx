import { useState } from 'react'
import { Check, Lock, Play } from 'lucide-react'
import { useI18n } from '../i18n'
import { Kid, levelFor } from '../store'
import { SHOP_ITEMS } from '../data/gameData'
import { activityLabelKey, WORLD_LEVELS, WorldId } from '../data/levelData'

export const WORLDS: { id: WorldId; icon: string; grad: string }[] = [
  { id: 'letters', icon: '🔤', grad: 'from-purple-500 to-indigo-600' },
  { id: 'reading', icon: '📖', grad: 'from-pink-500 to-rose-600' },
  { id: 'numbers', icon: '🔢', grad: 'from-emerald-500 to-teal-600' },
  { id: 'dinosaurs', icon: '🌋', grad: 'from-amber-500 to-orange-600' },
  { id: 'thinking', icon: '🧩', grad: 'from-cyan-500 to-blue-600' }
]

export function MapView({ kid, onPick }: { kid: Kid; onPick: (world: WorldId, level: number) => void }) {
  const { t } = useI18n()
  const [expandedWorld, setExpandedWorld] = useState<WorldId | null>('letters')
  const bg = SHOP_ITEMS.find((item) => item.id === kid.bg)?.bg || 'from-sky-300 via-emerald-200 to-teal-300'
  const completedLevels = kid.completedLevels ?? []
  const allLevels = Object.values(WORLD_LEVELS).flat()

  return (
    <div className={`relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-b ${bg} p-4 sm:p-8`}>
      {['☁️', '🌴', '🍄', '⛰️'].map((emoji, index) => (
        <span
          key={emoji}
          aria-hidden="true"
          className="pointer-events-none absolute text-6xl opacity-50 animate-float"
          style={{ top: `${8 + index * 22}%`, left: index % 2 ? '88%' : '2%', animationDelay: `${index * 0.9}s` }}
        >
          {emoji}
        </span>
      ))}
      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="text-center text-3xl font-black font-fredoka text-white drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)] sm:text-5xl">
          🗺️ {t('choose')}
        </h1>
        <p className="mt-2 text-center font-extrabold text-white drop-shadow">
          {t('map_progress', { done: String(completedLevels.length), total: String(allLevels.length) })}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 pb-32 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((world, index) => {
            const levels = WORLD_LEVELS[world.id]
            const completedInWorld = levels.filter((item) => completedLevels.includes(item.id)).length
            const expanded = expandedWorld === world.id
            return (
              <article key={world.id} className="rounded-3xl border-4 border-white bg-white p-4 shadow-xl">
                <div className={`relative flex h-32 items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r ${world.grad} p-4 text-white`}>
                  <div className="z-10">
                    <span className="rounded-full bg-white/25 px-2.5 py-1 text-xs font-extrabold">
                      {t('map_world', { n: String(index + 1) })}
                    </span>
                    <h2 className="mt-2 font-fredoka text-2xl font-black leading-tight drop-shadow">
                      {t(`w_${world.id}`)}
                    </h2>
                  </div>
                  <span className="text-6xl transition-transform group-hover:rotate-6" aria-hidden="true">{world.icon}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                    {completedInWorld}/{levels.length} {t('levels')}
                  </span>
                  <span className="text-xs font-extrabold text-slate-500">
                    {t('level')} {'⭐'.repeat(levelFor(kid.attempts, world.id))}
                  </span>
                </div>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpandedWorld(expanded ? null : world.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-b-2 border-amber-600 bg-yellow-400 px-4 py-2 font-black text-amber-950 hover:bg-yellow-300"
                >
                  {expanded ? t('map_hide') : t('map_explore')} <Play className="h-4 w-4 fill-current" />
                </button>
                {expanded && (
                  <ol className="mt-3 space-y-2" aria-label={`${t('levels')}: ${t(`w_${world.id}`)}`}>
                    {levels.map((item, levelIndex) => {
                      const completed = completedLevels.includes(item.id)
                      const unlocked = levelIndex === 0 || completedLevels.includes(levels[levelIndex - 1].id)
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            disabled={!unlocked}
                            onClick={() => onPick(world.id, levelIndex + 1)}
                            aria-label={`${t('map_level', { n: String(levelIndex + 1) })}: ${t(activityLabelKey(world.id, item.activity))}, ${t(completed ? 'status_complete' : unlocked ? 'status_play' : 'status_locked')}`}
                            className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-transform ${
                              completed
                                ? 'border-emerald-300 bg-emerald-50 hover:scale-[1.02]'
                                : unlocked
                                  ? 'border-slate-200 bg-white hover:scale-[1.02]'
                                  : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-70'
                            }`}
                          >
                            <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">
                                {t('map_level', { n: String(levelIndex + 1) })}
                              </span>
                              <span className="block truncate text-sm font-black text-slate-800">{t(activityLabelKey(world.id, item.activity))}</span>
                              <span className="block text-xs text-slate-500">{t(activityLabelKey(world.id, item.activity, '_hint'))}</span>
                              <span className="mt-1 block text-[11px] font-extrabold text-indigo-700">{t('level_modules', { n: String(item.moduleCount) })}</span>
                            </span>
                            {completed ? <Check className="h-5 w-5 shrink-0 text-emerald-600" /> : unlocked
                              ? <Play className="h-4 w-4 shrink-0 text-amber-600" />
                              : <Lock className="h-4 w-4 shrink-0 text-slate-500" />}
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
