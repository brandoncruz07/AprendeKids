import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { Mic, Send, Volume2, VolumeX, MessageCircle } from 'lucide-react'
import { Character, SHOP_ITEMS } from '../data/gameData'
import { Kid } from '../store'
import { useI18n } from '../i18n'
import { speak, listen, canListen } from '../speech'

type Bot = { say: (m: string) => void; hi: () => void; ok: () => void; no: () => void; win: () => void }
const Ctx = createContext<Bot>({ say() {}, hi() {}, ok() {}, no() {}, win() {} })
export const useCompanion = () => useContext(Ctx)

// Palabras clave (en los 3 idiomas) → respuesta de la mascota
const CHAT: [RegExp, string][] = [
  [/c[oó]mo est[aá]s|how are you|tudo bem|como vai/i, 'c_how'],
  [/te quiero|te amo|i love you|amo voc|gosto de voc/i, 'c_love'],
  [/triste|cansad|aburrid|\bsad\b|tired|bored|chateado/i, 'c_sad'],
  [/gracias|thank|obrigad/i, 'c_thx'],
  [/lo logr|i did it|consegui/i, 'ok'],
  [/hola|hello|\bhi\b|\boi\b|ol[aá]/i, 'hi'],
]

export function Companion({ kid, char, children }: { kid: Kid; char: Character; children: ReactNode }) {
  const { t, lang } = useI18n()
  const [msg, setMsg] = useState('')
  const [mood, setMood] = useState('')
  const [mute, setMute] = useState(false)
  const [open, setOpen] = useState(false)
  const [txt, setTxt] = useState('')
  const [mic, setMic] = useState(false)
  const timer = useRef<number>(0)
  const acc = SHOP_ITEMS.find((i) => i.id === kid.eqAcc)?.icon

  const say = useCallback((m: string, mo = 'talk') => {
    setMsg(m); setMood(mo)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => { setMsg(''); setMood('') }, 6500)
    if (!mute) speak(m, lang, char.pitch, () => setMood(''))
  }, [mute, lang, char.pitch])

  const line = (k: string) => {
    const a = t(k, { n: kid.name, c: char.name }).split('|')
    return a[Math.floor(Math.random() * a.length)]
  }
  const bot: Bot = {
    say: (m) => say(m), hi: () => say(line('hi')), ok: () => say(line('ok'), 'jump'),
    no: () => say(line('no')), win: () => say(line('win'), 'jump'),
  }
  const chat = (s: string) => say(line(CHAT.find(([re]) => re.test(s))?.[1] ?? 'cheer'), 'jump')
  const send = () => { if (txt.trim()) { chat(txt); setTxt('') } }
  const talk = () => { setMic(true); listen(lang, chat, () => setMic(false)) }

  useEffect(() => { const id = setTimeout(() => bot.hi(), 700); return () => clearTimeout(id) }, []) // eslint-disable-line

  return (
    <Ctx.Provider value={bot}>
      {children}
      <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-2 max-w-[88vw]">
        {msg && (
          <div className="animate-pop bg-white border-4 border-yellow-300 rounded-3xl rounded-br-md px-4 py-3 shadow-xl font-extrabold text-slate-800 max-w-xs">
            {msg}
          </div>
        )}
        {open && (
          <div className="animate-pop flex gap-2 bg-white p-2 rounded-2xl shadow-xl border-2 border-yellow-300">
            <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={t('talk')} className="px-3 py-2 rounded-xl bg-slate-100 font-bold outline-none w-40 sm:w-52" />
            {canListen() && (
              <button onClick={talk} aria-label="mic" className={`p-2.5 rounded-xl text-white cursor-pointer ${mic ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}><Mic className="w-5 h-5" /></button>
            )}
            <button onClick={send} aria-label="send" className="p-2.5 rounded-xl bg-amber-400 text-amber-950 cursor-pointer"><Send className="w-5 h-5" /></button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <button onClick={() => setOpen(!open)} aria-label="chat" className="p-2.5 rounded-full bg-white border-2 border-yellow-300 shadow cursor-pointer"><MessageCircle className="w-5 h-5 text-purple-600" /></button>
            <button onClick={() => setMute(!mute)} aria-label="sound" className="p-2.5 rounded-full bg-white border-2 border-yellow-300 shadow cursor-pointer">
              {mute ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>
          </div>
          <button onClick={() => say(line('cheer'), 'jump')}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${char.grad} border-4 border-white shadow-2xl text-6xl sm:text-7xl flex items-center justify-center cursor-pointer ${mood === 'jump' ? 'animate-jump' : mood === 'talk' ? 'animate-talk' : 'animate-bounce-gentle'}`}>
            {acc && <span className="absolute -top-5 text-4xl">{acc}</span>}
            {char.emoji}
          </button>
        </div>
      </div>
    </Ctx.Provider>
  )
}
