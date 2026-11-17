import type { Lang } from '../i18n'
import { getGameWords, getWords, splitLetters } from '../content'
import type { ActivityType, WorldId } from './levelData'

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

function getWorldSymbols(world: WorldId, lang: Lang) {
  return world === 'letters'
    ? [...new Set(getWords(lang).map(([word]) => splitLetters(word)[0]))]
    : WORLD_SYMBOLS[world]
}

export function getLevelExample(world: WorldId, activity: ActivityType, lang: Lang) {
  const symbols = getWorldSymbols(world, lang)
  const [word, picture] = getGameWords(world, lang)[0]

  switch (activity) {
    case 'quiz':
    case 'challenge':
      if (world === 'letters') {
        return `${picture} → ${splitLetters(word)[0]}`
      }
      if (world === 'reading') {
        return `${picture} → ${word}`
      }
      if (world === 'numbers') {
        return '🍎 + 🍎 → 2'
      }
      if (world === 'dinosaurs') {
        return '🥚 → 🐣 → 🦕'
      }
      return '⚪ ⚪ ⭐ ⚪ → ⭐'
    case 'memory':
      return `${symbols[0]} ↔ ${symbols[0]}`
    case 'word':
      return `${splitLetters(word).reverse().join(' · ')} → ${word}`
    case 'matching':
      return `${picture} ↔ ${word}`
    case 'counting':
      return `${symbols[0]} ${symbols[0]} ${symbols[0]} → 3`
    case 'sequence':
      return `${symbols[0]} ${symbols[1]} ${symbols[0]} ${symbols[1]} ❔ → ${symbols[0]}`
    case 'search':
      return `🔎 ${symbols[0]} · ${symbols[1]} · ${symbols[0]} · ${symbols[2]} · ${symbols[0]}`
    case 'story': {
      const story = world === 'letters' ? symbols : STORY_SYMBOLS[world]
      return `${story[0]} → ${story[1]} → ${story[2]}`
    }
    case 'compare':
      if (world === 'reading') {
        return `${picture} → ${word}`
      }
      return `${symbols[0]} ${symbols[0]} ⚖️ ${symbols[0]} ${symbols[0]} ${symbols[0]} → ${symbols[0]} ${symbols[0]} ${symbols[0]}`
  }
}
