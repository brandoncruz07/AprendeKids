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
  { id: 'hat', kind: 'acc', price: 30, icon: '🥳' },
  { id: 'crown', kind: 'acc', price: 60, icon: '👑' },
  { id: 'glasses', kind: 'acc', price: 25, icon: '🕶️' },
  { id: 'cap', kind: 'acc', price: 35, icon: '🧢' },
  { id: 'space', kind: 'bg', price: 50, icon: '🌌', bg: 'from-indigo-950 via-purple-900 to-slate-900' },
  { id: 'candy', kind: 'bg', price: 45, icon: '🍭', bg: 'from-pink-300 via-purple-200 to-yellow-100' },
  { id: 'valley', kind: 'bg', price: 40, icon: '🌋', bg: 'from-amber-200 via-emerald-200 to-teal-400' }
]
