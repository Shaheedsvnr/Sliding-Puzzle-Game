import { useState } from 'react'
import { SlidingPuzzle } from './components/SlidingPuzzle'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'}`}>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 w-full flex justify-end">
          <button
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            className="rounded-3xl border border-slate-500/40 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
        </div>
        <SlidingPuzzle theme={theme} />
      </div>
    </main>
  )
}

export default App
