export interface Character {
  id: string
  name: string
  role: string
  subject: string
  description: string
  color: string
  bgGradient: string
  borderColor: string
  textColor: string
  badgeColor: string
  avatarSvg: string
  voiceGreeting: string
  accessory?: string
}

export interface UnlockedItems {
  characters: string[]
  accessories: string[]
  backgrounds: string[]
  equippedAccessory: Record<string, string> // charId -> accessoryId
  activeBackground: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  category: string
  color: string
}

export interface ShopItem {
  id: string
  name: string
  category: 'accessory' | 'background' | 'character'
  price: number
  icon: string
  targetCharacterId?: string
  bgClass?: string
  description: string
}

export const CHARACTERS: Character[] = [
  {
    id: 'dino',
    name: 'Dino',
    role: 'El Dinosaurio Sabio',
    subject: 'Mundo de los Números',
    description: '¡Le encantan las matemáticas, contar estrellas y resolver acertijos divertidos!',
    color: 'bg-emerald-500',
    bgGradient: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    voiceGreeting: '¡Hola amiguito! ¡Vamos a contar y sumar juntos de manera genial!',
    avatarSvg: '🦖'
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'La Dinosaurio Lectora',
    subject: 'Mundo de las Letras',
    description: '¡Enseña las vocales, el abecedario y te ayuda a leer hermosos cuentos!',
    color: 'bg-purple-500',
    bgGradient: 'from-purple-400 to-indigo-600',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-700',
    badgeColor: 'bg-purple-100 text-purple-800',
    voiceGreeting: '¡Hola! Soy Luna, ¿listo para descubrir la magia de las palabras y la lectura?',
    avatarSvg: '🦕'
  },
  {
    id: 'pico',
    name: 'Pico',
    role: 'La Guacamaya Parlanchina',
    subject: 'Pistas y Consejos',
    description: '¡Siempre volando alto para darte las mejores pistas cuando lo necesites!',
    color: 'bg-rose-500',
    bgGradient: 'from-rose-400 to-amber-500',
    borderColor: 'border-rose-600',
    textColor: 'text-rose-700',
    badgeColor: 'bg-rose-100 text-rose-800',
    voiceGreeting: '¡Cuaaá! Soy Pico, si te trancas en algún juego, ¡yo te daré una pista super secreta!',
    avatarSvg: '🦜'
  },
  {
    id: 'pandi',
    name: 'Pandi',
    role: 'El Panda Cariñoso',
    subject: 'Compañero de Apoyo',
    description: '¡Te abraza en cada logro y te motiva a seguir intentando si fallas!',
    color: 'bg-cyan-500',
    bgGradient: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-600',
    textColor: 'text-cyan-700',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    voiceGreeting: '¡Abrazos de panda! ¡No te preocupes si te equivocas, aprender es super divertido!',
    avatarSvg: '🐼'
  },
  {
    id: 'leo',
    name: 'Leo',
    role: 'El León Campeón',
    subject: 'Entregador de Premios',
    description: '¡Guarda las estrellas y cofres para entregarte medallas y grandes recompensas!',
    color: 'bg-amber-500',
    bgGradient: 'from-amber-400 to-orange-600',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-800',
    voiceGreeting: '¡Roar de victoria! ¡Sigue jugando para desbloquear gorros y medallas de oro!',
    avatarSvg: '🦁'
  }
]

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'acc_hat_party',
    name: 'Gorrito de Fiesta',
    category: 'accessory',
    price: 30,
    icon: '🥳',
    description: '¡Para celebrar cada victoria con estilo festivo!'
  },
  {
    id: 'acc_crown',
    name: 'Corona Real de Oro',
    category: 'accessory',
    price: 60,
    icon: '👑',
    description: '¡Para Reyes y Reinas de la lectura y las matemáticas!'
  },
  {
    id: 'acc_glasses',
    name: 'Gafas de Genio',
    category: 'accessory',
    price: 25,
    icon: '👓',
    description: '¡Estilo inteligente para resolver acertijos!'
  },
  {
    id: 'acc_dino_hat',
    name: 'Gorra Aventurera',
    category: 'accessory',
    price: 35,
    icon: '🧢',
    description: 'Ideal para explorar valles y selvas misteriosas.'
  },
  {
    id: 'bg_space',
    name: 'Fondo Espacial Estelar',
    category: 'background',
    price: 50,
    icon: '🌌',
    bgClass: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900',
    description: 'Un mapa rodeado de estrellas, planetas y cohetes.'
  },
  {
    id: 'bg_candy',
    name: 'Fondo Dulce Caramelos',
    category: 'background',
    price: 45,
    icon: '🍭',
    bgClass: 'bg-gradient-to-b from-pink-300 via-purple-200 to-yellow-100',
    description: '¡Un mundo lleno de golosinas y colores pasteles!'
  },
  {
    id: 'bg_dino_valley',
    name: 'Valle de los Dinosaurios',
    category: 'background',
    price: 40,
    icon: '🌋',
    bgClass: 'bg-gradient-to-b from-amber-200 via-emerald-200 to-teal-400',
    description: 'Volcanes amigables, palmeras y fósiles brillantes.'
  }
]

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_letters',
    title: 'Primeras Letras',
    description: 'Completa tu primera actividad en el Mundo de las Letras',
    icon: '🔤',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'Letras',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'first_words',
    title: 'Primeras Palabras',
    description: 'Forma 5 palabras correctamente',
    icon: '📝',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'Lectura',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 'math_master',
    title: 'Maestro de los Números',
    description: 'Resuelve 5 actividades de matemáticas correctamente',
    icon: '🔢',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'Números',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'adventurer_reader',
    title: 'Lector Aventurero',
    description: 'Lee un cuento completo y responde las preguntas de comprensión',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'Lectura',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'wordsearch_champ',
    title: 'Campeón de Sopa de Letras',
    description: 'Encuentra todas las palabras en la Sopa de Letras',
    icon: '🔍',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'Juegos',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'explorer_knowledge',
    title: 'Explorador del Conocimiento',
    description: 'Visita los 5 mundos del mapa de aventuras',
    icon: '🗺️',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'General',
    color: 'from-yellow-400 to-amber-600'
  }
]
