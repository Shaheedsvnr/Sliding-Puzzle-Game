import type { CSSProperties, MouseEventHandler } from 'react'

interface TileProps {
  value: number
  isEmpty: boolean
  isMovable: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  style?: CSSProperties
  theme: 'light' | 'dark'
}

export function Tile({ value, isEmpty, isMovable, onClick, style, theme }: TileProps) {
  const tileClasses = [
    'relative',
    // 'rounded-3xl',
    // 'border',
    'transition',
    'duration-200',
    'focus:outline-none',
    'focus:ring-4',
    'focus:ring-sky-400/40',
    'shadow-lg',
    'overflow-hidden',
  ]

  if (isEmpty) {
    tileClasses.push(
      theme === 'dark' ? 'bg-slate-950 border-slate-700/80 text-slate-600 shadow-inner' : 'bg-slate-100 border-slate-300 text-slate-400 shadow-inner',
    )
  } else if (isMovable) {
    tileClasses.push('border-sky-400 bg-slate-900/10 shadow-xl hover:border-sky-300 hover:shadow-sky-500/20')
  } else {
    tileClasses.push(theme === 'dark' ? 'border-slate-700 bg-slate-800 text-white/90' : 'border-slate-300 bg-slate-100 text-slate-900')
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isMovable && !isEmpty}
      className={tileClasses.join(' ')}
      style={style}
      aria-label={isEmpty ? 'Empty tile' : `Tile ${value}`}
    />
  )
}
