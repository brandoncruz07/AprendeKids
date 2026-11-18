import { describe, expect, it } from 'vitest'
import { achievementProgress, ACHIEVEMENTS } from './achievements'
import { newKid } from '../store'

describe('achievement progress', () => {
  it('counts completed levels and caps earned badges at their goal', () => {
    const kid = newKid('Test', 6, 'dino')
    const worlds = ['letters', 'reading', 'numbers', 'dinosaurs', 'thinking']
    kid.completedLevels = worlds.flatMap((world) =>
      Array.from({ length: 10 }, (_, index) => `${world}-${index + 1}`)
    )

    expect(achievementProgress(kid, ACHIEVEMENTS.find((item) => item.id === 'a_levels')!)).toBe(10)
    expect(achievementProgress(kid, ACHIEVEMENTS.find((item) => item.id === 'a_master')!)).toBe(50)
  })

  it('only counts first-try correct answers toward world and perfect-answer awards', () => {
    const kid = newKid('Test', 6, 'dino')
    kid.attempts = [
      { t: 1, w: 'dinosaurs', ok: true, ms: 1000, l: 1 },
      { t: 2, w: 'dinosaurs', ok: false, ms: 1000, l: 1 }
    ]

    expect(achievementProgress(kid, ACHIEVEMENTS.find((item) => item.id === 'a_dino')!)).toBe(1)
    expect(achievementProgress(kid, ACHIEVEMENTS.find((item) => item.id === 'a_perfect')!)).toBe(1)
  })
})
