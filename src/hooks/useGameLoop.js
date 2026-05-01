import { useEffect, useRef } from 'react'
import { useGameStore } from '../store'

export function useGameLoop() {
  const tickTime = useGameStore((s) => s.tickTime)
  const finalizeResults = useGameStore((s) => s.finalizeResults)
  const screen = useGameStore((s) => s.screen)
  const rafRef = useRef(null)
  const lastRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    if (screen !== 'game') return
    doneRef.current = false
    lastRef.current = performance.now()

    const loop = (now) => {
      if (doneRef.current) return
      const delta = (now - lastRef.current) / 1000
      lastRef.current = now
      const remaining = tickTime(delta)
      if (remaining <= 0) {
        doneRef.current = true
        finalizeResults()
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      doneRef.current = true
      cancelAnimationFrame(rafRef.current)
    }
  }, [screen])
}
