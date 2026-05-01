import React from 'react'
import { useGameStore } from './store'
import MenuScreen from './components/MenuScreen'
import CountdownScreen from './components/CountdownScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'

export default function App() {
  const screen = useGameStore((s) => s.screen)

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      {screen === 'menu' && <MenuScreen />}
      {screen === 'countdown' && <CountdownScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'results' && <ResultsScreen />}
    </div>
  )
}
