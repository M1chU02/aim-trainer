# AimTrainer

A precision aim training web app built with React + Vite + Framer Motion + Zustand.

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Game Modes

| Mode | Description |
|------|-------------|
| **Precision** | Classic stationary targets, 30s round |
| **Flick** | Large targets with short lifetime — snap aim training |
| **Tracking** | Move your mouse to stay on a bouncing target |
| **Gridshot** | 3 targets simultaneously with combo multiplier |
| **Micro** | Tiny targets (10–20px) for pixel-perfect accuracy |
| **Endless** | Hits add time (+2s), misses cost time (-1.5s) |

## Scoring

- Base score per hit varies by mode (250 for Micro, 80 for Flick, 100 for others)
- Reaction bonus: <200ms = 1.5×, <350ms = 1.2×
- Gridshot multiplier: grows 0.5× per target cleared (max 6×), shrinks on misses
- Grade S = 90%+ accuracy with 20+ hits

## Tech Stack

- **React 18** — UI
- **Zustand** — game state management
- **Framer Motion** — target pop-in/out, hit effects, screen transitions
- **Vite** — dev server and bundler
- **CSS Modules** — scoped styling
