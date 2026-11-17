import { LANGS, Lang } from './i18n'

const code = (l: Lang) => LANGS.find((x) => x.id === l)!.speech
let utteranceId = 0

function bestVoice(voices: SpeechSynthesisVoice[], lang: Lang) {
  const locale = code(lang).toLowerCase()
  const exact = voices.filter((voice) => voice.lang.replace('_', '-').toLowerCase() === locale)
  const sameLanguage = exact.length
    ? exact
    : voices.filter((voice) => voice.lang.replace('_', '-').toLowerCase().startsWith(`${lang}-`))
  const quality = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase()
    const natural = /natural|neural|enhanced|premium|google|microsoft/.test(name) ? 1 : 0
    return (voice.localService ? 4 : 0) + natural + (voice.default ? 0.5 : 0)
  }
  return [...sameLanguage].sort((a, b) => quality(b) - quality(a))[0]
}

export function speak(text: string, lang: Lang, pitch = 1, rate = 0.96, onEnd?: () => void) {
  const currentId = ++utteranceId
  const s = window.speechSynthesis
  if (!s) return onEnd?.()
  s.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = code(lang)
  u.pitch = Math.min(1.5, Math.max(0.62, pitch))
  u.rate = Math.min(1.15, Math.max(0.78, rate))
  const voice = bestVoice(s.getVoices(), lang)
  if (voice) u.voice = voice
  u.onend = () => { if (currentId === utteranceId) onEnd?.() }
  u.onerror = () => { if (currentId === utteranceId) onEnd?.() }
  s.speak(u)
}

export function cancelSpeech() {
  utteranceId += 1
  const s = window.speechSynthesis
  if (s) s.cancel()
}

interface RecognitionResultEvent extends Event {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

interface Recognition {
  lang: string
  interimResults: boolean
  onresult: ((event: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
}

type RecognitionConstructor = new () => Recognition

const SR = () => {
  const browserWindow = window as Window & {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition
}
export const canListen = () => !!SR()

export function listen(lang: Lang, onText: (s: string) => void, onEnd: () => void) {
  const R = SR()
  if (!R) return onEnd()
  const r = new R()
  r.lang = code(lang); r.interimResults = false
  r.onresult = (event) => onText(event.results[0][0].transcript)
  r.onend = onEnd; r.onerror = onEnd
  r.start()
}
