import { describe, expect, it } from 'vitest'
import {
  CompanionInput,
  containsPersonalInfo,
  containsSafetyConcern,
  getCompanionReply,
  parseCompanionInput
} from './companion'
import { COMPANION_CONVERSATIONS } from '../shared/companion-responses'

const input: CompanionInput = {
  kidId: 'kid-1',
  message: 'Can you suggest a word game?',
  language: 'en',
  ageBand: '5-6',
  worldId: 'letters',
  activity: 'word'
}

describe('offline companion safeguards and conversations', () => {
  it('accepts only validated fields and rejects oversized messages', () => {
    expect(parseCompanionInput({ ...input, childName: 'not sent' })).toEqual(input)
    expect(parseCompanionInput({ ...input, message: 'x'.repeat(201) })).toBeNull()
    expect(parseCompanionInput({ ...input, language: 'unknown' })).toBeNull()
  })

  it('detects personal information before selecting a reply', () => {
    expect(containsPersonalInfo('My email is child@example.com')).toBe(true)
    expect(containsPersonalInfo('Me llamo Ana')).toBe(true)
    expect(containsPersonalInfo('Can we play a memory game?')).toBe(false)
    expect(getCompanionReply({ ...input, message: 'Me llamo Ana', language: 'es' })).toContain('No compartas')
  })

  it('directs a child who reports harm to a trusted adult', () => {
    expect(containsSafetyConcern('Me pegan en el colegio')).toBe(true)
    expect(getCompanionReply({ ...input, message: 'Me pegan en el colegio', language: 'es' }))
      .toContain('de confianza')
    expect(containsSafetyConcern('Can we count the dinosaurs?')).toBe(false)
  })

  it('uses the active world and recognizes greetings before game context', () => {
    expect(getCompanionReply({ ...input, message: 'Give me an idea' })).toMatch(/letters/i)
    expect(getCompanionReply({ ...input, message: 'hello' })).toMatch(/Hello|Hi/)
    expect(getCompanionReply({ ...input, message: 'I like dinosaurs', worldId: undefined })).toContain('Dinosaur Valley')
  })

  it('provides local generic conversations in every supported language', () => {
    for (const language of ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi', 'ar', 'ja', 'ko'] as const) {
      expect(getCompanionReply({ ...input, language, worldId: 'thinking' }).trim()).not.toBe('')
      expect(COMPANION_CONVERSATIONS[language].default.length).toBeGreaterThan(0)
    }
  })

  it('returns a deterministic response for the same message', () => {
    expect(getCompanionReply(input)).toBe(getCompanionReply(input))
  })
})
