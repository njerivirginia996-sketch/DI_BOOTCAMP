import { useState } from 'react'

type LastAction = 'none' | 'increment' | 'decrement'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const [lastAction, setLastAction] = useState<LastAction>('none')

  function increment() {
    setCount((currentCount) => currentCount + 1)
    setLastAction('increment')
  }

  function decrement() {
    setCount((currentCount) => currentCount - 1)
    setLastAction('decrement')
  }

  return (
    <section className="counter-card" aria-label="Counter controls">
      <p className="counter-label">CURRENT VALUE</p>
      <output className="counter-value" aria-live="polite">{count}</output>
      <div className="counter-actions">
        <button type="button" onClick={decrement} aria-label="Decrement counter">-</button>
        <button type="button" onClick={increment} aria-label="Increment counter">+</button>
      </div>
      <p className="last-action">Last action: <strong>{lastAction}</strong></p>
    </section>
  )
}