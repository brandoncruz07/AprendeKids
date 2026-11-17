import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode, PointerEvent, KeyboardEvent } from 'react'
import { Mic, Send, Volume2, VolumeX, MessageCircle, LoaderCircle } from 'lucide-react'
import { Character, SHOP_ITEMS } from '../data/gameData'
import { Kid } from '../store'
import { useI18n } from '../i18n'
import { speak, listen, canListen, cancelSpeech } from '../speech'
import { WORLD_LEVELS, WorldId } from '../data/levelData'
import { CharacterAvatar } from './CharacterAvatar'
import { apiRequest, ApiError } from '../api'

type Bot = { say: (m: string) => void; hi: () => void; ok: () => void; no: () => void; win: () => void }
const Ctx = createContext<Bot>({ say() {}, hi() {}, ok() {}, no() {}, win() {} })
export const useCompanion = () => useContext(Ctx)

const PRIVACY_PATTERNS = [
  /\b(name|address|phone|telephone|email|password|school|where.*live|nombre|direccion|telefono|correo|colegio|donde vivo|nome|endereco|telefone|escola)\b/,
  /姓名|住址|地址|电话|邮箱|学校|家在哪|नाम|पता|फोन|ईमेल|स्कूल|اسم|عنوان|هاتف|بريد|مدرسة/,
  /名前|住所|電話|メール|学校|이름|주소|전화|이메일|학교/
]

const CARE_PATTERNS = [
  /\b(hurt|hit|bully|bullying|abuse|scared|afraid|fear|miedo|asust|maltrato|lastim|pegan|machuc|medo|machucad|assust)\b/,
  /欺负|打我|害怕|伤害|いじめ|こわい|怖い|때려|괴롭|무서|害怕|受伤|خائف|أخاف|ضرب/
]

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

export function Companion({ kid, char, children, worldId, levelNumber, onVoiceEnabledChange }: {
  kid: Kid
  char: Character
  children: ReactNode
  worldId?: WorldId | null
  levelNumber?: number | null
  onVoiceEnabledChange: (enabled: boolean) => void
}) {
  const { t, lang } = useI18n()
  const [msg, setMsg] = useState('')
  const [mood, setMood] = useState('')
  const [mute, setMute] = useState(kid.voiceEnabled === false)
  const [open, setOpen] = useState(false)
  const [txt, setTxt] = useState('')
  const [mic, setMic] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [position, setPosition] = useState(() => ({
    left: Math.max(8, window.innerWidth - 180),
    top: Math.max(88, window.innerHeight - 236)
  }))
  const timer = useRef<number>(0)
  const dragOffset = useRef<{ x: number; y: number } | null>(null)
  const hasDragged = useRef(false)
  const acc = SHOP_ITEMS.find((i) => i.id === kid.eqAcc)?.icon

  useEffect(() => setMute(kid.voiceEnabled === false), [kid.voiceEnabled])

  useEffect(() => {
    const keepOnScreen = () => setPosition((current) => ({
      left: Math.min(current.left, Math.max(8, window.innerWidth - 176)),
      top: Math.min(current.top, Math.max(80, window.innerHeight - 196))
    }))
    window.addEventListener('resize', keepOnScreen)
    return () => window.removeEventListener('resize', keepOnScreen)
  }, [])

  const say = useCallback((m: string, mo = 'talk') => {
    setMsg(m); setMood(mo)
    setSpeaking(false)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => { setMsg(''); setMood('') }, 6500)
    if (!mute && kid.voiceEnabled !== false) {
      setSpeaking(true)
      speak(m, lang, char.pitch, char.rate * (kid.speechRate ?? 1), () => { setMood(''); setSpeaking(false) })
    }
  }, [mute, lang, char.pitch, char.rate, kid.voiceEnabled, kid.speechRate])

  const line = (k: string) => {
    const a = t(k, { n: kid.name, c: char.name }).split('|')
    return a[Math.floor(Math.random() * a.length)]
  }
  const bot: Bot = {
    say: (m) => say(m), hi: () => say(line('hi')), ok: () => say(line('ok'), 'jump'),
    no: () => say(line('no')), win: () => say(line('win'), 'jump'),
  }
  const chat = async (s: string) => {
    const normalized = normalize(s)
    if (PRIVACY_PATTERNS.some((pattern) => pattern.test(normalized) || pattern.test(s.toLowerCase()))) {
      return say(t('chat_privacy'), 'talk')
    }
    if (CARE_PATTERNS.some((pattern) => pattern.test(normalized) || pattern.test(s.toLowerCase()))) {
      return say(t('chat_care'), 'talk')
    }
    if (!kid.aiEnabled) return say(t('chat_ai_off'), 'talk')
    if (waiting) return

    const level = worldId && levelNumber ? WORLD_LEVELS[worldId][levelNumber - 1] : undefined
    const ageBand = kid.age <= 4 ? '3-4' : kid.age <= 6 ? '5-6' : '7-8'
    setWaiting(true)
    try {
      const result = await apiRequest<{ reply?: unknown }>('/api/companion', {
        method: 'POST',
        body: JSON.stringify({
          kidId: kid.id,
          message: s.slice(0, 200),
          language: lang,
          ageBand,
          worldId: worldId ?? undefined,
          activity: level?.activity
        })
      })
      if (typeof result.reply !== 'string' || !result.reply.trim()) {
        say(t('chat_error'), 'talk')
        return
      }
      say(result.reply.trim(), 'jump')
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        say(t('chat_slow'), 'talk')
        return
      }
      if (error instanceof ApiError && error.status === 503) {
        say(t('chat_ask_adult'), 'talk')
        return
      }
      say(t('chat_error'), 'talk')
    } finally {
      setWaiting(false)
    }
  }
  const send = () => { if (txt.trim() && !waiting) { void chat(txt); setTxt('') } }
  const talk = () => { setMic(true); listen(lang, chat, () => setMic(false)) }

  const dragStart = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    const bounds = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!bounds) return
    dragOffset.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    hasDragged.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const dragMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragOffset.current) return
    if (Math.abs(event.movementX) + Math.abs(event.movementY) > 2) hasDragged.current = true
    setPosition({
      left: Math.min(Math.max(8, event.clientX - dragOffset.current.x), Math.max(8, window.innerWidth - 176)),
      top: Math.min(Math.max(80, event.clientY - dragOffset.current.y), Math.max(80, window.innerHeight - 196))
    })
  }

  const dragEnd = () => { dragOffset.current = null }

  const moveWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 40 : 16
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step]
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    setPosition((current) => ({
      left: Math.min(Math.max(8, current.left + move[0]), Math.max(8, window.innerWidth - 176)),
      top: Math.min(Math.max(80, current.top + move[1]), Math.max(80, window.innerHeight - 196))
    }))
  }

  useEffect(() => { const id = setTimeout(() => bot.hi(), 700); return () => clearTimeout(id) }, []) // eslint-disable-line

  return (
    <Ctx.Provider value={bot}>
      {children}
      <div className="fixed z-50 flex max-w-[88vw] flex-col items-end gap-2" style={{ left: position.left, top: position.top }}>
        {msg && (
          <div aria-live="polite" className="animate-pop max-w-xs rounded-3xl rounded-br-md border-4 border-yellow-300 bg-white px-4 py-3 font-extrabold text-slate-800 shadow-xl">
            {msg}
          </div>
        )}
        {open && (
          <div className={`animate-pop absolute flex w-[min(360px,calc(100vw-32px))] flex-col gap-2 rounded-2xl border-2 border-yellow-300 bg-white p-2 shadow-xl ${
            position.top > window.innerHeight / 2 ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${position.left > window.innerWidth / 2 ? 'right-0' : 'left-0'}`}>
            <p className="px-2 pt-1 text-[11px] font-bold text-slate-500">{t('chat_local')}</p>
            <p className="px-2 text-[11px] font-medium text-slate-500">{t('chat_notice')}</p>
            <div className="flex items-center gap-2">
              <label htmlFor="companion-chat" className="sr-only">{t('talk')}</label>
              <input id="companion-chat" maxLength={200} value={txt} disabled={waiting} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={t('talk')} className="min-w-0 flex-1 rounded-xl bg-slate-100 px-3 py-2 font-bold outline-none" />
              {canListen() && (
                <button type="button" onClick={talk} disabled={waiting} aria-label="mic" className={`rounded-xl p-2.5 text-white disabled:opacity-50 ${mic ? 'animate-pulse bg-rose-500' : 'bg-emerald-500'}`}><Mic className="h-5 w-5" /></button>
              )}
              <button type="button" onClick={send} disabled={waiting || !txt.trim()} aria-label="send" className="rounded-xl bg-amber-400 p-2.5 text-amber-950 disabled:opacity-50">
                {waiting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setOpen(!open)} aria-label="chat" aria-expanded={open} className="rounded-full border-2 border-yellow-300 bg-white p-2.5 shadow">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </button>
            <button type="button" onClick={() => {
              const nextMute = !mute
              setMute(nextMute)
              onVoiceEnabledChange(!nextMute)
              if (nextMute) {
                cancelSpeech()
                setSpeaking(false)
                setMood('')
              }
            }} aria-label="sound" className="rounded-full border-2 border-yellow-300 bg-white p-2.5 shadow">
              {mute ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>
          </div>
          <button
            type="button"
            aria-label={`Mover a ${char.name} con el mouse, tacto o las flechas del teclado`}
            onPointerDown={dragStart}
            onPointerMove={dragMove}
            onPointerUp={dragEnd}
            onPointerCancel={dragEnd}
            onKeyDown={moveWithKeyboard}
            onClick={() => {
              if (hasDragged.current) {
                hasDragged.current = false
                return
              }
              say(line('cheer'), 'jump')
            }}
            className="relative flex h-40 w-32 touch-none items-end justify-center border-0 bg-transparent p-0 drop-shadow-xl cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700">
            {acc && <span className="absolute -top-5 text-4xl">{acc}</span>}
            <CharacterAvatar
              character={char}
              className="h-full w-full"
              speaking={speaking}
              gesture={mood === 'jump' ? 'excited' : mood === 'talk' ? 'talk' : 'idle'}
            />
          </button>
        </div>
      </div>
    </Ctx.Provider>
  )
}
