import { useState, useEffect, useRef, useCallback } from 'react'

export function useTracking(arenaRef, active, onScore) {
  const [pos, setPos] = useState({ x: 400, y: 250 })
  const [onTarget, setOnTarget] = useState(false)
  const velRef = useRef({ vx: 2.5, vy: 1.8 })
  const mouseRef = useRef({ x: -999, y: -999 })
  const animRef = useRef(null)
  const posRef = useRef({ x: 400, y: 250 })
  const TARGET_SIZE = 52

  useEffect(() => {
    if (!active || !arenaRef.current) return

    const handleMove = (e) => {
      const rect = arenaRef.current.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    arenaRef.current.addEventListener('mousemove', handleMove)

    const loop = () => {
      const arena = arenaRef.current
      if (!arena) return
      const w = arena.offsetWidth
      const h = arena.offsetHeight
      let { x, y } = posRef.current
      let { vx, vy } = velRef.current

      x += vx; y += vy
      if (x < TARGET_SIZE / 2 || x > w - TARGET_SIZE / 2) { vx *= -1; x = Math.max(TARGET_SIZE/2, Math.min(w - TARGET_SIZE/2, x)) }
      if (y < TARGET_SIZE / 2 || y > h - TARGET_SIZE / 2) { vy *= -1; y = Math.max(TARGET_SIZE/2, Math.min(h - TARGET_SIZE/2, y)) }

      // slight random drift
      vx += (Math.random() - 0.5) * 0.15
      vy += (Math.random() - 0.5) * 0.15
      const maxSpeed = 4
      vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx))
      vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy))

      posRef.current = { x, y }
      velRef.current = { vx, vy }

      const dx = mouseRef.current.x - x
      const dy = mouseRef.current.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const hit = dist < TARGET_SIZE / 2 + 4
      setOnTarget(hit)
      if (hit) onScore(2)

      setPos({ x, y })
      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animRef.current)
      arenaRef.current?.removeEventListener('mousemove', handleMove)
    }
  }, [active])

  return { pos, onTarget, size: TARGET_SIZE }
}
