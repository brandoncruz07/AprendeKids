export type WorldId = 'letters' | 'reading' | 'numbers' | 'dinosaurs' | 'thinking'

export type ActivityType =
  | 'quiz'
  | 'memory'
  | 'word'
  | 'matching'
  | 'counting'
  | 'sequence'
  | 'search'
  | 'story'
  | 'compare'
  | 'challenge'

export interface LearningLevel {
  id: string
  activity: ActivityType
  icon: string
  moduleCount: number
}

const CONTEXTUAL_ACTIVITY_KEYS: Partial<Record<WorldId, Partial<Record<ActivityType, string>>>> = {
  letters: { compare: 'game_letter_compare' },
  reading: { compare: 'game_reading_compare' },
  numbers: { word: 'game_number_word', compare: 'game_number_compare' },
  dinosaurs: { word: 'game_dinosaur_word', compare: 'game_dinosaur_compare' },
  thinking: { word: 'game_thinking_word', compare: 'game_thinking_compare' }
}

export const activityLabelKey = (world: WorldId, activity: ActivityType, suffix = '') =>
  `${CONTEXTUAL_ACTIVITY_KEYS[world]?.[activity] ?? `game_${activity}`}${suffix}`

const createLevels = (worldId: WorldId, levels: Array<[ActivityType, string]>): LearningLevel[] =>
  levels.map(([activity, icon], index) => ({
    id: `${worldId}-${index + 1}`,
    activity,
    icon,
    moduleCount: activity === 'challenge' ? 8 : 5
  }))

export const WORLD_LEVELS: Record<WorldId, LearningLevel[]> = {
  letters: createLevels('letters', [
    ['quiz', '🔤'],
    ['word', '✍️'],
    ['memory', '🃏'],
    ['matching', '🧩'],
    ['sequence', '🔡'],
    ['search', '🔎'],
    ['story', '📖'],
    ['counting', '🔢'],
    ['compare', '🔠'],
    ['challenge', '🏆']
  ]),
  reading: createLevels('reading', [
    ['story', '📚'],
    ['quiz', '🗣️'],
    ['matching', '🖼️'],
    ['memory', '🃏'],
    ['word', '🔤'],
    ['search', '🔎'],
    ['sequence', '📝'],
    ['counting', '🔢'],
    ['compare', '🧠'],
    ['challenge', '🏆']
  ]),
  numbers: createLevels('numbers', [
    ['counting', '🍎'],
    ['compare', '⚖️'],
    ['memory', '🃏'],
    ['matching', '➕'],
    ['sequence', '🔢'],
    ['search', '🔎'],
    ['story', '🛒'],
    ['word', '✍️'],
    ['quiz', '🧮'],
    ['challenge', '🏆']
  ]),
  dinosaurs: createLevels('dinosaurs', [
    ['search', '🪨'],
    ['memory', '🃏'],
    ['sequence', '🐾'],
    ['matching', '🦴'],
    ['counting', '🥚'],
    ['story', '📖'],
    ['compare', '🦕'],
    ['word', '🔤'],
    ['quiz', '🌋'],
    ['challenge', '🏆']
  ]),
  thinking: createLevels('thinking', [
    ['memory', '🧠'],
    ['sequence', '🔮'],
    ['matching', '🧩'],
    ['search', '🔎'],
    ['story', '🗺️'],
    ['counting', '🔢'],
    ['compare', '⚖️'],
    ['word', '🔤'],
    ['quiz', '💡'],
    ['challenge', '🏆']
  ])
}
