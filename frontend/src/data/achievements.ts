import { Attempt, Kid } from '../store'

export interface AchievementDefinition {
  id: string
  icon: string
  max: number
  color: string
  progress: (kid: Kid) => number
}

const correct = (attempts: Attempt[], world: string) =>
  attempts.filter((attempt) => attempt.ok && attempt.w === world).length

const bestRun = (attempts: Attempt[]) => {
  let current = 0
  let best = 0
  for (const attempt of attempts) {
    current = attempt.ok ? current + 1 : 0
    best = Math.max(best, current)
  }
  return best
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'a_first', icon: '🌟', max: 1, progress: (kid) => kid.attempts.length, color: 'from-yellow-400 to-amber-500' },
  { id: 'a_let', icon: '🔤', max: 10, progress: (kid) => correct(kid.attempts, 'letters'), color: 'from-purple-400 to-indigo-500' },
  { id: 'a_num', icon: '🔢', max: 10, progress: (kid) => correct(kid.attempts, 'numbers'), color: 'from-emerald-400 to-teal-500' },
  { id: 'a_rd', icon: '📚', max: 10, progress: (kid) => correct(kid.attempts, 'reading'), color: 'from-pink-400 to-rose-500' },
  { id: 'a_dino', icon: '🦴', max: 10, progress: (kid) => correct(kid.attempts, 'dinosaurs'), color: 'from-orange-400 to-red-500' },
  { id: 'a_think', icon: '🧩', max: 10, progress: (kid) => correct(kid.attempts, 'thinking'), color: 'from-cyan-400 to-blue-500' },
  { id: 'a_exp', icon: '🗺️', max: 5, progress: (kid) => new Set(kid.attempts.map((attempt) => attempt.w)).size, color: 'from-sky-400 to-blue-500' },
  { id: 'a_str', icon: '🔥', max: 5, progress: (kid) => bestRun(kid.attempts), color: 'from-orange-400 to-amber-500' },
  { id: 'a_levels', icon: '🏁', max: 10, progress: (kid) => new Set(kid.completedLevels ?? []).size, color: 'from-teal-400 to-emerald-500' },
  { id: 'a_master', icon: '🏆', max: 50, progress: (kid) => new Set(kid.completedLevels ?? []).size, color: 'from-amber-400 to-yellow-500' },
  { id: 'a_practice', icon: '💪', max: 25, progress: (kid) => kid.attempts.length, color: 'from-fuchsia-400 to-purple-500' },
  { id: 'a_perfect', icon: '💯', max: 25, progress: (kid) => kid.attempts.filter((attempt) => attempt.ok).length, color: 'from-lime-400 to-green-500' }
]

export function achievementProgress(kid: Kid, achievement: AchievementDefinition) {
  return Math.min(achievement.progress(kid), achievement.max)
}
