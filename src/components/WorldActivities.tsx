import React, { useState } from 'react'
import { Character } from '../data/gameData'
import confetti from 'canvas-confetti'
import { Sparkles, ArrowLeft, Volume2, HelpCircle, CheckCircle, RefreshCw, Trophy, Star } from 'lucide-react'

interface ActivityProps {
  character: Character
  onBackToMap: () => void
  onRewardEarned: (stars: number, coins: number) => void
}

export const WorldActivities: React.FC<{
  worldId: string
  character: Character
  onBackToMap: () => void
  onRewardEarned: (stars: number, coins: number) => void
}> = ({ worldId, character, onBackToMap, onRewardEarned }) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false)
  const [rewardData, setRewardData] = useState<{ stars: number; coins: number }>({ stars: 0, coins: 0 })
  const [hintText, setHintText] = useState<string | null>(null)

  // Speech helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES'
      utterance.pitch = 1.2
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  // Trigger celebration
  const celebrateSuccess = (earnedStars = 3, earnedCoins = 10) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
    setRewardData({ stars: earnedStars, coins: earnedCoins })
    setShowRewardModal(true)
    onRewardEarned(earnedStars, earnedCoins)
    speakText(`¡Excelente trabajo! Has ganado ${earnedStars} estrellas y ${earnedCoins} monedas.`)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-slate-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToMap}
            className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold px-4 py-2 rounded-2xl border-2 border-slate-300 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Mapa</span>
          </button>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border-2 border-slate-200 shadow-sm">
            <span className="text-2xl">{character.avatarSvg}</span>
            <span className="font-extrabold text-sm text-slate-700">{character.name} te acompaña</span>
          </div>
        </div>

        {/* Render World-Specific Activity */}
        {worldId === 'letters' && (
          <LettersActivity character={character} onCelebrate={celebrateSuccess} speakText={speakText} setHint={setHintText} />
        )}
        {worldId === 'reading' && (
          <ReadingActivity character={character} onCelebrate={celebrateSuccess} speakText={speakText} setHint={setHintText} />
        )}
        {worldId === 'numbers' && (
          <NumbersActivity character={character} onCelebrate={celebrateSuccess} speakText={speakText} setHint={setHintText} />
        )}
        {worldId === 'dinosaurs' && (
          <DinosaursActivity character={character} onCelebrate={celebrateSuccess} speakText={speakText} setHint={setHintText} />
        )}
        {worldId === 'thinking' && (
          <ThinkingActivity character={character} onCelebrate={celebrateSuccess} speakText={speakText} setHint={setHintText} />
        )}

      </div>

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-yellow-400 shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-bounce-gentle">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
            
            <div className="text-6xl my-2">🎉🏆🎉</div>
            <h2 className="text-3xl font-black text-slate-800 font-fredoka">¡ACTIVIDAD LOGRADA!</h2>
            <p className="text-base font-bold text-slate-600 mt-1">
              ¡Lo hiciste genial! Tu amigo {character.name} está muy orgulloso de ti.
            </p>

            <div className="flex justify-center gap-4 my-6">
              <div className="bg-amber-100 border-2 border-amber-300 px-4 py-3 rounded-2xl flex items-center gap-2">
                <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-800">Ganaste</p>
                  <p className="text-2xl font-black font-fredoka text-amber-950">+{rewardData.stars} ⭐</p>
                </div>
              </div>

              <div className="bg-yellow-100 border-2 border-yellow-300 px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="text-3xl">🪙</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-yellow-800">Ganaste</p>
                  <p className="text-2xl font-black font-fredoka text-yellow-950">+{rewardData.coins} Monedas</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowRewardModal(false)
                onBackToMap()
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg py-3.5 rounded-2xl shadow-lg border-b-4 border-teal-700 active:translate-y-1 transition-all cursor-pointer"
            >
              ¡Continuar Explorando!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   1. MUNDO DE LAS LETRAS (Vocales, Abecedario, Sílabas, Formar Palabras)
   ========================================================================= */
const LettersActivity: React.FC<{
  character: Character
  onCelebrate: (stars?: number, coins?: number) => void
  speakText: (t: string) => void
  setHint: (h: string | null) => void
}> = ({ character, onCelebrate, speakText, setHint }) => {
  const [subTab, setSubTab] = useState<'vowels' | 'syllables' | 'words'>('vowels')
  
  // Vowels Activity State
  const vowels = [
    { letter: 'A', name: 'A', word: 'Abeja', emoji: '🐝', sound: 'A' },
    { letter: 'E', name: 'E', word: 'Elefante', emoji: '🐘', sound: 'E' },
    { letter: 'I', name: 'I', word: 'Iguana', emoji: '🦎', sound: 'I' },
    { letter: 'O', name: 'O', word: 'Oso', emoji: '🐻', sound: 'O' },
    { letter: 'U', name: 'U', word: 'Uvas', emoji: '🍇', sound: 'U' }
  ]
  const [selectedVowel, setSelectedVowel] = useState(vowels[0])

  // Syllable Form Activity State
  const [targetWord] = useState({ name: 'SOL', emoji: '☀️', syllables: ['S', 'O', 'L'] })
  const [builtWord, setBuiltWord] = useState<string[]>([])
  const letterOptions = ['S', 'O', 'L', 'M', 'A', 'P']

  const handleAddLetter = (letter: string) => {
    speakText(letter)
    if (builtWord.length < targetWord.syllables.length) {
      const next = [...builtWord, letter]
      setBuiltWord(next)
      if (next.join('') === targetWord.name) {
        onCelebrate(3, 15)
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-purple-300 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Mundo de las Letras
          </span>
          <h2 className="text-3xl font-black text-purple-950 font-fredoka mt-1">
            🔤 ¡Descubre las Letras y Sonidos!
          </h2>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 mb-6 border-b pb-4">
        <button
          onClick={() => setSubTab('vowels')}
          className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
            subTab === 'vowels' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          1. Aprender Vocales
        </button>
        <button
          onClick={() => setSubTab('syllables')}
          className={`px-4 py-2 rounded-xl font-extrabold text-sm ${
            subTab === 'syllables' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          2. Armar Palabras
        </button>
      </div>

      {subTab === 'vowels' && (
        <div className="text-center">
          <p className="text-lg font-bold text-slate-700 mb-4">
            Toca una vocal para escuchar su sonido y ver su dibujo:
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 mb-8 flex-wrap">
            {vowels.map((v) => (
              <button
                key={v.letter}
                onClick={() => {
                  setSelectedVowel(v)
                  speakText(`${v.letter}, de ${v.word}`)
                }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl sm:text-4xl font-black font-fredoka transition-all shadow-md cursor-pointer ${
                  selectedVowel.letter === v.letter
                    ? 'bg-purple-600 text-white scale-110 border-4 border-yellow-300'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                {v.letter}
              </button>
            ))}
          </div>

          <div className="bg-purple-50 rounded-3xl p-8 max-w-md mx-auto border-2 border-purple-200 shadow-inner flex flex-col items-center">
            <span className="text-8xl mb-4 animate-bounce-gentle">{selectedVowel.emoji}</span>
            <div className="flex items-center gap-3">
              <h3 className="text-4xl font-black text-purple-950 font-fredoka">{selectedVowel.word}</h3>
              <button
                onClick={() => speakText(selectedVowel.word)}
                className="p-3 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm font-bold text-purple-700 mt-2">
              Comienza con la vocal <strong className="text-2xl">{selectedVowel.letter}</strong>
            </p>

            <button
              onClick={() => onCelebrate(3, 10)}
              className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl shadow border-b-4 border-emerald-700 active:translate-y-1 transition-all"
            >
              ¡Ya me la aprendí! ⭐
            </button>
          </div>
        </div>
      )}

      {subTab === 'syllables' && (
        <div className="text-center">
          <p className="text-lg font-bold text-slate-700 mb-2">
            Forma la palabra correspondiente a la imagen:
          </p>

          <div className="text-8xl my-4 animate-bounce-gentle">{targetWord.emoji}</div>

          {/* Slots */}
          <div className="flex justify-center gap-3 mb-6">
            {targetWord.syllables.map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed border-purple-400 bg-purple-50 flex items-center justify-center text-3xl font-black text-purple-900 font-fredoka shadow-inner"
              >
                {builtWord[i] || ''}
              </div>
            ))}
          </div>

          {/* Letter options */}
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {letterOptions.map((letra, idx) => (
              <button
                key={idx}
                onClick={() => handleAddLetter(letra)}
                className="w-14 h-14 bg-yellow-400 hover:bg-yellow-300 text-amber-950 text-2xl font-black font-fredoka rounded-2xl shadow-md border-b-4 border-amber-600 active:translate-y-1 cursor-pointer"
              >
                {letra}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBuiltWord([])}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-bold text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Borrar y reintentar
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   2. MUNDO DE LA LECTURA (Unir palabras, Cuentos infantiles)
   ========================================================================= */
const ReadingActivity: React.FC<{
  character: Character
  onCelebrate: (stars?: number, coins?: number) => void
  speakText: (t: string) => void
  setHint: (h: string | null) => void
}> = ({ character, onCelebrate, speakText, setHint }) => {
  const [subTab, setSubTab] = useState<'story' | 'match'>('story')

  // Short Story Data
  const story = {
    title: 'El Perrito Tobi',
    emoji: '🐶',
    content: 'Tobi es un perrito muy juguetón. Le gusta correr en el parque y buscar su pelota roja. Cuando está feliz, mueve su cola.',
    question: '¿Qué objeto busca Tobi en el parque?',
    options: [
      { text: 'Una pelota roja', isCorrect: true, emoji: '🔴' },
      { text: 'Un hueso gigante', isCorrect: false, emoji: '🦴' },
      { text: 'Un sombrero azul', isCorrect: false, emoji: '🎩' }
    ]
  }

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-pink-300 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="bg-pink-100 text-pink-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Mundo de la Lectura
          </span>
          <h2 className="text-3xl font-black text-pink-950 font-fredoka mt-1">
            📖 Pequeños Cuentos Mágicos
          </h2>
        </div>
      </div>

      <div className="bg-rose-50 rounded-3xl p-6 border-2 border-pink-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black text-pink-900 font-fredoka flex items-center gap-3">
            <span>{story.emoji}</span> {story.title}
          </h3>
          <button
            onClick={() => speakText(`${story.title}. ${story.content}`)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow cursor-pointer"
          >
            <Volume2 className="w-5 h-5" /> Escuchar Cuento
          </button>
        </div>

        <p className="text-lg font-bold text-slate-800 leading-relaxed bg-white p-5 rounded-2xl border border-pink-200 shadow-sm">
          "{story.content}"
        </p>
      </div>

      {/* Comprehension Question */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200">
        <h4 className="text-xl font-black text-slate-800 font-fredoka mb-4">
          Pregunta de comprensión: {story.question}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {story.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedAnswer(idx)
                if (opt.isCorrect) {
                  speakText('¡Correcto! Excelente comprensión lectora.')
                  onCelebrate(4, 20)
                } else {
                  speakText('Inténtalo de nuevo, ¡tú puedes!')
                }
              }}
              className={`p-4 rounded-2xl font-black text-base flex flex-col items-center justify-center gap-2 transition-all border-3 cursor-pointer ${
                selectedAnswer === idx
                  ? opt.isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                    : 'bg-rose-500 text-white border-rose-600'
                  : 'bg-slate-50 hover:bg-pink-50 text-slate-800 border-slate-300'
              }`}
            >
              <span className="text-4xl">{opt.emoji}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   3. MUNDO DE LOS NÚMEROS (Conteo visual, Sumas y Restas sencillas)
   ========================================================================= */
const NumbersActivity: React.FC<{
  character: Character
  onCelebrate: (stars?: number, coins?: number) => void
  speakText: (t: string) => void
  setHint: (h: string | null) => void
}> = ({ character, onCelebrate, speakText, setHint }) => {
  const [num1] = useState(3)
  const [num2] = useState(2)
  const answer = num1 + num2

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-emerald-300 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Mundo de los Números
          </span>
          <h2 className="text-3xl font-black text-emerald-950 font-fredoka mt-1">
            🔢 ¡Contemos y Sumemos Manzanas!
          </h2>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 text-center mb-6">
        <p className="text-xl font-bold text-slate-700 mb-6">
          ¿Cuántas manzanas hay en total?
        </p>

        {/* Visual elements representation */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm">
            <div className="flex gap-2 text-4xl mb-2">🍎 🍎 🍎</div>
            <span className="font-black text-2xl font-fredoka text-emerald-800">{num1}</span>
          </div>

          <span className="text-4xl font-black text-slate-600 font-fredoka">+</span>

          <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm">
            <div className="flex gap-2 text-4xl mb-2">🍎 🍎</div>
            <span className="font-black text-2xl font-fredoka text-emerald-800">{num2}</span>
          </div>

          <span className="text-4xl font-black text-slate-600 font-fredoka">=</span>

          <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-400 shadow-sm min-w-[80px]">
            <span className="text-4xl font-black text-amber-900 font-fredoka">?</span>
          </div>
        </div>

        {/* Answer Options */}
        <div className="flex justify-center gap-4">
          {[4, 5, 6].map((option) => (
            <button
              key={option}
              onClick={() => {
                if (option === answer) {
                  speakText('¡Muy bien! Tres más dos es igual a cinco.')
                  onCelebrate(3, 15)
                } else {
                  speakText('Cuenta las manzanas despacio con tu dedito. ¡Intenta de nuevo!')
                }
              }}
              className="w-20 h-20 bg-gradient-to-b from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white font-black text-4xl font-fredoka rounded-2xl shadow-lg border-b-4 border-teal-700 active:translate-y-1 cursor-pointer transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   4. VALLE DE LOS DINOSAURIOS (Fósiles, Números ocultos y Secuencias)
   ========================================================================= */
const DinosaursActivity: React.FC<{
  character: Character
  onCelebrate: (stars?: number, coins?: number) => void
  speakText: (t: string) => void
  setHint: (h: string | null) => void
}> = ({ character, onCelebrate, speakText, setHint }) => {
  const [uncovered, setUncovered] = useState<boolean[]>([false, false, false])

  const handleDig = (idx: number) => {
    speakText('¡Fósil descubierto!')
    const next = [...uncovered]
    next[idx] = true
    setUncovered(next)
    if (next.every(Boolean)) {
      onCelebrate(4, 25)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Valle de los Dinosaurios
          </span>
          <h2 className="text-3xl font-black text-amber-950 font-fredoka mt-1">
            🌋 Desentierra los Fósiles Misteriosos
          </h2>
        </div>
      </div>

      <p className="text-lg font-bold text-slate-700 mb-6 text-center">
        Toca las rocas prehistóricas para excavar y encontrar las sorpresas:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {uncovered.map((isOpen, idx) => (
          <div
            key={idx}
            onClick={() => !isOpen && handleDig(idx)}
            className={`h-48 rounded-3xl border-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${
              isOpen
                ? 'bg-amber-100 border-amber-400 scale-102'
                : 'bg-stone-300 hover:bg-stone-200 border-stone-500 hover:scale-105'
            }`}
          >
            {isOpen ? (
              <div className="text-center animate-bounce-gentle">
                <span className="text-6xl">🦕</span>
                <p className="font-black text-amber-900 font-fredoka text-xl mt-2">Dino Fósil #{idx + 1}</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-6xl">🪨</span>
                <p className="font-black text-stone-700 font-fredoka text-base mt-2">¡Toca para excavar!</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================================
   5. JUEGOS PARA PENSAR (Memoria de cartas)
   ========================================================================= */
const ThinkingActivity: React.FC<{
  character: Character
  onCelebrate: (stars?: number, coins?: number) => void
  speakText: (t: string) => void
  setHint: (h: string | null) => void
}> = ({ character, onCelebrate, speakText, setHint }) => {
  const cardsData = [
    { id: 1, icon: '🦁' },
    { id: 2, icon: '🐼' },
    { id: 3, icon: '🦜' },
    { id: 4, icon: '🦁' },
    { id: 5, icon: '🐼' },
    { id: 6, icon: '🦜' }
  ]

  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])

  const handleCardClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return

    const nextFlipped = [...flipped, idx]
    setFlipped(nextFlipped)

    if (nextFlipped.length === 2) {
      const [firstIdx, secondIdx] = nextFlipped
      if (cardsData[firstIdx].icon === cardsData[secondIdx].icon) {
        speakText('¡Pareja encontrada!')
        const nextMatched = [...matched, firstIdx, secondIdx]
        setMatched(nextMatched)
        setFlipped([])
        if (nextMatched.length === cardsData.length) {
          onCelebrate(5, 30)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border-4 border-cyan-300 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="bg-cyan-100 text-cyan-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            Juegos para Pensar
          </span>
          <h2 className="text-3xl font-black text-cyan-950 font-fredoka mt-1">
            🧩 Juego de Memoria de Animales
          </h2>
        </div>
      </div>

      <p className="text-lg font-bold text-slate-700 mb-6 text-center">
        Encuentra las parejas de cartas iguales:
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6">
        {cardsData.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx)
          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-28 rounded-2xl border-4 flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 shadow-md ${
                isFlipped
                  ? 'bg-amber-100 border-amber-400 rotate-y-180'
                  : 'bg-cyan-500 border-cyan-600 hover:bg-cyan-400'
              }`}
            >
              {isFlipped ? card.icon : '❓'}
            </div>
          )
        })}
      </div>
    </div>
  )
}
