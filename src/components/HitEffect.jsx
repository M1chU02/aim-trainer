import React from 'react'
import { motion } from 'framer-motion'

export default function HitEffect({ x, y, pts, color, id }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: '-50%' }}
      animate={{ opacity: 0, y: -50, x: '-50%' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        fontFamily: 'var(--mono)',
        fontSize: 14,
        fontWeight: 600,
        color,
        zIndex: 20,
        whiteSpace: 'nowrap',
      }}
    >
      +{pts}
    </motion.div>
  )
}
