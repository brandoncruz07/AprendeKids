export type Attempt = { t: number; w: string; ok: boolean; ms: number; l: number } // fecha, mundo, acierto a la 1ª, ms, nivel
export type Kid = {
  id: string; name: string; age: number; char: string
  stars: number; coins: number; acc: string[]; bgs: string[]; eqAcc: string; bg: string
  attempts: Attempt[]; completedLevels?: string[]
  aiEnabled?: boolean; voiceEnabled?: boolean; speechRate?: number
}
export type Acct = { id: string; name: string; email: string; kids: Kid[] }
export type LegacyAcct = Acct & { salt: string; hash: string }

const DB = 'ak_db'
export const loadDb = (): LegacyAcct[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(DB) || '[]')
    return Array.isArray(stored) ? stored as LegacyAcct[] : []
  } catch {
    return []
  }
}
export const uid = () => Math.random().toString(36).slice(2, 10)

export const newKid = (name: string, age: number, char: string): Kid =>
  ({ id: uid(), name, age, char, stars: 0, coins: 20, acc: [], bgs: [], eqAcc: '', bg: '', attempts: [], completedLevels: [], aiEnabled: false, voiceEnabled: true, speechRate: 1 })

// Dificultad adaptativa: según los últimos 10 intentos del mundo
export function levelFor(a: Attempt[], world: string) {
  const r = a.filter((x) => x.w === world).slice(-10)
  if (r.length < 5) return 1
  const p = r.filter((x) => x.ok).length / r.length
  return p >= 0.85 ? 3 : p >= 0.6 ? 2 : 1
}
