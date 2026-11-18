import { describe, expect, it } from 'vitest'
import { sanitizeKidPatch, sanitizeLegacyKids } from './kids'

const profile = {
  id: 'kid-1',
  name: 'Sofi',
  age: 5,
  char: 'dino',
  stars: 12,
  coins: 25,
  acc: [],
  bgs: [],
  eqAcc: '',
  bg: '',
  attempts: [{ t: 1, w: 'letters', ok: true, ms: 1200, l: 1 }],
  completedLevels: ['letters-1'],
  aiEnabled: true,
  voiceEnabled: true,
  speechRate: 1
}

describe('child profile validation', () => {
  it('imports valid progress without carrying over the legacy AI opt-in', () => {
    const imported = sanitizeLegacyKids([profile])
    expect(imported?.[0]).toMatchObject({
      id: 'kid-1',
      stars: 12,
      completedLevels: ['letters-1'],
      aiEnabled: false
    })
  })

  it('rejects invalid attempt worlds and level identifiers', () => {
    expect(sanitizeLegacyKids([{ ...profile, attempts: [{ ...profile.attempts[0], w: 'unknown' }] }])).toBeNull()
    expect(sanitizeLegacyKids([{ ...profile, completedLevels: ['numbers-99'] }])).toBeNull()
  })

  it('accepts new shop items and rejects unknown equipment identifiers', () => {
    expect(sanitizeLegacyKids([{
      ...profile,
      acc: ['headphones', 'backpack'],
      bgs: ['forest', 'rainbow'],
      eqAcc: 'glasses',
      bg: 'forest'
    }])?.[0]).toMatchObject({
      acc: ['headphones', 'backpack'],
      bgs: ['forest', 'rainbow'],
      eqAcc: 'glasses',
      bg: 'forest'
    })
    expect(sanitizeLegacyKids([{ ...profile, acc: ['unknown-item'] }])).toBeNull()
  })

  it('does not allow a regular profile update to enable AI', () => {
    const previous = sanitizeLegacyKids([profile])?.[0]
    if (!previous) throw new Error('Expected the test profile to pass validation')
    expect(sanitizeKidPatch({ aiEnabled: true, voiceEnabled: false }, previous)).toMatchObject({
      aiEnabled: false,
      voiceEnabled: false
    })
  })
})
