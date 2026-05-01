import React from 'react'
import { useGameStore, MODES } from '../store'
import styles from './HUD.module.css'

export default function HUD() {
  const { score, hits, misses, streak, multiplier, timeLeft, maxTime, mode } = useGameStore((s) => ({
    score: s.score,
    hits: s.hits,
    misses: s.misses,
    streak: s.streak,
    multiplier: s.multiplier,
    timeLeft: s.timeLeft,
    maxTime: s.maxTime,
    mode: s.mode,
  }))

  const cfg = MODES[mode]
  const total = hits + misses
  const acc = total > 0 ? Math.round((hits / total) * 100) : null
  const pct = (timeLeft / maxTime) * 100

  const barColor = pct > 50
    ? cfg.color
    : pct > 25
    ? 'var(--amber)'
    : 'var(--red)'

  return (
    <div className={styles.wrapper}>
      <div className={styles.hud}>
        <Stat label="Score" value={score} color={cfg.color} mono />
        <Sep />
        <Stat label="Hits" value={hits} color="var(--green)" mono />
        <Sep />
        <Stat label="Misses" value={misses} color="var(--red)" mono />
        <Sep />
        <Stat label="Accuracy" value={acc !== null ? acc + '%' : '--'} color="var(--amber)" mono />
        <Sep />
        <Stat label="Streak" value={streak} color={streak >= 10 ? 'var(--green)' : streak >= 5 ? 'var(--amber)' : undefined} mono />
        {mode === 'gridshot' && (
          <>
            <Sep />
            <Stat label="Multi" value={multiplier.toFixed(1) + 'x'} color={cfg.color} mono />
          </>
        )}
        <div className={styles.spacer} />
        <div className={styles.modeTag} style={{ color: cfg.color, borderColor: cfg.color + '44' }}>
          {cfg.label.toUpperCase()}
        </div>
        <Sep />
        <Stat label="Time" value={timeLeft.toFixed(1)} color={pct < 25 ? 'var(--red)' : undefined} mono />
      </div>
      <div className={styles.timerBar}>
        <div
          className={styles.timerFill}
          style={{ width: pct + '%', background: barColor, transition: 'width 0.08s linear, background 0.3s' }}
        />
      </div>
    </div>
  )
}

function Stat({ label, value, color, mono }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? 'var(--mono)' : 'var(--font)',
        fontSize: 18,
        fontWeight: 600,
        color: color || 'var(--text-primary)',
        lineHeight: 1,
      }}>
        {value}
      </span>
    </div>
  )
}

function Sep() {
  return <div style={{ width: 1, height: 36, background: 'var(--border)', flexShrink: 0 }} />
}
