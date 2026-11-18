import { replyForMessage } from '../shared/companion-responses.js'
import type { CompanionLanguage, WorldId } from '../shared/companion-responses.js'

export type { CompanionLanguage, WorldId } from '../shared/companion-responses.js'
export type AgeBand = '3-4' | '5-6' | '7-8'
export type Activity = 'quiz' | 'word' | 'memory' | 'matching' | 'counting' | 'sequence' | 'search' | 'story' | 'compare' | 'challenge'

export interface CompanionInput {
  kidId: string
  message: string
  language: CompanionLanguage
  ageBand: AgeBand
  worldId?: WorldId
  activity?: Activity
}

const LANGUAGES: CompanionLanguage[] = ['es', 'en', 'pt', 'fr', 'de', 'zh', 'hi', 'ar', 'ja', 'ko']
const AGE_BANDS: AgeBand[] = ['3-4', '5-6', '7-8']
const WORLD_IDS: WorldId[] = ['letters', 'reading', 'numbers', 'dinosaurs', 'thinking']
const ACTIVITIES: Activity[] = ['quiz', 'word', 'memory', 'matching', 'counting', 'sequence', 'search', 'story', 'compare', 'challenge']

const PERSONAL_INFO_PATTERNS = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\b(?:my (?:full )?name is|i am called|i live at|my address is|my phone number is|my school is|mi nombre es|me llamo|vivo en|mi direccion es|mi telefono es|mi colegio es|meu nome e|me chamo|moro em|mon nom est|j'habite|ich heiße|ich wohne in|meine adresse ist)\b/i,
  /\b(?:\+?\d[\s().-]*){8,}\b/,
  /(?:住所|電話番号|名前は|学校は|주소|전화번호|이름은|학교는|地址|电话号码|我的名字是|عنواني|رقم هاتفي|اسم مدرستي|मेरा नाम|मेरा पता|मेरा फोन)/
]

const SAFETY_PATTERNS = [
  /\b(?:hurt|hit|bully|bullying|abuse|scared|afraid|fear|danger|unsafe|harass|threat|help me|someone hurts me|someone hit me|miedo|asust|maltrato|lastim|pegan|pega|golpea|empuja|me hacen daño|me pegan|me asusta|tengo miedo|medo|machuc|me bate|me machuca|assust|peur|harcelement|me frappe|angst|tut mir weh|schlagt mich)\b/i,
  /欺负|打我|害怕|伤害|被打|危险|いじめ|こわい|怖い|ぶたれ|嫌がらせ|때려|괴롭|무서|다쳤|受伤|危险|خائف|أخاف|ضرب|خطر|डर|मारते|सताते|चोट/
]

export function parseCompanionInput(value: unknown): CompanionInput | null {
  if (!value || typeof value !== 'object') return null
  const body = value as Record<string, unknown>
  const kidId = typeof body.kidId === 'string' && /^[\w-]{1,64}$/.test(body.kidId) ? body.kidId : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!kidId || !message || message.length > 200) return null
  if (!LANGUAGES.includes(body.language as CompanionLanguage)) return null
  if (!AGE_BANDS.includes(body.ageBand as AgeBand)) return null
  if (body.worldId !== undefined && !WORLD_IDS.includes(body.worldId as WorldId)) return null
  if (body.activity !== undefined && !ACTIVITIES.includes(body.activity as Activity)) return null

  return {
    kidId,
    message,
    language: body.language as CompanionLanguage,
    ageBand: body.ageBand as AgeBand,
    ...(body.worldId ? { worldId: body.worldId as WorldId } : {}),
    ...(body.activity ? { activity: body.activity as Activity } : {})
  }
}

const normalize = (message: string) => message.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

export function containsPersonalInfo(message: string) {
  return PERSONAL_INFO_PATTERNS.some((pattern) => pattern.test(normalize(message)) || pattern.test(message))
}

export function containsSafetyConcern(message: string) {
  const normalized = normalize(message)
  return SAFETY_PATTERNS.some((pattern) => pattern.test(normalized) || pattern.test(message))
}

export function getCompanionReply(input: CompanionInput) {
  if (containsPersonalInfo(input.message)) return replyForMessage('privacy', input.language)
  if (containsSafetyConcern(input.message)) return replyForMessage('care', input.language)
  return replyForMessage(input.message, input.language, input.worldId)
}
