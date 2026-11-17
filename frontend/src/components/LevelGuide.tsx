import { BookOpen, Lightbulb } from 'lucide-react'
import { activityLabelKey, ActivityType, WORLD_LEVELS, WorldId } from '../data/levelData'
import { getLevelExample } from '../data/levelGuide'

export function LevelGuide({ world, activity, level, age, lang, t }: {
  world: WorldId
  activity: ActivityType
  level: number
  age: number
  lang: Parameters<typeof getLevelExample>[2]
  t: (key: string, values?: Record<string, string>) => string
}) {
  const modules = WORLD_LEVELS[world][level - 1]?.moduleCount ?? 5

  return (
    <section aria-label={t('guide_title')} className="mb-5 rounded-3xl border-2 border-sky-200 bg-sky-50 p-4 text-left shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-fredoka text-xl font-black text-sky-950">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          {t('guide_title')}
        </h2>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-sky-900">
          {t('level_modules', { n: String(modules) })}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-sky-900">
          {t('guide_age', { age: String(age) })}
        </span>
      </div>
      <p className="mt-2 font-bold leading-relaxed text-slate-700">
        {t(activityLabelKey(world, activity, '_hint'))}
      </p>
      <div className="mt-3 rounded-2xl border border-sky-100 bg-white p-3">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-700">
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          {t('guide_example')}
        </p>
        <p className="mt-1 break-words text-center font-fredoka text-2xl font-black text-slate-800 sm:text-3xl">
          {getLevelExample(world, activity, lang)}
        </p>
      </div>
      <p className="mt-3 text-xs font-extrabold leading-relaxed text-slate-600">
        {t('guide_progress', { total: String(modules) })}
      </p>
    </section>
  )
}
