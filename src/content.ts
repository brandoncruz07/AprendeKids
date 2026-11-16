import { Lang } from './i18n'

export type Q = { p: string; e: string; o: string[]; a: number } // pregunta, dibujo grande, opciones, índice correcto

const WORDS: Record<Lang, [string, string][]> = {
  es: [['SOL', '☀️'], ['GATO', '🐱'], ['CASA', '🏠'], ['LUNA', '🌙'], ['PERRO', '🐶'], ['PATO', '🦆'], ['FLOR', '🌸'], ['MESA', '🪑']],
  en: [['SUN', '☀️'], ['CAT', '🐱'], ['HOUSE', '🏠'], ['MOON', '🌙'], ['DOG', '🐶'], ['DUCK', '🦆'], ['FLOWER', '🌸'], ['TABLE', '🪑']],
  pt: [['SOL', '☀️'], ['GATO', '🐱'], ['CASA', '🏠'], ['LUA', '🌙'], ['CACHORRO', '🐶'], ['PATO', '🦆'], ['FLOR', '🌸'], ['MESA', '🪑']],
}
const r = (n: number) => Math.floor(Math.random() * n)
const shuf = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
const uniq = <T,>(a: T[]) => [...new Set(a)]
// mezcla la respuesta correcta con distractores y devuelve la pregunta lista
const mk = (p: string, e: string, ans: string, wrong: string[]): Q => {
  const o = shuf([ans, ...shuf(uniq(wrong).filter((x) => x !== ans)).slice(0, 2)])
  return { p, e, o, a: o.indexOf(ans) }
}

export function genQ(world: string, lang: Lang, lvl: number, t: (k: string) => string): Q {
  const W = WORDS[lang]
  const [w, e] = W[r(W.length)]
  if (world === 'letters') {
    if (lvl < 2) return mk(t('ql1'), e, w[0], W.map((x) => x[0][0]))
    const k = 1 + r(w.length - 1)
    return mk(t('ql2'), `${e}  ${w.slice(0, k)}_${w.slice(k + 1)}`, w[k], [...'ABCEILMNOPRSTU'])
  }
  if (world === 'reading') {
    if (lvl < 2) return mk(t('qr1'), e, w, W.map((x) => x[0]))
    return mk(t('qr2'), w, e, W.map((x) => x[1]))
  }
  if (world === 'numbers') {
    let ans: number, big: string, p = t('qn2')
    if (lvl < 2) { ans = 1 + r(5); big = '🍎'.repeat(ans); p = t('qn1') }
    else if (lvl < 3 || Math.random() < 0.5) { const a = 1 + r(9), b = r(10 - a) + 1; ans = a + b; big = `${a} + ${b}` }
    else { const a = 5 + r(16), b = 1 + r(a); ans = a - b; big = `${a} − ${b}` }
    return mk(p, big, String(ans), [ans + 1, ans + 2, ans - 1, ans - 2].filter((x) => x >= 0).map(String))
  }
  if (world === 'dinosaurs') {
    const s = shuf(['🦕', '🦖', '🥚', '🌋', '🌴']).slice(0, 3)
    const pat = lvl < 2 ? [0, 1] : lvl < 3 ? [0, 0, 1] : [0, 1, 2]
    const seq = [...pat, ...pat].map((i) => s[i])
    const ans = seq[seq.length - 1]
    return mk(t('qd'), seq.slice(0, -1).join(' ') + ' ❓', ans, s)
  }
  // thinking: ¿cuál es diferente?
  const [a, b] = shuf(['🦁', '🐼', '🦜', '🐢', '🐶', '🐱']).slice(0, 2)
  const o = shuf([a, a, a, b])
  return { p: t('qt'), e: '🤔', o, a: o.indexOf(b) }
}
