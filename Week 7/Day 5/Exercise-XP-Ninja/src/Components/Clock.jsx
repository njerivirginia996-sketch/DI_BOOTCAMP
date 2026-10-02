import { useEffect, useState } from 'react'

function tick(setCurrentDate) {
  setCurrentDate(new Date())
}

function Clock() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    const intervalId = window.setInterval(() => tick(setCurrentDate), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className="clock-face" aria-live="off">
      <time className="clock-time" dateTime={currentDate.toISOString()}>
        {currentDate.toLocaleTimeString()}
      </time>
      <p className="clock-date">
        {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
    </div>
  )
}

export default Clock