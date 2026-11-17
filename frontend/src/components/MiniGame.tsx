import { useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { getGameWords, getWords, splitLetters } from '../content'
import { ActivityType, WORLD_LEVELS, WorldId } from '../data/levelData'
import { getAgeDifficultyOffset } from '../data/levelDifficulty'

const WORLD_SYMBOLS: Record<WorldId, string[]> = {
  letters: [],
  reading: ['📚', '📖', '📝', '🔤', '📘', '✏️'],
  numbers: ['🍎', '🍐', '⭐', '🧸', '🍪', '🚂'],
  dinosaurs: ['🦕', '🦖', '🥚', '🌋', '🦴', '🌴'],
  thinking: ['⚪', '⭐', '🔺', '🔷', '🟩', '🔶']
}

const STORY_SYMBOLS: Record<Exclude<WorldId, 'letters'>, string[]> = {
  reading: ['📖', '👀', '🔤', '📝', '📚', '⭐', '📖'],
  numbers: ['🍎', '➕', '🍏', '🛒', '🔢', '🍎', '⭐'],
  dinosaurs: ['🥚', '🐣', '🦕', '🌿', '🌋', '🦖', '⭐'],
  thinking: ['⚪', '⭐', '🔺', '🔷', '🟩', '🔶', '⚪']
}

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)
const getWorldSymbols = (world: WorldId, lang: ReturnType<typeof useI18n>['lang']) =>
  world === 'letters'
    ? [...new Set(getWords(lang).map(([word]) => splitLetters(word)[0]))]
    : WORLD_SYMBOLS[world]

export function MiniGame({ activity, world, level, age, onComplete }: {
  activity: ActivityType
  world: WorldId
  level: number
  age: number
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const { t, lang } = useI18n()
  const completed = useRef(false)
  const moduleCount = WORLD_LEVELS[world][level - 1]?.moduleCount ?? 5
  const [module, setModule] = useState(1)
  const moduleScores = useRef(0)
  const allFirstTry = useRef(true)
  const completedModules = useRef(new Set<number>())
  const symbols = getWorldSymbols(world, lang)
  const ageOffset = getAgeDifficultyOffset(age)
  const difficulty = Math.max(1, level + module - 1 + ageOffset)
  const finish = (score: number, firstTry: boolean) => {
    if (completed.current) return
    completed.current = true
    onComplete(score, firstTry)
  }
  const completeModule = (score: number, firstTry: boolean) => {
    if (completedModules.current.has(module)) return
    completedModules.current.add(module)
    moduleScores.current += score
    allFirstTry.current = allFirstTry.current && firstTry
    if (module === moduleCount) {
      finish(Math.max(1, Math.round(moduleScores.current / moduleCount)), allFirstTry.current)
    } else {
      setModule((current) => current + 1)
    }
  }
  return (
    <section className="mx-auto max-w-3xl rounded-3xl border-4 border-amber-300 bg-white p-5 text-center shadow-xl sm:p-8">
      <p className="mb-2 text-sm font-black text-slate-600">{t('module_step', { n: String(module), total: String(moduleCount) })}</p>
      <div className="mb-5 flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={moduleCount} aria-valuenow={module - 1}
        aria-label={t('module_step', { n: String(module), total: String(moduleCount) })}>
        {Array.from({ length: moduleCount }, (_, index) => (
          <div key={index} aria-hidden="true" className={`h-3 flex-1 rounded-full ${index < module - 1 ? 'bg-emerald-400' : index === module - 1 ? 'bg-yellow-400' : 'bg-slate-200'}`} />
        ))}
      </div>
      {activity === 'memory' || activity === 'matching' ? (
        <MemoryGame
          key={`${activity}-${world}-${level}-${module}-${lang}`}
          matching={activity === 'matching'}
          world={world}
          symbols={symbols}
          stage={module}
          ageOffset={ageOffset}
          onComplete={completeModule}
        />
      ) : activity === 'word' ? (
        <WordGame key={`${world}-${level}-${module}-${lang}`} world={world} lang={lang} difficulty={difficulty} stage={module} ageOffset={ageOffset} onComplete={completeModule} />
      ) : activity === 'counting' ? (
        <CountingGame key={`${world}-${level}-${module}`} symbols={symbols} stage={module} ageOffset={ageOffset} t={t} onComplete={completeModule} />
      ) : activity === 'sequence' ? (
        <SequenceGame key={`${world}-${level}-${module}`} symbols={symbols} stage={module} ageOffset={ageOffset} t={t} onComplete={completeModule} />
      ) : activity === 'search' ? (
        <SearchGame key={`${world}-${level}-${module}`} symbols={symbols} stage={module} ageOffset={ageOffset} t={t} onComplete={completeModule} />
      ) : activity === 'story' ? (
        <StoryGame key={`${world}-${level}-${module}`} world={world} symbols={symbols} stage={module} ageOffset={ageOffset} t={t} onComplete={completeModule} />
      ) : (
        <CompareGame key={`${world}-${level}-${module}-${lang}`} world={world} symbol={symbols[0]} lang={lang} stage={module} ageOffset={ageOffset} t={t} onComplete={completeModule} />
      )}
    </section>
  )
}

function MemoryGame({ matching, world, symbols, stage, ageOffset, onComplete }: {
  matching: boolean
  world: WorldId
  symbols: string[]
  stage: number
  ageOffset: number
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const { t, lang } = useI18n()
  const matchingWords = matching ? getGameWords(world, lang) : []
  const pairCount = Math.min(6, matching ? matchingWords.length : symbols.length, Math.max(1, stage + 1 + ageOffset))
  const [cards] = useState(() => {
    if (matching) {
      return shuffle(matchingWords.slice(0, pairCount).flatMap(([word, emoji], index) => [
        { id: `${index}-picture`, pair: String(index), face: emoji },
        { id: `${index}-word`, pair: String(index), face: word }
      ]))
    }
    return shuffle(symbols.slice(0, pairCount).flatMap((symbol, index) => [
      { id: `${index}-a`, pair: String(index), face: symbol },
      { id: `${index}-b`, pair: String(index), face: symbol }
    ]))
  })
  const [shown, setShown] = useState<string[]>([])
  const [found, setFound] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [mistake, setMistake] = useState(false)

  const flip = (cardId: string) => {
    if (shown.length === 2 || shown.includes(cardId) || found.includes(cardId)) return
    const nextShown = [...shown, cardId]
    setShown(nextShown)
    if (nextShown.length !== 2) return

    const nextMoves = moves + 1
    setMoves(nextMoves)
    const first = cards.find((card: { id: string }) => card.id === nextShown[0])
    const second = cards.find((card: { id: string }) => card.id === nextShown[1])
    if (first?.pair === second?.pair) {
      const nextFound = [...found, ...nextShown]
      setFound(nextFound)
      setShown([])
      setMistake(false)
      if (nextFound.length === cards.length) {
        const extraMoves = nextMoves - pairCount
        onComplete(Math.max(1, 3 - Math.floor(extraMoves / pairCount)), extraMoves === 0)
      }
    } else {
      setMistake(true)
      window.setTimeout(() => setShown([]), 750)
    }
  }

  return (
    <>
      <p className="mb-3 text-sm font-extrabold text-slate-500">
        {t('mini_pairs')}: {found.length / 2}/{pairCount} · {t('mini_flips')}: {moves}
      </p>
      <div className="mx-auto grid max-w-xl grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card: { id: string; pair: string; face: string }) => {
          const visible = shown.includes(card.id) || found.includes(card.id)
          return (
            <button
              type="button"
              key={card.id}
              onClick={() => flip(card.id)}
              aria-label={visible ? card.face : '?'}
              aria-pressed={visible}
              className={`flex min-h-20 items-center justify-center break-all rounded-2xl border-2 p-2 text-2xl font-black transition sm:text-3xl ${
                found.includes(card.id) ? 'border-emerald-300 bg-emerald-100' :
                  visible ? 'border-sky-300 bg-sky-100' : 'border-indigo-300 bg-indigo-500 text-white'
              }`}
            >
              {visible ? card.face : '❔'}
            </button>
          )
        })}
      </div>
      {mistake && <p role="status" className="mt-3 font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}

function WordGame({ world, lang, difficulty, stage, ageOffset, onComplete }: {
  world: WorldId
  lang: ReturnType<typeof useI18n>['lang']
  difficulty: number
  stage: number
  ageOffset: number
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const { t } = useI18n()
  const allWords = getGameWords(world, lang)
  const desiredLength = 2 + Math.floor((difficulty - 1) / 2)
  const words = allWords.filter(([word]) => splitLetters(word).length >= desiredLength)
  const wordOptions = words.length ? words : allWords
  const target = useRef(wordOptions[Math.floor(Math.random() * wordOptions.length)]).current
  const targetLetters = splitLetters(target[0]).map((letter, index) => ({ id: index, letter }))
  const targetLetterSet = new Set(targetLetters.map(({ letter }) => letter))
  const alphabet = [...new Set(allWords.flatMap(([word]) => splitLetters(word)))]
  const distractorCount = Math.min(5, Math.max(0, stage - 1 + ageOffset))
  const distractors = shuffle(alphabet.filter((letter) => !targetLetterSet.has(letter)))
    .slice(0, distractorCount)
    .map((letter, index) => ({ id: targetLetters.length + index, letter }))
  const letters = useRef(shuffle([...targetLetters, ...distractors])).current
  const [picked, setPicked] = useState<number[]>([])
  const [wrong, setWrong] = useState(false)
  const [firstTry, setFirstTry] = useState(true)

  const choose = (tile: { id: number; letter: string }) => {
    if (picked.includes(tile.id)) return
    const next = [...picked, tile.id]
    const currentWord = next.map((id) => letters.find((letter) => letter.id === id)?.letter ?? '').join('')
    if (!target[0].startsWith(currentWord)) {
      setWrong(true)
      setFirstTry(false)
      window.setTimeout(() => { setPicked([]); setWrong(false) }, 800)
      return
    }
    setPicked(next)
    if (currentWord === target[0]) onComplete(firstTry ? 3 : 2, firstTry)
  }

  return (
    <>
      <div className="mb-5 text-6xl" aria-hidden="true">{target[1]}</div>
      <p className={`mb-4 min-h-10 font-fredoka text-2xl font-black tracking-[0.25em] ${wrong ? 'text-rose-600' : 'text-slate-800'}`} aria-live="polite">
        {picked.map((id) => letters.find((letter) => letter.id === id)?.letter).join('') || '＿ '.repeat(splitLetters(target[0]).length)}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {letters.map((tile) => (
          <button type="button" key={tile.id} disabled={picked.includes(tile.id)} onClick={() => choose(tile)}
            className="min-w-14 rounded-xl border-b-4 border-amber-600 bg-amber-300 px-4 py-3 text-2xl font-black disabled:bg-emerald-200">
            {tile.letter}
          </button>
        ))}
      </div>
      {wrong && <p role="status" className="mt-3 font-bold text-rose-600">{t('mini_try_again')}</p>}
    </>
  )
}

function CountingGame({ symbols, stage, ageOffset, t, onComplete }: {
  symbols: string[]
  stage: number
  ageOffset: number
  t: (key: string) => string
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const count = useRef(2 + Math.floor(Math.random() * Math.max(2, stage + 2 + ageOffset))).current
  const options = useRef(shuffle(Array.from(new Set([count, Math.max(1, count - 1), count + 1])))).current
  const [firstTry, setFirstTry] = useState(true)
  const [wrong, setWrong] = useState(false)
  return (
    <>
      <div className="mx-auto mb-5 flex max-w-lg flex-wrap justify-center gap-2 text-4xl" aria-label={`${count}`}>
        {Array.from({ length: count }, (_, index) => <span key={index}>{symbols[0]}</span>)}
      </div>
      <div className="flex justify-center gap-3">
        {options.map((number) => (
          <button type="button" key={number} onClick={() => number === count
            ? onComplete(firstTry ? 3 : 2, firstTry)
            : (setWrong(true), setFirstTry(false))}
            className="rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-7 py-4 font-fredoka text-3xl font-black text-white">
            {number}
          </button>
        ))}
      </div>
      {wrong && <p role="status" className="mt-3 font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}

function SequenceGame({ symbols, stage, ageOffset, t, onComplete }: {
  symbols: string[]
  stage: number
  ageOffset: number
  t: (key: string) => string
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const cycleLength = Math.min(3, Math.max(1, 2 + Math.floor((stage - 1 + ageOffset) / 2)))
  const patternLength = Math.max(2, 2 + stage + ageOffset)
  const pattern = Array.from({ length: patternLength }, (_, index) => symbols[index % cycleLength])
  const answer = symbols[patternLength % cycleLength]
  const options = useRef(shuffle(symbols.slice(0, Math.max(3, cycleLength)))).current
  const [firstTry, setFirstTry] = useState(true)
  const [wrong, setWrong] = useState(false)
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-4xl sm:text-5xl">
        {pattern.map((symbol, index) => <span key={index} className="rounded-xl bg-sky-50 p-2">{symbol}</span>)}
        <span className="rounded-xl bg-amber-100 p-2">❔</span>
      </div>
      <div className="flex justify-center gap-3">
        {options.map((symbol) => (
          <button type="button" key={symbol} onClick={() => symbol === answer
            ? onComplete(firstTry ? 3 : 2, firstTry)
            : (setWrong(true), setFirstTry(false))}
            className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-4xl hover:bg-sky-100">
            {symbol}
          </button>
        ))}
      </div>
      {wrong && <p role="status" className="mt-3 font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}

function SearchGame({ symbols, stage, ageOffset, t, onComplete }: {
  symbols: string[]
  stage: number
  ageOffset: number
  t: (key: string) => string
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const target = symbols[0]
  const targets = Math.min(12, Math.max(1, stage + 2 + ageOffset))
  const cells = useRef(shuffle([
    ...Array.from({ length: targets }, (_, index) => ({ id: `target-${index}`, symbol: target, target: true })),
    ...Array.from({ length: 16 - targets }, (_, index) => ({
      id: `other-${index}`,
      symbol: symbols[1 + index % (symbols.length - 1)],
      target: false
    }))
  ])).current
  const [found, setFound] = useState<string[]>([])
  const [firstTry, setFirstTry] = useState(true)
  const [wrong, setWrong] = useState(false)
  const select = (cell: { id: string; target: boolean }) => {
    if (found.includes(cell.id)) return
    if (!cell.target) {
      setWrong(true)
      setFirstTry(false)
      return
    }
    const next = [...found, cell.id]
    setFound(next)
    setWrong(false)
    if (next.length === targets) onComplete(firstTry ? 3 : 2, firstTry)
  }
  return (
    <>
      <p className="mb-3 text-lg font-black">{t('mini_target')}: <span className="text-3xl">{target}</span> · {found.length}/{targets}</p>
      <div className="mx-auto grid max-w-sm grid-cols-4 gap-2">
        {cells.map((cell: { id: string; symbol: string; target: boolean }) => (
          <button type="button" key={cell.id} onClick={() => select(cell)} aria-pressed={found.includes(cell.id)}
            className={`aspect-square rounded-xl text-3xl ${found.includes(cell.id) ? 'bg-emerald-100' : 'bg-slate-100 hover:bg-amber-100'}`}>
            {found.includes(cell.id) ? '✅' : cell.symbol}
          </button>
        ))}
      </div>
      {wrong && <p role="status" className="mt-3 font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}

function StoryGame({ world, symbols, stage, ageOffset, t, onComplete }: {
  world: WorldId
  symbols: string[]
  stage: number
  ageOffset: number
  t: (key: string) => string
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const story = world === 'letters' ? symbols.slice(0, 7) : STORY_SYMBOLS[world]
  const correct = story.slice(0, Math.min(story.length, Math.max(2, stage + 2 + ageOffset)))
  const [order, setOrder] = useState(() => Array.from({ length: correct.length }, (_, index) => index).reverse())
  const [firstTry, setFirstTry] = useState(true)
  const [wrong, setWrong] = useState(false)
  const move = (position: number, delta: number) => {
    const target = position + delta
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[position], next[target]] = [next[target], next[position]]
    setOrder(next)
  }
  const check = () => {
    if (order.every((item, index) => item === index)) onComplete(firstTry ? 3 : 2, firstTry)
    else {
      setWrong(true)
      setFirstTry(false)
    }
  }
  return (
    <>
      <ol className="mx-auto max-w-md space-y-3">
        {order.map((storyIndex, position) => (
          <li key={storyIndex} className="flex items-center gap-3 rounded-xl bg-sky-50 p-3">
            <span className="flex-1 text-5xl">{correct[storyIndex]}</span>
            <button type="button" aria-label={t('mini_up')} disabled={position === 0} onClick={() => move(position, -1)}
              className="rounded-lg bg-white px-3 py-2 text-lg font-black disabled:opacity-40">↑</button>
            <button type="button" aria-label={t('mini_down')} disabled={position === order.length - 1} onClick={() => move(position, 1)}
              className="rounded-lg bg-white px-3 py-2 text-lg font-black disabled:opacity-40">↓</button>
          </li>
        ))}
      </ol>
      <button type="button" onClick={check} className="mt-5 rounded-xl bg-amber-400 px-6 py-3 font-black text-amber-950">
        {t('mini_check')}
      </button>
      {wrong && <p role="status" className="mt-3 font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}

function CompareGame({ world, symbol, lang, stage, ageOffset, t, onComplete }: {
  world: WorldId
  symbol: string
  lang: ReturnType<typeof useI18n>['lang']
  stage: number
  ageOffset: number
  t: (key: string) => string
  onComplete: (score: number, firstTry: boolean) => void
}) {
  const [amounts] = useState(() => {
    const left = 2 + Math.floor(Math.random() * Math.max(2, stage + 2 + ageOffset))
    return [left, left + Math.max(1, stage + ageOffset)]
  })
  const readingPair = useRef(shuffle(getWords(lang)).slice(0, Math.min(getWords(lang).length, Math.max(2, stage + 1 + ageOffset)))).current
  const [targetWord, targetEmoji] = readingPair[0]
  const [firstTry, setFirstTry] = useState(true)
  const [wrong, setWrong] = useState(false)
  const choose = (correct: boolean) => correct
    ? onComplete(firstTry ? 3 : 2, firstTry)
    : (setWrong(true), setFirstTry(false))

  return (
    <>
      {world === 'reading' ? (
        <div className="mb-5 flex flex-col items-center justify-center gap-4">
          <span className="text-6xl" aria-hidden="true">{targetEmoji}</span>
          <div className="grid grid-cols-2 justify-center gap-3 sm:grid-cols-3">
            {readingPair.map(([word]) => (
              <button type="button" key={word} aria-label={word} onClick={() => choose(word === targetWord)}
                className="flex min-h-24 max-w-40 items-center justify-center break-all rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 font-fredoka text-2xl font-black hover:bg-amber-100">
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-center gap-4">
          {amounts.map((amount) => (
            <button type="button" key={amount} aria-label={`${amount}`} onClick={() => choose(amount === amounts[1])}
              className="flex min-h-24 max-w-40 flex-wrap items-center justify-center gap-1 rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 text-2xl hover:bg-amber-100">
              {Array.from({ length: amount }, (_, index) => <span key={index}>{symbol}</span>)}
            </button>
          ))}
        </div>
      )}
      {wrong && <p role="status" className="font-bold text-amber-700">{t('mini_try_again')}</p>}
    </>
  )
}
