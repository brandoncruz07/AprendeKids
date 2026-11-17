import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft } from 'lucide-react'
import { useI18n } from '../i18n'
import { Attempt, Kid, levelFor } from '../store'
import { genQ } from '../content'
import { useCompanion } from './Companion'
import { WORLDS } from './MapView'
import { activityLabelKey, ActivityType, WORLD_LEVELS, WorldId } from '../data/levelData'
import { MiniGame } from './MiniGame'
import { LevelGuide } from './LevelGuide'
import { getAgeDifficultyOffset } from '../data/levelDifficulty'

interface QuizProps {
  world: WorldId
  level: number
  kid: Kid
  onAttempt: (attempt: Attempt) => void
  onFinish: (stars: number, coins: number) => void
  onBack: () => void
}

interface Reward {
  stars: number
  coins: number
}

export function Quiz(props: QuizProps) {
  const activity = WORLD_LEVELS[props.world][props.level - 1]?.activity ?? 'quiz'
  return activity === 'quiz' || activity === 'challenge'
    ? <QuestionQuiz {...props} activity={activity} />
    : <ActivityQuiz {...props} activity={activity} />
}

function QuestionQuiz({ world, level, kid, onAttempt, onFinish, onBack, activity }: QuizProps & { activity: ActivityType }) {
  const { t, lang } = useI18n()
  const bot = useCompanion()
  const rounds = WORLD_LEVELS[world][level - 1]?.moduleCount ?? 5
  const w = WORLDS.find((item) => item.id === world)!
  const ageOffset = getAgeDifficultyOffset(kid.age)
  const [difficulty] = useState(() => Math.max(1, Math.max(Math.ceil(level / 3), levelFor(kid.attempts, world)) + ageOffset))
  const [questions] = useState(() => Array.from({ length: rounds }, (_, moduleIndex) =>
    genQ(world, lang, Math.max(1, difficulty + moduleIndex), t, Math.max(1, level + moduleIndex + ageOffset))))
  const [index, setIndex] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now())
  const [reward, setReward] = useState<Reward | null>(null)
  const question = questions[Math.min(index, rounds - 1)]

  useEffect(() => { bot.say(question.p) }, [index]) // la mascota lee cada pregunta en voz alta // eslint-disable-line

  const choose = (optionIndex: number) => {
    if (reward || wrongAnswers.includes(optionIndex)) return
    if (optionIndex !== question.a) {
      setWrongAnswers([...wrongAnswers, optionIndex])
      bot.no()
      return
    }

    const firstTry = wrongAnswers.length === 0
    onAttempt({ t: Date.now(), w: world, ok: firstTry, ms: Date.now() - questionStartedAt, l: level })
    const nextScore = score + (firstTry ? 1 : 0)
    setScore(nextScore)
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.7 } })

    if (index + 1 < rounds) {
      bot.ok()
      window.setTimeout(() => {
        setIndex(index + 1)
        setWrongAnswers([])
        setQuestionStartedAt(Date.now())
      }, 900)
    } else {
      const result = { stars: Math.max(1, nextScore), coins: nextScore * 4 + 2 }
      window.setTimeout(() => {
        setReward(result)
        onFinish(result.stars, result.coins)
        bot.win()
        confetti({ particleCount: 120, spread: 90 })
      }, 650)
    }
  }

  return (
    <ActivityFrame world={world} level={level} age={kid.age} lang={lang} onBack={onBack} t={t}>
      <p className="mb-2 text-center text-sm font-black text-slate-600">
        {t('module_step', { n: String(index + 1), total: String(rounds) })}
      </p>
      <div className="mb-4 flex gap-1.5">
        {questions.map((_, questionIndex) => (
          <div key={questionIndex} className={`h-3 flex-1 rounded-full ${
            questionIndex < index || reward ? 'bg-emerald-400' : questionIndex === index ? 'bg-yellow-400' : 'bg-slate-200'
          }`} />
        ))}
      </div>
      <div className="rounded-3xl border-4 border-amber-300 bg-white p-6 text-center shadow-xl">
        <span className={`inline-block rounded-full bg-gradient-to-r ${w.grad} px-3 py-1 text-xs font-black text-white`}>
          {w.icon} {t(`w_${world}`)}
        </span>
        <h2 className="mt-3 font-fredoka text-2xl font-black text-slate-800 sm:text-3xl">{question.p}</h2>
        <div key={index} className="animate-pop my-6 break-words font-fredoka text-6xl font-black tracking-wide text-slate-800 sm:text-7xl">
          {question.e}
        </div>
        <div className={`grid gap-3 ${question.o.length > 3 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
          {question.o.map((option, optionIndex) => (
            <button type="button" key={`${index}-${optionIndex}`} onClick={() => choose(optionIndex)}
              className={`cursor-pointer rounded-2xl border-b-4 py-5 font-fredoka text-3xl font-black transition active:translate-y-1 sm:text-4xl ${
                wrongAnswers.includes(optionIndex)
                  ? 'animate-shake border-rose-300 bg-rose-200 text-rose-500'
                  : `border-black/20 bg-gradient-to-b ${w.grad} text-white hover:brightness-110`
              }`}>
              {option}
            </button>
          ))}
        </div>
      </div>
      {reward && <RewardDialog reward={reward} onBack={onBack} t={t} />}
    </ActivityFrame>
  )
}

function ActivityQuiz({ world, level, kid, onAttempt, onFinish, onBack, activity }: QuizProps & { activity: ActivityType }) {
  const { t, lang } = useI18n()
  const bot = useCompanion()
  const startedAt = useRef(Date.now()).current
  const [reward, setReward] = useState<Reward | null>(null)

  const complete = (score: number, firstTry: boolean) => {
    if (reward) return
    const result = { stars: Math.max(1, score), coins: Math.max(6, score * 4 + 2) }
    onAttempt({ t: Date.now(), w: world, ok: firstTry, ms: Date.now() - startedAt, l: level })
    onFinish(result.stars, result.coins)
    setReward(result)
    bot.win()
    confetti({ particleCount: 120, spread: 90 })
  }

  return (
    <ActivityFrame world={world} level={level} age={kid.age} lang={lang} onBack={onBack} t={t}>
      <MiniGame activity={activity} world={world} level={level} age={kid.age} onComplete={complete} />
      {reward && <RewardDialog reward={reward} onBack={onBack} t={t} />}
    </ActivityFrame>
  )
}

function ActivityFrame({ world, level, age, lang, onBack, t, children }: {
  world: WorldId
  level: number
  age: number
  lang: ReturnType<typeof useI18n>['lang']
  onBack: () => void
  t: (key: string, values?: Record<string, string>) => string
  children: React.ReactNode
}) {
  const currentActivity = WORLD_LEVELS[world][level - 1]?.activity ?? 'quiz'
  const worldInfo = WORLDS.find((item) => item.id === world)!
  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl pb-32">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 font-extrabold">
            <ArrowLeft className="h-4 w-4" />{t('back')}
          </button>
          <span className="rounded-2xl border-2 border-slate-200 bg-white px-3 py-1.5 font-extrabold">
            {worldInfo.icon} {t('map_level', { n: String(level) })}
          </span>
        </div>
        <div className="mb-4 text-center">
          <p className="text-sm font-extrabold text-slate-500">{t(`w_${world}`)}</p>
          <p className="font-fredoka text-lg font-black text-slate-700">{t(activityLabelKey(world, currentActivity))}</p>
        </div>
        <LevelGuide world={world} activity={currentActivity} level={level} age={age} lang={lang} t={t} />
        {children}
      </div>
    </main>
  )
}

function RewardDialog({ reward, onBack, t }: { reward: Reward; onBack: () => void; t: (key: string) => string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="activity-complete">
      <div className="animate-pop w-full max-w-sm rounded-3xl border-4 border-yellow-400 bg-white p-8 text-center shadow-2xl">
        <div className="text-6xl" aria-hidden="true">🎉🏆🎉</div>
        <h2 id="activity-complete" className="mt-2 font-fredoka text-3xl font-black text-slate-800">{t('done')}</h2>
        <div className="my-5 flex justify-center gap-3 font-fredoka text-2xl font-black">
          <span className="rounded-2xl border-2 border-amber-300 bg-amber-100 px-4 py-2">+{reward.stars} ⭐</span>
          <span className="rounded-2xl border-2 border-yellow-300 bg-yellow-100 px-4 py-2">+{reward.coins} 🪙</span>
        </div>
        <button type="button" onClick={onBack} className="w-full cursor-pointer rounded-2xl border-b-4 border-teal-700 bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-xl font-black text-white">
          {t('cont')}
        </button>
      </div>
    </div>
  )
}
