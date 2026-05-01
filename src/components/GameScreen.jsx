import React, { useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore, MODES } from '../store'
import { useGameLoop } from '../hooks/useGameLoop'
import { useTargetSpawner } from '../hooks/useTargetSpawner'
import { useTracking } from '../hooks/useTracking'
import HUD from './HUD'
import Target from './Target'
import HitEffect from './HitEffect'
import styles from './GameScreen.module.css'

export default function GameScreen() {
  const { mode, registerHit, registerMiss, addTrackingScore } = useGameStore((s) => ({
    mode: s.mode,
    registerHit: s.registerHit,
    registerMiss: s.registerMiss,
    addTrackingScore: s.addTrackingScore,
  }))
  const cfg = MODES[mode]
  const arenaRef = useRef(null)
  const [effects, setEffects] = useState([])
  const [flashMiss, setFlashMiss] = useState(false)
  const [streakBadge, setStreakBadge] = useState(null)

  useGameLoop()

  const { targets, removeTarget } = useTargetSpawner(mode, arenaRef, true)
  const { pos, onTarget, size: trackSize } = useTracking(arenaRef, mode === 'tracking', addTrackingScore)

  const addEffect = useCallback((x, y, pts) => {
    const id = crypto.randomUUID()
    setEffects((prev) => [...prev, { id, x, y, pts }])
    setTimeout(() => setEffects((prev) => prev.filter((e) => e.id !== id)), 700)
  }, [])

  const handleHit = useCallback((id, reactTime, clientX, clientY) => {
    const rect = arenaRef.current?.getBoundingClientRect()
    if (!rect) return
    const pts = registerHit(reactTime)
    removeTarget(id)
    addEffect(clientX - rect.left, clientY - rect.top, pts)

    const streak = useGameStore.getState().streak
    if (streak === 5 || streak === 10 || streak === 15 || streak % 20 === 0) {
      setStreakBadge(streak)
      setTimeout(() => setStreakBadge(null), 1800)
    }
  }, [registerHit, removeTarget, addEffect])

  const handleMiss = useCallback((e) => {
    if (e.target !== arenaRef.current) return
    if (mode === 'tracking') return
    registerMiss()
    setFlashMiss(true)
    setTimeout(() => setFlashMiss(false), 250)
  }, [registerMiss, mode])

  return (
    <div className={styles.screen}>
      <HUD />
      <div
        ref={arenaRef}
        className={styles.arena}
        onClick={handleMiss}
        style={{ cursor: 'crosshair' }}
      >
        {/* Miss flash */}
        {flashMiss && <div className={styles.missFlash} />}

        {/* Streak badge */}
        <AnimatePresence>
          {streakBadge && (
            <motion.div
              key={streakBadge}
              className={styles.streakBadge}
              style={{ borderColor: cfg.color + '66', color: cfg.color, background: cfg.dimColor }}
              initial={{ opacity: 0, y: 10, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
            >
              {streakBadge}× streak!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard targets */}
        {mode !== 'tracking' && (
          <AnimatePresence>
            {targets.map((t) => (
              <Target
                key={t.id}
                target={t}
                onHit={handleHit}
                color={cfg.color}
              />
            ))}
          </AnimatePresence>
        )}

        {/* Tracking mode target */}
        {mode === 'tracking' && (
          <motion.div
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: trackSize,
              height: trackSize,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, ${cfg.color}ff, ${cfg.color}99)`,
              boxShadow: onTarget
                ? `0 0 32px ${cfg.color}aa, 0 0 8px ${cfg.color}`
                : `0 0 16px ${cfg.color}44`,
              pointerEvents: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'box-shadow 0.08s',
            }}
          >
            <div style={{ width: '30%', height: '30%', borderRadius: '50%', background: 'rgba(255,255,255,0.55)' }} />
          </motion.div>
        )}

        {/* Tracking ring */}
        {mode === 'tracking' && (
          <div style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: trackSize + 24,
            height: trackSize + 24,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `1px solid ${cfg.color}${onTarget ? '88' : '22'}`,
            pointerEvents: 'none',
            transition: 'border-color 0.08s',
          }} />
        )}

        {/* Hit effects */}
        <AnimatePresence>
          {effects.map((e) => (
            <HitEffect key={e.id} x={e.x} y={e.y} pts={e.pts} color={cfg.color} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
