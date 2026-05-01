import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, MODES } from '../store'

export default function CountdownScreen() {
  const [count, setCount] = useState(3)
  const { setScreen, mode } = useGameStore((s) => ({ setScreen: s.setScreen, mode: s.mode }))
  const cfg = MODES[mode]

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(() => setScreen('game'), 500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800)
    return () => clearTimeout(t)
  }, [count])

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1rem',
      background: 'var(--bg)',
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: count === 0 ? '72px' : '120px',
            fontWeight: 700,
            color: count === 0 ? cfg.color : 'var(--text-primary)',
            textShadow: count === 0 ? `0 0 60px ${cfg.color}` : 'none',
            lineHeight: 1,
          }}
        >
          {count === 0 ? 'GO!' : count}
        </motion.div>
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '12px',
          color: cfg.color,
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}
      >
        {cfg.label} mode
      </motion.p>
    </div>
  )
}
