// Persistencia local (localStorage). Para producción: reemplazar por un backend real.
export type Attempt = { t: number; w: string; ok: boolean; ms: number; l: number } // fecha, mundo, acierto a la 1ª, ms, nivel
export type Kid = {
  id: string; name: string; age: number; char: string
  stars: number; coins: number; acc: string[]; bgs: string[]; eqAcc: string; bg: string
  attempts: Attempt[]
}
export type Acct = { id: string; name: string; email: string; salt: string; hash: string; kids: Kid[] }

const DB = 'ak_db', SESS = 'ak_sess'
export const loadDb = (): Acct[] => { try { return JSON.parse(localStorage.getItem(DB) || '[]') } catch { return [] } }
export const saveDb = (d: Acct[]) => { try { localStorage.setItem(DB, JSON.stringify(d)) } catch {} }
export const getSess = () => { try { return localStorage.getItem(SESS) } catch { return null } }
export const setSess = (id: string | null) => { try { id ? localStorage.setItem(SESS, id) : localStorage.removeItem(SESS) } catch {} }
export const uid = () => Math.random().toString(36).slice(2, 10)

export async function hashPw(pw: string, salt: string) {
  const s = salt + pw
  if (crypto.subtle) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
    return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('')
  }
  return btoa(encodeURIComponent(s)) // respaldo en contextos sin HTTPS
}

export const newKid = (name: string, age: number, char: string): Kid =>
  ({ id: uid(), name, age, char, stars: 0, coins: 20, acc: [], bgs: [], eqAcc: '', bg: '', attempts: [] })

// Dificultad adaptativa: según los últimos 10 intentos del mundo
export function levelFor(a: Attempt[], world: string) {
  const r = a.filter((x) => x.w === world).slice(-10)
  if (r.length < 5) return 1
  const p = r.filter((x) => x.ok).length / r.length
  return p >= 0.85 ? 3 : p >= 0.6 ? 2 : 1
}
