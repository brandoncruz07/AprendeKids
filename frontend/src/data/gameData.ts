export interface Character {
  id: string
  name: string
  emoji: string
  grad: string
  pitch: number
  rate: number
}

export interface ShopItem {
  id: string
  kind: 'acc' | 'bg'
  price: number
  icon: string
  bg?: string
  placement?: 'headTop' | 'forehead' | 'eyes' | 'ears' | 'neck' | 'back'
}

export const CHARACTERS: Character[] = [
  { id: 'dino', name: 'Dino', emoji: '🦖', grad: 'from-emerald-400 to-teal-600', pitch: 0.68, rate: 0.84 },
  { id: 'luna', name: 'Luna', emoji: '🦕', grad: 'from-purple-400 to-indigo-600', pitch: 1.26, rate: 0.96 },
  { id: 'pico', name: 'Pico', emoji: '🦜', grad: 'from-rose-400 to-amber-500', pitch: 1.42, rate: 1.08 },
  { id: 'pandi', name: 'Pandi', emoji: '🐼', grad: 'from-cyan-400 to-blue-600', pitch: 1.04, rate: 0.92 },
  { id: 'leo', name: 'Leo', emoji: '🦁', grad: 'from-amber-400 to-orange-600', pitch: 0.62, rate: 0.86 },
  { id: 'tuga', name: 'Tuga', emoji: '🐢', grad: 'from-lime-400 to-green-600', pitch: 0.86, rate: 0.82 },
  { id: 'foxy', name: 'Foxy', emoji: '🦊', grad: 'from-orange-400 to-red-600', pitch: 1.1, rate: 1.02 },
  { id: 'oliva', name: 'Oliva', emoji: '🦉', grad: 'from-violet-400 to-fuchsia-600', pitch: 0.98, rate: 0.9 },
  { id: 'bunny', name: 'Bunny', emoji: '🐰', grad: 'from-pink-300 to-rose-500', pitch: 1.34, rate: 1.06 },
  { id: 'robo', name: 'Robo', emoji: '🤖', grad: 'from-sky-400 to-blue-700', pitch: 0.94, rate: 0.88 }
]

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hat', kind: 'acc', price: 30, icon: '🎩', placement: 'headTop' },
  { id: 'crown', kind: 'acc', price: 60, icon: '👑', placement: 'headTop' },
  { id: 'glasses', kind: 'acc', price: 25, icon: '🕶️', placement: 'eyes' },
  { id: 'cap', kind: 'acc', price: 35, icon: '🧢', placement: 'forehead' },
  { id: 'bow', kind: 'acc', price: 28, icon: '🎀', placement: 'forehead' },
  { id: 'headphones', kind: 'acc', price: 45, icon: '🎧', placement: 'ears' },
  { id: 'scarf', kind: 'acc', price: 40, icon: '🧣', placement: 'neck' },
  { id: 'backpack', kind: 'acc', price: 55, icon: '🎒', placement: 'back' },
  { id: 'flower', kind: 'acc', price: 32, icon: '🌼', placement: 'forehead' },
  { id: 'antenna', kind: 'acc', price: 50, icon: '✨', placement: 'headTop' },
  { id: 'space', kind: 'bg', price: 50, icon: '🌌', bg: 'from-indigo-950 via-purple-900 to-slate-900' },
  { id: 'candy', kind: 'bg', price: 45, icon: '🍭', bg: 'from-pink-300 via-purple-200 to-yellow-100' },
  { id: 'valley', kind: 'bg', price: 40, icon: '🌋', bg: 'from-amber-200 via-emerald-200 to-teal-400' },
  { id: 'forest', kind: 'bg', price: 45, icon: '🌲', bg: 'from-green-700 via-emerald-500 to-lime-300' },
  { id: 'ocean', kind: 'bg', price: 55, icon: '🐠', bg: 'from-sky-600 via-cyan-400 to-blue-200' },
  { id: 'rainbow', kind: 'bg', price: 50, icon: '🌈', bg: 'from-pink-300 via-amber-200 to-sky-300' }
]
