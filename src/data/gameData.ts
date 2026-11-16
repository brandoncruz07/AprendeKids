export interface Character { id: string; name: string; emoji: string; grad: string; pitch: number }
export interface ShopItem { id: string; kind: 'acc' | 'bg'; price: number; icon: string; bg?: string }

export const CHARACTERS: Character[] = [
  { id: 'dino', name: 'Dino', emoji: '🦖', grad: 'from-emerald-400 to-teal-600', pitch: 0.8 },
  { id: 'luna', name: 'Luna', emoji: '🦕', grad: 'from-purple-400 to-indigo-600', pitch: 1.4 },
  { id: 'pico', name: 'Pico', emoji: '🦜', grad: 'from-rose-400 to-amber-500', pitch: 1.7 },
  { id: 'pandi', name: 'Pandi', emoji: '🐼', grad: 'from-cyan-400 to-blue-600', pitch: 1.2 },
  { id: 'leo', name: 'Leo', emoji: '🦁', grad: 'from-amber-400 to-orange-600', pitch: 0.6 },
  { id: 'tuga', name: 'Tuga', emoji: '🐢', grad: 'from-lime-400 to-green-600', pitch: 1.0 },
]

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'hat', kind: 'acc', price: 30, icon: '🥳' },
  { id: 'crown', kind: 'acc', price: 60, icon: '👑' },
  { id: 'glasses', kind: 'acc', price: 25, icon: '🕶️' },
  { id: 'cap', kind: 'acc', price: 35, icon: '🧢' },
  { id: 'space', kind: 'bg', price: 50, icon: '🌌', bg: 'from-indigo-950 via-purple-900 to-slate-900' },
  { id: 'candy', kind: 'bg', price: 45, icon: '🍭', bg: 'from-pink-300 via-purple-200 to-yellow-100' },
  { id: 'valley', kind: 'bg', price: 40, icon: '🌋', bg: 'from-amber-200 via-emerald-200 to-teal-400' },
]
