import React from 'react'
import { motion } from 'framer-motion'
import { useGameStore, MODES } from '../store'
import styles from './ResultsScreen.module.css'

const GRADE_COLORS = {
  S: { color: '#f59e0b', bg: '#f59e0b22', label: 'Outstanding' },
  A: { color: '#22c55e', bg: '#22c55e22', label: 'Excellent' },
  B: { color: '#00d4ff', bg: '#00d4ff22', label: 'Good' },
  C: { color: '#8b5cf6', bg: '#8b5cf622', label: 'Average' },
  D: { color: '#ef4444', bg: '#ef444422', label: 'Keep Practicing' },
}

export default function ResultsScreen() {
  const { results, initRound, setScreen } = useGameStore((s) => ({
    results: s.results,
    initRound: s.initRound,
    setScreen: s.setScreen,
  }))

  if (!results) return null

  const cfg = MODES[results.mode]
  const gc = GRADE_COLORS[results.grade]

  const stats = [
    { label: 'Hits', value: results.hits, color: 'var(--green)' },
    { label: 'Misses', value: results.misses, color: 'var(--red)' },
    { label: 'Accuracy', value: results.accuracy + '%', color: 'var(--amber)' },
    { label: 'Best Streak', value: results.bestStreak, color: cfg.color },
    { label: 'Avg React', value: results.avgReact > 0 ? results.avgReact + 'ms' : '--', color: 'var(--text-primary)' },
    { label: 'Best React', value: results.bestReact > 0 ? results.bestReact + 'ms' : '--', color: 'var(--cyan)' },
  ]

  return (
    <div className={styles.screen}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <div className={styles.top}>
          <motion.div
            className={styles.gradeBadge}
            style={{ color: gc.color, borderColor: gc.color, background: gc.bg }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
          >
            {results.grade}
          </motion.div>

          <div className={styles.roundOver}>Round Over</div>
          <div className={styles.modeLabel} style={{ color: cfg.color }}>
            {cfg.label.toUpperCase()} MODE
          </div>

          <motion.div
            className={styles.score}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className={styles.scoreNum} style={{ color: cfg.color }}>
              {results.score.toLocaleString()}
            </span>
            <span className={styles.scoreLabel}>score</span>
          </motion.div>

          <div className={styles.gradeLabel} style={{ color: gc.color }}>
            {gc.label}
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={styles.statCell}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <span className={styles.statVal} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLbl}>{s.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.btnRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className={styles.btnPrimary}
            style={{ borderColor: cfg.color, color: cfg.color, background: cfg.dimColor }}
            onClick={() => initRound(results.mode)}
          >
            Play Again
          </button>
          <button
            className={styles.btnSecondary}
            onClick={() => setScreen('menu')}
          >
            Menu
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
