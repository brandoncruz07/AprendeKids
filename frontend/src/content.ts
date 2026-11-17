import { Lang } from './i18n'
import type { WorldId } from './data/levelData'

export type Q = { p: string; e: string; o: string[]; a: number } // pregunta, dibujo grande, opciones, índice correcto

const WORDS: Record<Lang, [string, string][]> = {
  es: [['SOL', '☀️'], ['GATO', '🐱'], ['CASA', '🏠'], ['LUNA', '🌙'], ['PERRO', '🐶'], ['PATO', '🦆'], ['FLOR', '🌸'], ['MESA', '🪑']],
  en: [['SUN', '☀️'], ['CAT', '🐱'], ['HOUSE', '🏠'], ['MOON', '🌙'], ['DOG', '🐶'], ['DUCK', '🦆'], ['FLOWER', '🌸'], ['TABLE', '🪑']],
  pt: [['SOL', '☀️'], ['GATO', '🐱'], ['CASA', '🏠'], ['LUA', '🌙'], ['CACHORRO', '🐶'], ['PATO', '🦆'], ['FLOR', '🌸'], ['MESA', '🪑']],
  fr: [['SOLEIL', '☀️'], ['CHAT', '🐱'], ['MAISON', '🏠'], ['LUNE', '🌙'], ['CHIEN', '🐶'], ['CANARD', '🦆'], ['FLEUR', '🌸'], ['TABLE', '🪑']],
  de: [['SONNE', '☀️'], ['KATZE', '🐱'], ['HAUS', '🏠'], ['MOND', '🌙'], ['HUND', '🐶'], ['ENTE', '🦆'], ['BLUME', '🌸'], ['TISCH', '🪑']],
  zh: [['太阳', '☀️'], ['小猫', '🐱'], ['房子', '🏠'], ['月亮', '🌙'], ['小狗', '🐶'], ['鸭子', '🦆'], ['花朵', '🌸'], ['桌子', '🪑']],
  hi: [['सूरज', '☀️'], ['बिल्ली', '🐱'], ['घर', '🏠'], ['चाँद', '🌙'], ['कुत्ता', '🐶'], ['बतख', '🦆'], ['फूल', '🌸'], ['मेज़', '🪑']],
  ar: [['شمس', '☀️'], ['قطة', '🐱'], ['منزل', '🏠'], ['قمر', '🌙'], ['كلب', '🐶'], ['بطة', '🦆'], ['زهرة', '🌸'], ['طاولة', '🪑']],
  ja: [['たいよう', '☀️'], ['ねこ', '🐱'], ['いえ', '🏠'], ['つき', '🌙'], ['いぬ', '🐶'], ['あひる', '🦆'], ['はな', '🌸'], ['つくえ', '🪑']],
  ko: [['해', '☀️'], ['고양이', '🐱'], ['집', '🏠'], ['달', '🌙'], ['강아지', '🐶'], ['오리', '🦆'], ['꽃', '🌸'], ['탁자', '🪑']],
}

const THEME_WORDS: Partial<Record<WorldId, Record<Lang, [string, string][]>>> = {
  numbers: {
    es: [['UNO', '1️⃣'], ['DOS', '2️⃣'], ['TRES', '3️⃣'], ['CUATRO', '4️⃣'], ['CINCO', '5️⃣'], ['SEIS', '6️⃣']],
    en: [['ONE', '1️⃣'], ['TWO', '2️⃣'], ['THREE', '3️⃣'], ['FOUR', '4️⃣'], ['FIVE', '5️⃣'], ['SIX', '6️⃣']],
    pt: [['UM', '1️⃣'], ['DOIS', '2️⃣'], ['TRÊS', '3️⃣'], ['QUATRO', '4️⃣'], ['CINCO', '5️⃣'], ['SEIS', '6️⃣']],
    fr: [['UN', '1️⃣'], ['DEUX', '2️⃣'], ['TROIS', '3️⃣'], ['QUATRE', '4️⃣'], ['CINQ', '5️⃣'], ['SIX', '6️⃣']],
    de: [['EINS', '1️⃣'], ['ZWEI', '2️⃣'], ['DREI', '3️⃣'], ['VIER', '4️⃣'], ['FÜNF', '5️⃣'], ['SECHS', '6️⃣']],
    zh: [['一', '1️⃣'], ['二', '2️⃣'], ['三', '3️⃣'], ['四', '4️⃣'], ['五', '5️⃣'], ['六', '6️⃣']],
    hi: [['एक', '1️⃣'], ['दो', '2️⃣'], ['तीन', '3️⃣'], ['चार', '4️⃣'], ['पाँच', '5️⃣'], ['छह', '6️⃣']],
    ar: [['واحد', '1️⃣'], ['اثنان', '2️⃣'], ['ثلاثة', '3️⃣'], ['أربعة', '4️⃣'], ['خمسة', '5️⃣'], ['ستة', '6️⃣']],
    ja: [['いち', '1️⃣'], ['に', '2️⃣'], ['さん', '3️⃣'], ['よん', '4️⃣'], ['ご', '5️⃣'], ['ろく', '6️⃣']],
    ko: [['하나', '1️⃣'], ['둘', '2️⃣'], ['셋', '3️⃣'], ['넷', '4️⃣'], ['다섯', '5️⃣'], ['여섯', '6️⃣']]
  },
  dinosaurs: {
    es: [['DINOSAURIO', '🦖'], ['HUEVO', '🥚'], ['FÓSIL', '🦴'], ['HUELLA', '🐾'], ['VOLCÁN', '🌋'], ['DIENTE', '🦷']],
    en: [['DINOSAUR', '🦖'], ['EGG', '🥚'], ['FOSSIL', '🦴'], ['FOOTPRINT', '🐾'], ['VOLCANO', '🌋'], ['TOOTH', '🦷']],
    pt: [['DINOSSAURO', '🦖'], ['OVO', '🥚'], ['FÓSSIL', '🦴'], ['PEGADA', '🐾'], ['VULCÃO', '🌋'], ['DENTE', '🦷']],
    fr: [['DINOSAURE', '🦖'], ['ŒUF', '🥚'], ['FOSSILE', '🦴'], ['EMPREINTE', '🐾'], ['VOLCAN', '🌋'], ['DENT', '🦷']],
    de: [['DINOSAURIER', '🦖'], ['EI', '🥚'], ['FOSSIL', '🦴'], ['FÄHRTE', '🐾'], ['VULKAN', '🌋'], ['ZAHN', '🦷']],
    zh: [['恐龙', '🦖'], ['蛋', '🥚'], ['化石', '🦴'], ['脚印', '🐾'], ['火山', '🌋'], ['牙齿', '🦷']],
    hi: [['डायनासोर', '🦖'], ['अंडा', '🥚'], ['जीवाश्म', '🦴'], ['पदचिह्न', '🐾'], ['ज्वालामुखी', '🌋'], ['दाँत', '🦷']],
    ar: [['ديناصور', '🦖'], ['بيضة', '🥚'], ['أحفورة', '🦴'], ['أثر', '🐾'], ['بركان', '🌋'], ['سن', '🦷']],
    ja: [['きょうりゅう', '🦖'], ['たまご', '🥚'], ['かせき', '🦴'], ['あしあと', '🐾'], ['かざん', '🌋'], ['は', '🦷']],
    ko: [['공룡', '🦖'], ['알', '🥚'], ['화석', '🦴'], ['발자국', '🐾'], ['화산', '🌋'], ['이빨', '🦷']]
  },
  thinking: {
    es: [['CÍRCULO', '⚪'], ['ESTRELLA', '⭐'], ['TRIÁNGULO', '🔺'], ['ROMBO', '🔷'], ['CUADRADO', '🟦'], ['ÓVALO', '🥚']],
    en: [['CIRCLE', '⚪'], ['STAR', '⭐'], ['TRIANGLE', '🔺'], ['DIAMOND', '🔷'], ['SQUARE', '🟦'], ['OVAL', '🥚']],
    pt: [['CÍRCULO', '⚪'], ['ESTRELA', '⭐'], ['TRIÂNGULO', '🔺'], ['LOSANGO', '🔷'], ['QUADRADO', '🟦'], ['OVAL', '🥚']],
    fr: [['CERCLE', '⚪'], ['ÉTOILE', '⭐'], ['TRIANGLE', '🔺'], ['LOSANGE', '🔷'], ['CARRÉ', '🟦'], ['OVALE', '🥚']],
    de: [['KREIS', '⚪'], ['STERN', '⭐'], ['DREIECK', '🔺'], ['RAUTE', '🔷'], ['QUADRAT', '🟦'], ['OVAL', '🥚']],
    zh: [['圆形', '⚪'], ['星形', '⭐'], ['三角形', '🔺'], ['菱形', '🔷'], ['正方形', '🟦'], ['椭圆', '🥚']],
    hi: [['वृत्त', '⚪'], ['तारा', '⭐'], ['त्रिभुज', '🔺'], ['हीरा', '🔷'], ['वर्ग', '🟦'], ['अंडाकार', '🥚']],
    ar: [['دائرة', '⚪'], ['نجمة', '⭐'], ['مثلث', '🔺'], ['معين', '🔷'], ['مربع', '🟦'], ['بيضاوي', '🥚']],
    ja: [['まる', '⚪'], ['ほし', '⭐'], ['さんかく', '🔺'], ['ひしがた', '🔷'], ['しかく', '🟦'], ['だえん', '🥚']],
    ko: [['동그라미', '⚪'], ['별', '⭐'], ['세모', '🔺'], ['마름모', '🔷'], ['정사각형', '🟦'], ['타원', '🥚']]
  }
}

export const splitLetters = (word: string) => word.normalize('NFC').match(/\P{M}\p{M}*/gu) ?? Array.from(word)
export const getWords = (lang: Lang) => WORDS[lang]
export const getGameWords = (world: WorldId, lang: Lang) => THEME_WORDS[world]?.[lang] ?? WORDS[lang]
const r = (n: number) => Math.floor(Math.random() * n)
const shuf = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
const uniq = <T,>(a: T[]) => [...new Set(a)]
// mezcla la respuesta correcta con distractores y devuelve la pregunta lista
const mk = (p: string, e: string, ans: string, wrong: string[]): Q => {
  const o = shuf([ans, ...shuf(uniq(wrong).filter((x) => x !== ans)).slice(0, 2)])
  return { p, e, o, a: o.indexOf(ans) }
}

export function genQ(world: string, lang: Lang, lvl: number, t: (k: string) => string, sequenceLevel = 1): Q {
  const W = WORDS[lang]
  const [w, e] = W[r(W.length)]
  if (world === 'letters') {
    if (sequenceLevel <= 2 || (sequenceLevel >= 7 && lvl < 2)) {
      return mk(t('ql1'), e, splitLetters(w)[0], W.map((x) => splitLetters(x[0])[0]))
    }
    const letters = splitLetters(w)
    if (letters.length < 2) return mk(t('ql1'), e, letters[0], W.map((x) => splitLetters(x[0])[0]))
    const k = 1 + r(letters.length - 1)
    return mk(t('ql2'), `${e}  ${letters.slice(0, k).join('')}_${letters.slice(k + 1).join('')}`, letters[k], W.map((x) => splitLetters(x[0])[0]))
  }
  if (world === 'reading') {
    if (sequenceLevel <= 3 || (sequenceLevel >= 7 && lvl < 2)) return mk(t('qr1'), e, w, W.map((x) => x[0]))
    return mk(t('qr2'), w, e, W.map((x) => x[1]))
  }
  if (world === 'numbers') {
    let ans: number, big: string, p = t('qn2')
    if (sequenceLevel <= 2 || lvl < 2) { ans = 1 + r(5); big = '🍎'.repeat(ans); p = t('qn1') }
    else if (sequenceLevel <= 5 || lvl < 3 || Math.random() < 0.5) { const a = 1 + r(9), b = r(10 - a) + 1; ans = a + b; big = `${a} + ${b}` }
    else { const a = 5 + r(16), b = 1 + r(a); ans = a - b; big = `${a} − ${b}` }
    return mk(p, big, String(ans), [ans + 1, ans + 2, ans - 1, ans - 2].filter((x) => x >= 0).map(String))
  }
  if (world === 'dinosaurs') {
    const s = shuf(['🦕', '🦖', '🥚', '🌋', '🌴']).slice(0, 3)
    const pat = sequenceLevel < 3 || lvl < 2 ? [0, 1] : sequenceLevel < 6 || lvl < 3 ? [0, 0, 1] : [0, 1, 2]
    const seq = [...pat, ...pat].map((i) => s[i])
    const ans = seq[seq.length - 1]
    return mk(t('qd'), seq.slice(0, -1).join(' ') + ' ❓', ans, s)
  }
  // thinking: ¿cuál es diferente?
  const [a, b] = shuf(['⚪', '⭐', '🔺', '🔷', '🟩', '🔶']).slice(0, 2)
  const optionCount = Math.min(8, 4 + Math.floor((sequenceLevel - 1) / 2))
  const o = shuf([...Array.from({ length: optionCount - 1 }, () => a), b])
  return { p: t('qt'), e: '🧩', o, a: o.indexOf(b) }
}
