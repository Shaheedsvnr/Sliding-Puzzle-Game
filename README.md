# Sliding Puzzle Game

A React + TypeScript sliding puzzle game built with Vite and Tailwind CSS.


## Live demo

- https://sliding-puzzle-game-bice.vercel.app/

## Technologies and concepts used

- React 19 with functional components and hooks
- TypeScript for type-safe component logic
- Vite for fast development and optimized production builds
- Tailwind CSS for utility-first styling and responsive layout
- Framer Motion for animated tile motion and victory overlay
- Audio feedback with browser `Audio` playback
- Puzzle logic including shuffle, adjacency checks, and board state management
- Theme support for light and dark modes
- Infinite puzzle progression with random next challenge selection


## Features

- Dynamic 3×3, 4×4, and 5×5 puzzle boards
- Five built-in nature image puzzles
- Shuffle and move adjacent tiles
- Solved-board preview image
- Light and dark theme support
- Animated victory overlay using Framer Motion
- Infinite puzzle progression with randomized next challenges

## Getting started

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

If you want to create the repository manually, use GitHub and then add the remote URL above.

## Notes

- The puzzle automatically resets when the image or board size changes.
- The victory popper appears as soon as the puzzle is solved.
- The next puzzle button loads a new size and image randomly for infinite replay.
