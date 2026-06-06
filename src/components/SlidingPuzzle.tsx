import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Tile } from './Tile'
import clickSound from '../assets/click.wav'
import victorySound from '../assets/victory.wav'
import forestImage from '../assets/nature-forest.jpg'
import lakeImage from '../assets/nature-lake.jpg'
import hillsImage from '../assets/nature-hills.jpg'
import sunriseImage from '../assets/nature-sunrise.jpg'
import canyonImage from '../assets/nature-canyon.jpg'

type Theme = 'light' | 'dark'

type ImageOption = {
  id: string
  name: string
  src: string
}

const IMAGE_OPTIONS: ImageOption[] = [
  { id: 'forest', name: 'Forest', src: forestImage },
  { id: 'lake', name: 'Lake', src: lakeImage },
  { id: 'hills', name: 'Hills', src: hillsImage },
  { id: 'sunrise', name: 'Sunrise', src: sunriseImage },
  { id: 'canyon', name: 'Canyon', src: canyonImage },
]

function createSolvedTiles(size: number) {
  return Array.from({ length: size * size }, (_, index) => (index === size * size - 1 ? 0 : index + 1))
}

function getRandomImageId(currentId: string) {
  const available = IMAGE_OPTIONS.filter((option) => option.id !== currentId)
  return available[Math.floor(Math.random() * available.length)].id
}

function getRandomSize(currentSize: number) {
  const available = [3, 4, 5].filter((size) => size !== currentSize)
  return available[Math.floor(Math.random() * available.length)]
}

function getAdjacentIndices(index: number, size: number) {
  const row = Math.floor(index / size)
  const col = index % size
  const candidates = [index - 1, index + 1, index - size, index + size]
  return candidates.filter((candidate) => {
    if (candidate < 0 || candidate >= size * size) return false
    const candidateRow = Math.floor(candidate / size)
    const candidateCol = candidate % size
    return Math.abs(candidateRow - row) + Math.abs(candidateCol - col) === 1
  })
}

function moveTile(tiles: number[], tileIndex: number, size: number) {
  const emptyIndex = tiles.indexOf(0)
  if (!getAdjacentIndices(tileIndex, size).includes(emptyIndex)) {
    return tiles
  }
  const nextTiles = [...tiles]
  nextTiles[emptyIndex] = nextTiles[tileIndex]
  nextTiles[tileIndex] = 0
  return nextTiles
}

function shuffleTiles(tiles: number[], size: number) {
  let nextTiles = [...tiles]
  let emptyIndex = nextTiles.indexOf(0)
  for (let i = 0; i < 120; i += 1) {
    const adjacent = getAdjacentIndices(emptyIndex, size)
    const nextIndex = adjacent[Math.floor(Math.random() * adjacent.length)]
    nextTiles = moveTile(nextTiles, nextIndex, size)
    emptyIndex = nextTiles.indexOf(0)
  }
  return nextTiles
}

function getBackgroundStyle(value: number, size: number, image: string) {
  if (value === 0) {
    return {
      backgroundColor: '#0f172a',
    }
  }

  const solvedIndex = value - 1
  const row = Math.floor(solvedIndex / size)
  const col = solvedIndex % size
  const axisCount = size - 1
  const positionX = axisCount > 0 ? (col / axisCount) * 100 : 0
  const positionY = axisCount > 0 ? (row / axisCount) * 100 : 0

  return {
    backgroundImage: `url(${image})`,
    backgroundPosition: `${positionX}% ${positionY}%`,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundRepeat: 'no-repeat',
    minHeight: '96px',
  }
}

interface SlidingPuzzleProps {
  theme: Theme
}

export function SlidingPuzzle({ theme }: SlidingPuzzleProps) {
  const [size, setSize] = useState(3)
  const [imageId, setImageId] = useState('forest')
  const [tiles, setTiles] = useState<number[]>(createSolvedTiles(size))
  const [hasStarted, setHasStarted] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hintTimeoutRef = useRef<number | null>(null)

  const clickAudio = useMemo(() => {
    const audio = new Audio(clickSound)
    audio.volume = 0.4
    return audio
  }, [])

  const victoryAudio = useMemo(() => {
    const audio = new Audio(victorySound)
    audio.volume = 0.45
    return audio
  }, [])

  const image = IMAGE_OPTIONS.find((option) => option.id === imageId) ?? IMAGE_OPTIONS[0]

  const solvedTiles = useMemo(() => createSolvedTiles(size), [size])
  const isSolved = useMemo(
    () => tiles.every((value, index) => value === solvedTiles[index]),
    [tiles, solvedTiles],
  )

  useEffect(() => {
    setShowVictory(false)
    setShowHint(false)
    if (!hasStarted) {
      setTiles(createSolvedTiles(size))
    }
    return () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current)
      }
    }
  }, [size, imageId, hasStarted])

  useEffect(() => {
    if (isSolved && hasStarted) {
      victoryAudio.currentTime = 0
      victoryAudio.play().catch(() => {})
      setShowVictory(true)
    }
  }, [isSolved, hasStarted, victoryAudio])

  const handleTileClick = (index: number) => {
    setHasStarted(true)
    clickAudio.currentTime = 0
    clickAudio.play().catch(() => {})
    setTiles((current) => moveTile(current, index, size))
  }

  const handleHint = () => {
    setShowHint(true)
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current)
    }
    hintTimeoutRef.current = window.setTimeout(() => setShowHint(false), 3800)
  }

  const handleShuffle = () => {
    setShowVictory(false)
    setShowHint(false)
    setHasStarted(true)
    setTiles((current) => shuffleTiles(current, size))
  }

  const handleNextPuzzle = () => {
    const nextImageId = getRandomImageId(imageId)
    const nextSize = getRandomSize(size)
    const nextTiles = shuffleTiles(createSolvedTiles(nextSize), nextSize)

    setImageId(nextImageId)
    setSize(nextSize)
    setTiles(nextTiles)
    setShowVictory(false)
    setShowHint(false)
    setHasStarted(true)
  }

  const boardClasses =
    theme === 'dark'
      ? 'border-slate-700/70 bg-slate-950/95 text-slate-100'
      : 'border-slate-200/80 bg-slate-50 text-slate-950'

  const panelClasses =
    theme === 'dark'
      ? 'bg-slate-900 text-slate-300'
      : 'bg-slate-100 text-slate-700'

  const labelClasses = theme === 'dark' ? 'text-slate-200' : 'text-slate-700'

  const gridClasses =
    size === 3 ? 'grid-cols-3' : size === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <div className={`max-w-3xl rounded-4xl border p-6 shadow-2xl shadow-slate-950/40 ${boardClasses}`}>
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Sliding Puzzle</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Choose a nature image and board size. If the puzzle is too hard, switch to a smaller grid or a different picture.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-400/40"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={handleHint}
              className="inline-flex items-center justify-center rounded-3xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-sky-400/40"
            >
              Hint
            </button>
          </div>
          <div className={`rounded-3xl px-4 py-3 text-sm ${panelClasses}`}>
            {isSolved ? 'Solved! Nice work.' : 'Click a tile next to the empty space to move it.'}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-4xl overflow-hidden border border-slate-500/10 bg-slate-950 shadow-inner">
          <img src={image.src} alt={`${image.name} preview`} className="h-72 w-full object-cover" />
          <div className={`border-t px-4 py-4 text-sm ${panelClasses}`}>
            Solved preview of the {image.name} puzzle.
          </div>
        </div>

        <div className="rounded-4xl border border-slate-500/10 bg-slate-900/10 p-4">
          <div className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${labelClasses}`}>Board size</div>
          <div className="flex flex-wrap gap-3">
            {[3, 4, 5].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSize(option)
                  setShowVictory(false)
                  setShowHint(false)
                  setHasStarted(true)
                  setTiles(shuffleTiles(createSolvedTiles(option), option))
                }}
                className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                  size === option
                    ? 'bg-sky-500 text-white'
                    : theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {option}×{option}
              </button>
            ))}
          </div>

          <div className={`mt-6 mb-3 text-sm font-semibold uppercase tracking-[0.2em] ${labelClasses}`}>Image</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {IMAGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setImageId(option.id)
                  setShowVictory(false)
                  setHasStarted(true)
                  setTiles(shuffleTiles(createSolvedTiles(size), size))
                }}
                className={`rounded-3xl border px-4 py-3 text-left transition ${
                  imageId === option.id
                    ? 'border-sky-400 bg-sky-500/10 text-sky-200'
                    : theme === 'dark'
                    ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="text-sm font-semibold">{option.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid ${gridClasses} gap-1`}>
        {tiles.map((value, index) => {
          const emptyIndex = tiles.indexOf(0)
          const isEmpty = value === 0
          const isMovable = getAdjacentIndices(index, size).includes(emptyIndex)

          return (
            <Tile
              key={value === 0 ? `empty-${index}` : `${image.id}-${value}`}
              value={value}
              isEmpty={isEmpty}
              isMovable={!isEmpty && isMovable}
              style={getBackgroundStyle(value, size, image.src)}
              onClick={() => handleTileClick(index)}
              theme={theme}
            />
          )
        })}
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed inset-x-0 top-6 z-40 flex justify-center px-4"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-3xl border border-slate-300/10 bg-slate-950/95 px-5 py-3 text-sm text-slate-100 shadow-xl shadow-slate-950/40 backdrop-blur-md">
              <p className="font-semibold text-sky-300">Hint ready</p>
              <p className="mt-1 max-w-xl leading-6 text-slate-300">
                Try solving the top-left region first and keep the empty tile near the area you want to shift. Small moves build the full picture.
              </p>
            </div>
          </motion.div>
        )}
        {showVictory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-4xl border border-sky-400/25 bg-slate-900/95 p-8 text-center shadow-2xl shadow-sky-500/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-4xl">
                {[...Array(8)].map((_, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-4 w-4 rounded-full bg-sky-400/70"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.1 }}
                    style={{
                      top: `${10 + (index % 4) * 18}%`,
                      left: `${15 + (index % 3) * 20}%`,
                    }}
                  />
                ))}
              </div>

              <div className="relative">
                <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-300">Puzzle complete</p>
                <h2 className="mb-4 text-5xl font-bold tracking-tight text-white">Congratulations!</h2>
                <p className="mb-8 text-base leading-7 text-slate-300">
                  You did it — the full image preview helps you finish the puzzle. Ready for the next challenge?
                </p>
                <button
                  type="button"
                  onClick={handleNextPuzzle}
                  className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-sky-500/30 transition hover:bg-sky-400"
                >
                  Go for next puzzle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
