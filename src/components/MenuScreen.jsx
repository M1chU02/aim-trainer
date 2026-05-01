import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore, MODES } from '../store'
import styles from './MenuScreen.module.css'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export default function MenuScreen() {
  const initRound = useGameStore((s) => s.initRound)

  return (
    <div className={styles.screen}>
      <div className={styles.gridBg} />
      <div className={styles.scanline} />

      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.crosshair}>
          <div className={styles.chInner} />
        </div>
        <h1 className={styles.title}>AIMLAB</h1>
        <p className={styles.subtitle}>precision training suite</p>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {Object.values(MODES).map((mode) => (
          <motion.button
            key={mode.id}
            variants={item}
            className={styles.card}
            style={{ '--mode-color': mode.color, '--mode-dim': mode.dimColor }}
            onClick={() => initRound(mode.id)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={styles.cardIcon}>{mode.icon}</span>
            <span className={styles.cardName}>{mode.label.toUpperCase()}</span>
            <span className={styles.cardDesc}>{mode.description}</span>
            <span className={styles.cardTag}>{mode.tag}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        click a mode to start
      </motion.p>
    </div>
  )
}
