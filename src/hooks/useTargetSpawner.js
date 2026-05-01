import { useState, useEffect, useRef, useCallback } from 'react'
import { MODES } from '../store'

export function useTargetSpawner(mode, arenaRef, active) {
  const [targets, setTargets] = useState([])
  const timersRef = useRef([])
  const spawnRef = useRef(null)
  const cfg = MODES[mode]

  const getArenaDimensions = () => {
    if (!arenaRef.current) return { w: 800, h: 500 }
    return { w: arenaRef.current.offsetWidth, h: arenaRef.current.offsetHeight }
  }

  const createTarget = useCallback(() => {
    const { w, h } = getArenaDimensions()
    const [minS, maxS] = cfg.targetSize
    const size = Math.round(minS + Math.random() * (maxS - minS))
    const pad = size / 2 + 12
    const x = pad + Math.random() * (w - pad * 2)
    const y = pad + Math.random() * (h - pad * 2)
    return { id: crypto.randomUUID(), x, y, size, spawnTime: Date.now() }
  }, [mode])

  const removeTarget = useCallback((id) => {
    setTargets((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const spawnOne = useCallback(() => {
    const t = createTarget()
    setTargets((prev) => [...prev, t])

    if (cfg.targetLifetime) {
      const timer = setTimeout(() => removeTarget(t.id), cfg.targetLifetime)
      timersRef.current.push(timer)
    }
    return t
  }, [createTarget, cfg.targetLifetime, removeTarget])

  const spawnSet = useCallback((count) => {
    setTargets([])
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const t = createTarget()
        setTargets((prev) => [...prev, t])
      }, i * 30)
    }
  }, [createTarget])

  // Clear everything
  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    clearTimeout(spawnRef.current)
    setTargets([])
  }, [])

  useEffect(() => {
    if (!active) { clearAll(); return }

    if (mode === 'tracking') return // tracking handled separately

    if (mode === 'gridshot') {
      spawnSet(cfg.maxTargets)
      return
    }

    // standard interval spawning
    const scheduleNext = () => {
      const delay = cfg.spawnInterval + Math.random() * 350
      spawnRef.current = setTimeout(() => {
        if (mode !== 'gridshot') spawnOne()
        scheduleNext()
      }, delay)
    }

    spawnOne()
    scheduleNext()

    return () => clearAll()
  }, [active, mode])

  // When all gridshot targets cleared, respawn
  useEffect(() => {
    if (!active || mode !== 'gridshot') return
    if (targets.length === 0) {
      spawnSet(cfg.maxTargets)
    }
  }, [targets.length, active, mode])

  return { targets, removeTarget, spawnSet }
}
