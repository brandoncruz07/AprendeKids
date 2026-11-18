import { useId } from 'react'
import { Character, ShopItem } from '../data/gameData'

const COLORS: Record<string, { body: string; light: string; dark: string; accent: string }> = {
  dino: { body: '#31c48d', light: '#b8f3d9', dark: '#087f5b', accent: '#fde68a' },
  luna: { body: '#a78bfa', light: '#e9ddff', dark: '#6d42c4', accent: '#f9a8d4' },
  pico: { body: '#fb7185', light: '#ffe4cf', dark: '#c2415b', accent: '#fbbf24' },
  pandi: { body: '#e2e8f0', light: '#ffffff', dark: '#334155', accent: '#f9a8d4' },
  leo: { body: '#fbbf24', light: '#fff0bd', dark: '#c2410c', accent: '#fb923c' },
  tuga: { body: '#84cc16', light: '#d9f99d', dark: '#3f6212', accent: '#65a30d' },
  foxy: { body: '#fb923c', light: '#ffedd5', dark: '#9a3412', accent: '#fef3c7' },
  oliva: { body: '#a78bfa', light: '#ede9fe', dark: '#5b21b6', accent: '#fbbf24' },
  bunny: { body: '#f9a8d4', light: '#fff1f2', dark: '#9d174d', accent: '#fb7185' },
  robo: { body: '#38bdf8', light: '#e0f2fe', dark: '#075985', accent: '#facc15' }
}

export type AvatarGesture = 'idle' | 'talk' | 'excited'

// Sizes use the SVG viewBox units so accessories stay proportional at every avatar size.
const ACCESSORY_POSITION: Record<NonNullable<ShopItem['placement']>, { x: number; y: number; size: number }> = {
  headTop: { x: 60, y: 27, size: 42 },
  forehead: { x: 60, y: 43, size: 38 },
  eyes: { x: 60, y: 62, size: 43 },
  ears: { x: 60, y: 58, size: 44 },
  neck: { x: 60, y: 98, size: 39 },
  back: { x: 96, y: 105, size: 39 }
}

export function CharacterAvatar({ character, className = '', decorative = true, speaking = false, gesture = 'idle', accessory }: {
  character: Character
  className?: string
  decorative?: boolean
  speaking?: boolean
  gesture?: AvatarGesture
  accessory?: ShopItem
}) {
  const rawId = useId()
  const gradientId = `avatar-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const colors = COLORS[character.id] ?? COLORS.dino
  const isPanda = character.id === 'pandi'
  const isLion = character.id === 'leo'
  const isParrot = character.id === 'pico'
  const isTurtle = character.id === 'tuga'
  const isFox = character.id === 'foxy'
  const isOwl = character.id === 'oliva'
  const isBunny = character.id === 'bunny'
  const isRobot = character.id === 'robo'
  const isDinosaur = character.id === 'dino' || character.id === 'luna'

  return (
    <svg
      viewBox="0 0 120 160"
      className={`character-avatar ${speaking ? 'is-speaking' : ''} avatar-${gesture} ${className}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : character.name}
      aria-hidden={decorative}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="48%" stopColor={colors.body} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="153" rx="31" ry="4" fill="#0f172a" opacity=".16" />
      {isLion && <path d="M18 57a42 42 0 1 1 84 0v9H18z" fill={colors.accent} stroke={colors.dark} strokeWidth="4" />}
      {isFox && <path d="M42 107c-19-17-33-10-30 4 2 10 13 15 27 8l12-9" fill={colors.body} stroke={colors.dark} strokeWidth="4" />}
      {isBunny && <>
        <ellipse cx="43" cy="29" rx="10" ry="25" fill={colors.body} stroke={colors.dark} strokeWidth="4" transform="rotate(-12 43 29)" />
        <ellipse cx="69" cy="27" rx="10" ry="25" fill={colors.body} stroke={colors.dark} strokeWidth="4" transform="rotate(10 69 27)" />
        <ellipse cx="43" cy="29" rx="4" ry="16" fill={colors.accent} transform="rotate(-12 43 29)" />
        <ellipse cx="69" cy="27" rx="4" ry="16" fill={colors.accent} transform="rotate(10 69 27)" />
      </>}
      {isOwl && <path d="m35 37 4-17 13 14 8-17 10 17 13-14 3 19" fill={colors.accent} stroke={colors.dark} strokeWidth="3" strokeLinejoin="round" />}
      {isRobot && <>
        <path d="M60 18v12" fill="none" stroke={colors.dark} strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="14" r="6" fill={colors.accent} stroke={colors.dark} strokeWidth="3" />
      </>}
      {isPanda && <>
        <circle cx="34" cy="31" r="13" fill={colors.dark} />
        <circle cx="86" cy="31" r="13" fill={colors.dark} />
      </>}
      {isDinosaur && <>
        <path d="M34 34 39 18l11 13 10-17 8 17 12-10 2 17" fill={colors.accent} stroke={colors.dark} strokeWidth="3" strokeLinejoin="round" />
      </>}
      {isTurtle && <path d="M27 109c0-24 13-39 33-39s33 15 33 39v9H27z" fill={colors.dark} stroke="#365314" strokeWidth="4" />}
      {isDinosaur && <path d="M51 92c-6 7-13 14-23 20-7 5-13 4-20-2 9 0 12-6 17-14l9-15" fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" />}
      <path d="M42 126c-8 8-11 14-9 22h19l4-17M78 126c8 8 11 14 9 22H68l-4-17" fill={colors.dark} stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
      <g className="avatar-arm avatar-arm-left">
        <path d="M38 91c-10 6-16 16-14 25 2 7 10 8 17 1l10-13" fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth="4" strokeLinecap="round" />
        <circle cx="24" cy="116" r="6" fill={colors.light} stroke={colors.dark} strokeWidth="3" />
      </g>
      <g className="avatar-arm avatar-arm-right">
        <path d="M82 91c10 6 16 16 14 25-2 7-10 8-17 1L69 104" fill={colors.body} stroke={colors.dark} strokeWidth="4" strokeLinecap="round" />
        <circle cx="96" cy="116" r="6" fill={colors.light} stroke={colors.dark} strokeWidth="3" />
      </g>
      {isParrot && <path d="M79 94c20 8 24 20 15 29-8 8-17 4-23-4" fill={colors.accent} stroke={colors.dark} strokeWidth="4" />}
      <path d="M34 91c0-19 11-31 26-31s26 12 26 31v31c0 14-12 20-26 20s-26-6-26-20z" fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth="4" />
      <ellipse cx="60" cy="109" rx="16" ry="19" fill={colors.light} opacity=".92" />
      {isTurtle && <path d="M45 94c5-13 25-13 30 0M47 104c7-7 19-7 26 0M49 114c6-5 16-5 22 0" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" />}
      {isLion && <path d="M41 94c11-10 27-10 38 0l-6 13H47z" fill={colors.accent} opacity=".9" />}
      {isOwl && <path d="M42 94c3-10 12-15 18-15s15 5 18 15v20c-10 10-26 10-36 0z" fill={colors.accent} opacity=".85" />}
      {isFox && <path d="M36 49 29 18l27 17M65 35l27-17-7 32" fill={colors.body} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" />}
      {isRobot
        ? <rect x="27" y="20" width="66" height="76" rx="20" fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth="4" />
        : <path d="M27 54c0-23 14-37 33-37s33 14 33 37v11c0 20-14 33-33 33S27 85 27 65z" fill={`url(#${gradientId})`} stroke={colors.dark} strokeWidth="4" />}
      {isParrot && <path d="M74 48c22 2 27 16 8 24L69 61z" fill={colors.accent} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" />}
      {isOwl && <path d="m55 68 5 8 5-8z" fill={colors.accent} stroke={colors.dark} strokeWidth="2" strokeLinejoin="round" />}
      {isPanda && <>
        <ellipse cx="45" cy="59" rx="9" ry="13" fill={colors.dark} transform="rotate(22 45 59)" />
        <ellipse cx="75" cy="59" rx="9" ry="13" fill={colors.dark} transform="rotate(-22 75 59)" />
      </>}
      {isRobot
        ? <g className="avatar-eyes">
            <rect x="42" y="53" width="13" height="12" rx="4" fill={colors.accent} />
            <rect x="65" y="53" width="13" height="12" rx="4" fill={colors.accent} />
          </g>
        : <g className="avatar-eyes">
            <ellipse cx="50" cy="60" rx="4" ry="5.5" fill="#0f172a" />
            <ellipse cx="70" cy="60" rx="4" ry="5.5" fill="#0f172a" />
            <circle cx="51" cy="58" r="1.5" fill="white" />
            <circle cx="71" cy="58" r="1.5" fill="white" />
          </g>}
      {!isParrot && <ellipse cx="60" cy="70" rx="4" ry="3" fill={colors.dark} />}
      {speaking
        ? <ellipse className="avatar-mouth-open" cx="60" cy="79" rx="5.5" ry="3.5" fill="#7c2d12" />
        : <path d="M52 77c4 5 12 5 16 0" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />}
      <ellipse cx="39" cy="72" rx="5" ry="3" fill={colors.accent} opacity=".6" />
      <ellipse cx="81" cy="72" rx="5" ry="3" fill={colors.accent} opacity=".6" />
      {accessory?.placement && (
        <text
          x={ACCESSORY_POSITION[accessory.placement].x}
          y={ACCESSORY_POSITION[accessory.placement].y}
          fontSize={ACCESSORY_POSITION[accessory.placement].size}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {accessory.icon}
        </text>
      )}
    </svg>
  )
}
