// Runtime validation coverage for: level progression and generated quiz questions.
import { describe, expect, it } from 'vitest'
import { genQ, getGameWords } from '../content'
import { LANGS } from '../i18n'
import { activityLabelKey, WORLD_LEVELS, type WorldId } from './levelData'
import { CHARACTERS } from './gameData'
import { getLevelExample } from './levelGuide'
import { getAgeDifficultyOffset } from './levelDifficulty'

const worlds = Object.keys(WORLD_LEVELS) as WorldId[]
const translate = (key: string) => key

describe('learning progression', () => {
  it('provides ten uniquely identified and varied activities in every world', () => {
    for (const world of worlds) {
      const levels = WORLD_LEVELS[world]
      expect(levels).toHaveLength(10)
      expect(new Set(levels.map((level) => level.id)).size).toBe(10)
      expect(new Set(levels.map((level) => level.activity)).size).toBe(10)
      expect(levels.every((level) => level.icon)).toBe(true)
      expect(levels.every((level) => level.moduleCount >= 5)).toBe(true)
      expect(levels.find((level) => level.activity === 'challenge')?.moduleCount).toBe(8)
    }
  })

  it('offers ten selectable languages and answerable questions in each one', () => {
    expect(LANGS).toHaveLength(10)
    expect(new Set(LANGS.map((language) => language.id)).size).toBe(10)
    for (const world of worlds) {
      for (const { id: lang } of LANGS) {
        for (const sequenceLevel of [1, 4, 8]) {
          const question = genQ(world, lang, 3, translate, sequenceLevel)
          expect(question.p).toBeTruthy()
          expect(question.o.length).toBeGreaterThan(1)
          expect(Number.isInteger(question.a)).toBe(true)
          expect(question.a).toBeGreaterThanOrEqual(0)
          expect(question.a).toBeLessThan(question.o.length)
          expect(question.o[question.a]).toBeTruthy()
        }
      }
    }
  })

  it('provides ten companions with distinct voice profiles', () => {
    expect(CHARACTERS).toHaveLength(10)
    expect(new Set(CHARACTERS.map((character) => character.id)).size).toBe(10)
    expect(new Set(CHARACTERS.map((character) => character.pitch)).size).toBe(10)
    expect(new Set(CHARACTERS.map((character) => character.rate)).size).toBe(10)
  })

  it('uses themed vocabulary for number, dinosaur, and thinking worlds in all languages', () => {
    for (const world of ['numbers', 'dinosaurs', 'thinking'] as const) {
      for (const { id: lang } of LANGS) {
        const words = getGameWords(world, lang)
        expect(words).toHaveLength(6)
        expect(words.every(([word, symbol]) => word.length > 0 && symbol.length > 0)).toBe(true)
        expect(new Set(words.map(([, symbol]) => symbol)).size).toBe(6)
      }
    }
  })

  it('labels word and comparison activities for their world', () => {
    expect(activityLabelKey('numbers', 'word')).toBe('game_number_word')
    expect(activityLabelKey('dinosaurs', 'word', '_hint')).toBe('game_dinosaur_word_hint')
    expect(activityLabelKey('thinking', 'word')).toBe('game_thinking_word')
    expect(activityLabelKey('letters', 'compare')).toBe('game_letter_compare')
    expect(activityLabelKey('reading', 'compare')).toBe('game_reading_compare')
  })

  it('uses shapes rather than animals for thinking-world questions', () => {
    const question = genQ('thinking', 'es', 3, translate, 4)
    expect(question.e).toBe('🧩')
    expect(question.o.every((option) => ['⚪', '⭐', '🔺', '🔷', '🟩', '🔶'].includes(option))).toBe(true)
    expect(new Set(question.o).size).toBe(2)
    expect(question.o.filter((option) => option === question.o[question.a])).toHaveLength(1)
  })

  it('provides an example for every level in every supported language', () => {
    for (const world of worlds) {
      for (const level of WORLD_LEVELS[world]) {
        for (const { id: lang } of LANGS) {
          expect(getLevelExample(world, level.activity, lang).trim()).not.toBe('')
        }
      }
    }
  })

  it('labels comparison games according to their world', () => {
    expect(activityLabelKey('numbers', 'compare')).toBe('game_number_compare')
    expect(activityLabelKey('dinosaurs', 'compare')).toBe('game_dinosaur_compare')
    expect(activityLabelKey('thinking', 'compare')).toBe('game_thinking_compare')
  })

  it('scales the difficulty baseline to the child age', () => {
    expect([3, 4].map(getAgeDifficultyOffset)).toEqual([-1, -1])
    expect([5, 6].map(getAgeDifficultyOffset)).toEqual([0, 0])
    expect([7, 8].map(getAgeDifficultyOffset)).toEqual([1, 1])
  })
})
