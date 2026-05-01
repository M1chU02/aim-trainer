import { create } from 'zustand'

export const MODES = {
  precision: {
    id: 'precision',
    label: 'Precision',
    tag: 'CLASSIC',
    description: 'Click stationary targets as fast and accurately as possible',
    color: '#00d4ff',
    dimColor: '#00d4ff22',
    icon: '◎',
    duration: 30,
    spawnInterval: 750,
    targetSize: [32, 56],
    maxTargets: 1,
    scorePerHit: 100,
    missTimePenalty: 0,
  },
  flick: {
    id: 'flick',
    label: 'Flick',
    tag: 'SPEED',
    description: 'Large targets appear briefly — train explosive snap movements',
    color: '#ff6b35',
    dimColor: '#ff6b3522',
    icon: '⚡',
    duration: 30,
    spawnInterval: 550,
    targetSize: [60, 88],
    targetLifetime: 1200,
    maxTargets: 1,
    scorePerHit: 80,
    missTimePenalty: 0,
  },
  tracking: {
    id: 'tracking',
    label: 'Tracking',
    tag: 'SMOOTH',
    description: 'Keep your crosshair on the moving target — score builds while on-target',
    color: '#8b5cf6',
    dimColor: '#8b5cf622',
    icon: '◈',
    duration: 30,
    spawnInterval: 0,
    targetSize: [52, 52],
    maxTargets: 1,
    scorePerHit: 0,
    missTimePenalty: 0,
  },
  gridshot: {
    id: 'gridshot',
    label: 'Gridshot',
    tag: 'COMBO',
    description: '3 targets at once — clear sets quickly for a growing multiplier',
    color: '#22c55e',
    dimColor: '#22c55e22',
    icon: '⊞',
    duration: 30,
    spawnInterval: 0,
    targetSize: [32, 50],
    maxTargets: 3,
    scorePerHit: 100,
    missTimePenalty: 0,
  },
  micro: {
    id: 'micro',
    label: 'Micro',
    tag: 'PRECISE',
    description: 'Tiny targets demand pixel-perfect mouse control',
    color: '#f59e0b',
    dimColor: '#f59e0b22',
    icon: '◉',
    duration: 30,
    spawnInterval: 900,
    targetSize: [10, 20],
    maxTargets: 2,
    scorePerHit: 250,
    missTimePenalty: 0,
  },
  endless: {
    id: 'endless',
    label: 'Endless',
    tag: 'SURVIVAL',
    description: 'Each hit adds 2s, each miss costs 1.5s — how long can you last?',
    color: '#ec4899',
    dimColor: '#ec489922',
    icon: '∞',
    duration: 20,
    spawnInterval: 700,
    targetSize: [28, 52],
    maxTargets: 1,
    scorePerHit: 100,
    missTimePenalty: 1.5,
    hitTimeBonus: 2,
  },
}

export const useGameStore = create((set, get) => ({
  screen: 'menu', // menu | countdown | game | results
  mode: null,

  // live stats
  score: 0,
  hits: 0,
  misses: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  timeLeft: 30,
  maxTime: 30,
  reactTimes: [],

  // results snapshot
  results: null,

  setScreen: (screen) => set({ screen }),
  setMode: (mode) => set({ mode }),

  initRound: (modeId) => {
    const cfg = MODES[modeId]
    set({
      mode: modeId,
      screen: 'countdown',
      score: 0,
      hits: 0,
      misses: 0,
      streak: 0,
      bestStreak: 0,
      multiplier: 1,
      timeLeft: cfg.duration,
      maxTime: cfg.duration,
      reactTimes: [],
      results: null,
    })
  },

  registerHit: (reactTimeMs) => {
    const { score, hits, streak, bestStreak, multiplier, timeLeft, maxTime, mode } = get()
    const cfg = MODES[mode]
    const newStreak = streak + 1
    const newBest = Math.max(bestStreak, newStreak)

    let pts = cfg.scorePerHit * multiplier
    if (reactTimeMs < 200) pts = Math.round(pts * 1.5)
    else if (reactTimeMs < 350) pts = Math.round(pts * 1.2)

    const newMultiplier = mode === 'gridshot'
      ? Math.min(6, multiplier + 0.5)
      : multiplier

    const newTime = mode === 'endless'
      ? Math.min(maxTime, timeLeft + (cfg.hitTimeBonus || 0))
      : timeLeft

    set({
      score: score + pts,
      hits: hits + 1,
      streak: newStreak,
      bestStreak: newBest,
      multiplier: newMultiplier,
      timeLeft: newTime,
      reactTimes: [...get().reactTimes, reactTimeMs],
    })
    return pts
  },

  registerMiss: () => {
    const { misses, timeLeft, mode, multiplier } = get()
    const cfg = MODES[mode]
    const newTime = mode === 'endless'
      ? Math.max(0, timeLeft - (cfg.missTimePenalty || 0))
      : timeLeft
    const newMult = mode === 'gridshot' ? Math.max(1, multiplier - 0.5) : multiplier
    set({ misses: misses + 1, streak: 0, timeLeft: newTime, multiplier: newMult })
  },

  addTrackingScore: (pts) => {
    set((s) => ({ score: s.score + pts }))
  },

  tickTime: (delta) => {
    const newTime = Math.max(0, get().timeLeft - delta)
    set({ timeLeft: newTime })
    return newTime
  },

  finalizeResults: () => {
    const { score, hits, misses, bestStreak, reactTimes, mode } = get()
    const total = hits + misses
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0
    const avgReact = reactTimes.length > 0
      ? Math.round(reactTimes.reduce((a, b) => a + b, 0) / reactTimes.length)
      : 0
    const bestReact = reactTimes.length > 0 ? Math.min(...reactTimes) : 0

    let grade = 'D'
    if (mode === 'tracking') {
      if (score > 3000) grade = 'S'
      else if (score > 2000) grade = 'A'
      else if (score > 1200) grade = 'B'
      else if (score > 600) grade = 'C'
    } else {
      if (accuracy >= 90 && hits >= 20) grade = 'S'
      else if (accuracy >= 80 && hits >= 12) grade = 'A'
      else if (accuracy >= 65) grade = 'B'
      else if (accuracy >= 50) grade = 'C'
    }

    const results = { score, hits, misses, accuracy, bestStreak, avgReact, bestReact, grade, mode }
    set({ results, screen: 'results' })
  },
}))
