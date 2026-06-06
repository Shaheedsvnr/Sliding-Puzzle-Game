# Sliding Puzzle Game

A React + TypeScript sliding puzzle game built with Vite and Tailwind CSS.

## Features

- Dynamic 3×3, 4×4, and 5×5 puzzle boards
- Five built-in nature image puzzles
- Shuffle and move adjacent tiles
- Solved-board preview image
- Light and dark theme support
- Animated victory overlay using Framer Motion
- Infinite puzzle progression with randomized next challenges

## Project structure

- `src/App.tsx` — app entry and theme toggle
- `src/components/SlidingPuzzle.tsx` — puzzle logic, board, preview, and victory overlay
- `src/components/Tile.tsx` — tile component
- `src/assets/` — nature images used for the puzzle tiles

## Getting started

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview the production build

```bash
npm run preview
```

If you want to create the repository manually, use GitHub and then add the remote URL above.

## Notes

- The puzzle automatically resets when the image or board size changes.
- The victory popper appears as soon as the puzzle is solved.
- The next puzzle button loads a new size and image randomly for infinite replay.
