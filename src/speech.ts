import { LANGS, Lang } from './i18n'

const code = (l: Lang) => LANGS.find((x) => x.id === l)!.speech

export function speak(text: string, lang: Lang, pitch = 1.2, onEnd?: () => void) {
  const s = window.speechSynthesis
  if (!s) return onEnd?.()
  s.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = code(lang); u.pitch = pitch; u.rate = 0.92
  const vs = s.getVoices()
  const v = vs.find((x) => x.lang.replace('_', '-').toLowerCase() === code(lang).toLowerCase()) || vs.find((x) => x.lang.toLowerCase().startsWith(lang))
  if (v) u.voice = v
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  s.speak(u)
}

const SR = (): any => (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
export const canListen = () => !!SR()

export function listen(lang: Lang, onText: (s: string) => void, onEnd: () => void) {
  const R = SR()
  if (!R) return onEnd()
  const r = new R()
  r.lang = code(lang); r.interimResults = false
  r.onresult = (e: any) => onText(e.results[0][0].transcript)
  r.onend = onEnd; r.onerror = onEnd
  r.start()
}
