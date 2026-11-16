import { useState } from 'react'
import { BarChart3, LogOut, Plus } from 'lucide-react'
import { useI18n, LangSwitch } from '../i18n'
import { Acct, Kid, newKid } from '../store'
import { CHARACTERS } from '../data/gameData'
import { ProgressView } from './ProgressView'

export function ProfilePicker({ acct, onPick, onAdd, onOut }: { acct: Acct; onPick: (k: Kid) => void; onAdd: (k: Kid) => void; onOut: () => void }) {
  const { t } = useI18n()
  const [adding, setAdding] = useState(acct.kids.length === 0)
  const [name, setName] = useState('')
  const [age, setAge] = useState(5)
  const [char, setChar] = useState('dino')
  const [view, setView] = useState<Kid | null>(null)

  if (view) return <ProgressView kid={view} onBack={() => setView(null)} />
  const emoji = (id: string) => CHARACTERS.find((c) => c.id === id)?.emoji

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-indigo-200 to-purple-300 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onOut} className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl font-extrabold text-slate-700 border-2 border-slate-300 cursor-pointer"><LogOut className="w-4 h-4" />{t('out')}</button>
          <LangSwitch />
        </div>
        <h1 className="text-4xl sm:text-5xl text-center font-black text-white font-fredoka drop-shadow-lg mb-6">{t('who')}</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {acct.kids.map((k) => (
            <div key={k.id} className="relative bg-white rounded-3xl p-4 border-4 border-yellow-300 shadow-xl text-center hover:scale-105 transition">
              <button onClick={() => onPick(k)} className="w-full cursor-pointer">
                <div className="text-6xl animate-bounce-gentle">{emoji(k.char)}</div>
                <p className="text-2xl font-black font-fredoka text-slate-800 mt-1">{k.name}</p>
                <p className="text-sm font-bold text-slate-500">{k.age} · ⭐ {k.stars}</p>
              </button>
              <button onClick={() => setView(k)} title={t('prog')} className="absolute top-2 right-2 p-2 rounded-xl bg-purple-100 text-purple-700 cursor-pointer"><BarChart3 className="w-5 h-5" /></button>
            </div>
          ))}
          {!adding && (
            <button onClick={() => setAdding(true)} className="bg-white/70 rounded-3xl p-4 border-4 border-dashed border-white text-slate-700 font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white">
              <Plus className="w-10 h-10" />{t('addkid')}
            </button>
          )}
        </div>

        {adding && (
          <div className="bg-white/95 rounded-3xl p-5 border-4 border-yellow-300 shadow-xl space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('kname')} className="w-full px-4 py-3 rounded-2xl bg-slate-100 border-2 border-slate-200 font-bold outline-none focus:border-purple-400" />
            <div>
              <p className="font-extrabold text-slate-700 mb-2">{t('age')}</p>
              <div className="flex gap-2 flex-wrap">
                {[3, 4, 5, 6, 7, 8].map((a) => (
                  <button key={a} onClick={() => setAge(a)} className={`w-12 h-12 rounded-xl font-black text-xl cursor-pointer ${age === a ? 'bg-purple-600 text-white scale-110' : 'bg-slate-100 text-slate-700'}`}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-extrabold text-slate-700 mb-2">{t('pickc')}</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CHARACTERS.map((c) => (
                  <button key={c.id} onClick={() => setChar(c.id)} className={`rounded-2xl p-2 bg-gradient-to-br ${c.grad} cursor-pointer transition ${char === c.id ? 'ring-4 ring-yellow-300 scale-110' : 'opacity-80'}`}>
                    <div className="text-4xl">{c.emoji}</div>
                    <div className="text-white text-xs font-black">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <button disabled={!name.trim()} onClick={() => { onAdd(newKid(name.trim(), age, char)); setName(''); setAdding(false) }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 text-white font-black text-xl border-b-4 border-teal-700 cursor-pointer">{t('save')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
