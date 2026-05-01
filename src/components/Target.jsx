import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Target({ target, onHit, color }) {
  const { id, x, y, size, spawnTime } = target

  return (
    <motion.div
      key={id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.2, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, duration: 0.15 }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        cursor: 'crosshair',
        background: `radial-gradient(circle at 35% 30%, ${color}ff, ${color}99)`,
        boxShadow: `0 0 16px ${color}55, inset 0 0 12px rgba(255,255,255,0.1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        e.stopPropagation()
        onHit(id, Date.now() - spawnTime, e.clientX, e.clientY)
      }}
    >
      <div style={{
        width: '30%',
        height: '30%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.55)',
      }} />
    </motion.div>
  )
}
