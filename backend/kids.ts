import { randomUUID } from 'node:crypto'
import { AttemptRecord, KidRecord } from './models.js'
import { WorldId } from './companion.js'

const CHARACTERS = new Set(['dino', 'luna', 'pico', 'pandi', 'leo', 'tuga', 'foxy', 'oliva', 'bunny', 'robo'])
const ACCESSORIES = new Set(['hat', 'crown', 'glasses', 'cap'])
const BACKGROUNDS = new Set(['space', 'candy', 'valley'])
const WORLDS = new Set<WorldId>(['letters', 'reading', 'numbers', 'dinosaurs', 'thinking'])
const LEVEL_ID = /^(letters|reading|numbers|dinosaurs|thinking)-(?:[1-9]|10)$/

function isStringList(value: unknown, allowed?: Set<string>): value is string[] {
  return Array.isArray(value) && value.length <= 100
    && value.every((item) => typeof item === 'string' && item.length <= 64 && (!allowed || allowed.has(item)))
}

function parseAttempts(value: unknown): AttemptRecord[] | null {
  if (!Array.isArray(value) || value.length > 5000) return null
  const attempts: AttemptRecord[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') return null
    const attempt = item as Record<string, unknown>
    if (typeof attempt.t !== 'number' || !Number.isFinite(attempt.t)
      || typeof attempt.w !== 'string' || !WORLDS.has(attempt.w as WorldId)
      || typeof attempt.ok !== 'boolean'
      || typeof attempt.ms !== 'number' || !Number.isFinite(attempt.ms) || attempt.ms < 0 || attempt.ms > 3_600_000
      || typeof attempt.l !== 'number' || !Number.isInteger(attempt.l) || attempt.l < 1 || attempt.l > 10) return null
    attempts.push({ t: attempt.t, w: attempt.w as WorldId, ok: attempt.ok, ms: attempt.ms, l: attempt.l })
  }
  return attempts
}

export function sanitizeKid(value: unknown, previous?: KidRecord): KidRecord | null {
  if (!value || typeof value !== 'object') return null
  const body = value as Record<string, unknown>
  const name = typeof body.name === 'string' ? body.name.trim() : previous?.name
  const age = body.age ?? previous?.age
  const character = body.char ?? previous?.char
  const id = previous?.id ?? (typeof body.id === 'string' && /^[\w-]{1,64}$/.test(body.id) ? body.id : randomUUID())
  const stars = body.stars ?? previous?.stars ?? 0
  const coins = body.coins ?? previous?.coins ?? 20
  const accessories = body.acc ?? previous?.acc ?? []
  const backgrounds = body.bgs ?? previous?.bgs ?? []
  const equippedAccessory = body.eqAcc ?? previous?.eqAcc ?? ''
  const equippedBackground = body.bg ?? previous?.bg ?? ''
  const attempts = body.attempts ?? previous?.attempts ?? []
  const completedLevels = body.completedLevels ?? previous?.completedLevels ?? []
  const aiEnabled = previous?.aiEnabled ?? false
  const voiceEnabled = body.voiceEnabled ?? previous?.voiceEnabled ?? true
  const speechRate = body.speechRate ?? previous?.speechRate ?? 1

  if (typeof name !== 'string' || !name || name.length > 32
    || typeof age !== 'number' || !Number.isInteger(age) || age < 3 || age > 8
    || typeof character !== 'string' || !CHARACTERS.has(character)
    || typeof stars !== 'number' || !Number.isInteger(stars) || stars < 0 || stars > 100_000
    || typeof coins !== 'number' || !Number.isInteger(coins) || coins < 0 || coins > 100_000
    || !isStringList(accessories, ACCESSORIES) || !isStringList(backgrounds, BACKGROUNDS)
    || typeof equippedAccessory !== 'string' || (equippedAccessory && !ACCESSORIES.has(equippedAccessory))
    || typeof equippedBackground !== 'string' || (equippedBackground && !BACKGROUNDS.has(equippedBackground))
    || typeof aiEnabled !== 'boolean' || typeof voiceEnabled !== 'boolean'
    || typeof speechRate !== 'number' || !Number.isFinite(speechRate) || speechRate < 0.8 || speechRate > 1.2
    || !Array.isArray(completedLevels) || completedLevels.length > 50
    || !completedLevels.every((level) => typeof level === 'string' && LEVEL_ID.test(level))) return null

  const parsedAttempts = parseAttempts(attempts)
  if (!parsedAttempts) return null

  return {
    id,
    name,
    age,
    char: character,
    stars,
    coins,
    acc: accessories,
    bgs: backgrounds,
    eqAcc: equippedAccessory,
    bg: equippedBackground,
    attempts: parsedAttempts,
    completedLevels,
    aiEnabled,
    voiceEnabled,
    speechRate
  }
}

export function sanitizeLegacyKids(value: unknown): KidRecord[] | null {
  if (!Array.isArray(value) || value.length > 20) return null
  const kids: KidRecord[] = []
  for (const item of value) {
    const kid = sanitizeKid(item)
    if (!kid) return null
    if (kids.some((existing) => existing.id === kid.id)) return null
    kids.push(kid)
  }
  return kids
}

export function sanitizeKidPatch(value: unknown, previous: KidRecord) {
  if (!value || typeof value !== 'object') return null
  const patch = value as Record<string, unknown>
  const allowed = ['name', 'age', 'char', 'stars', 'coins', 'acc', 'bgs', 'eqAcc', 'bg', 'attempts', 'completedLevels', 'voiceEnabled', 'speechRate']
  const merged: Record<string, unknown> = { ...previous }
  for (const key of allowed) {
    if (key in patch) merged[key] = patch[key]
  }
  return sanitizeKid(merged, previous)
}
