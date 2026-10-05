import React from 'react'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function readDate() {
  const now = new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    weekday: now.getDay(),
    day: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export default class App extends React.Component {
  state = {
    ...readDate(),
    dialRotation: 0,
  }

  componentDidMount() {
    this.clockInterval = window.setInterval(() => {
      this.setState(readDate())
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.clockInterval)
  }

  rotateDial = () => {
    this.setState(({ dialRotation }) => ({
      dialRotation: (dialRotation + 90) % 360,
    }))
  }

  render() {
    const { year, month, weekday, day, hour, minute, second, dialRotation } = this.state
    const hourAngle = ((hour % 12) + minute / 60) * 30
    const minuteAngle = (minute + second / 60) * 6
    const secondAngle = second * 6

    return (
      <main className="page-shell">
        <header className="topbar">
          <a className="brand" href="#clock" aria-label="Compass Clock home">
            <span className="brand-symbol" aria-hidden="true">C</span>
            <span>FIELD NOTES <b>/ REACT</b></span>
          </a>
          <span className="course-label">WEEK 08 <i /> DAY 01</span>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span className="live-dot" /> EXERCISE 01 / LIFECYCLE</p>
            <h1 id="page-title">A clock with<br /><em>a sense of direction.</em></h1>
            <p className="intro-copy">A live compass clock, kept current by a class component and its mount lifecycle.</p>
          </div>
          <div className="intro-index" aria-hidden="true"><span>LOCAL</span><strong>01</strong><span>SECOND / TICK</span></div>
        </section>

        <section className="clock-section" id="clock" aria-label="Live compass clock">
          <div className="clock-heading">
            <div><p className="eyebrow">YOUR LOCAL TIME</p><h2>The present, plotted.</h2></div>
            <button className="rotate-button" type="button" onClick={this.rotateDial} aria-label="Rotate compass labels">
              <span aria-hidden="true">⟳</span> Rotate dial
            </button>
          </div>

          <div className="clock-layout">
            <div className="compass" aria-label={`${weekdays[weekday]}, ${months[month]} ${day}, ${year}`}>
              <div className="compass-ring compass-ring-outer" />
              <div className="compass-ring compass-ring-inner" />
              <div className="dial-layer" style={{ transform: `rotate(${dialRotation}deg)` }}>
                {Array.from({ length: 60 }, (_, index) => (
                  <span
                    className={index % 5 === 0 ? 'tick tick-major' : 'tick'}
                    key={index}
                    style={{ transform: `translate(-50%, 0) rotate(${index * 6}deg)` }}
                  />
                ))}
                <span className="direction direction-north">N</span>
                <span className="direction direction-east">E</span>
                <span className="direction direction-south">S</span>
                <span className="direction direction-west">W</span>
                <div className="orbit-label orbit-year"><span>YEAR</span><strong>{year}</strong></div>
                <div className="orbit-label orbit-weekday"><span>DAY OF WEEK</span><strong>{weekdays[weekday]}</strong></div>
                <div className="orbit-label orbit-day"><span>DAY</span><strong>{pad(day)}</strong></div>
                <div className="orbit-label orbit-month"><span>MONTH</span><strong>{months[month]}</strong></div>
              </div>

              <div className="clock-hands" aria-hidden="true">
                <span className="hand hand-hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
                <span className="hand hand-minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
                <span className="hand hand-second" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
                <span className="hand-pin" />
              </div>
              <span className="north-star" aria-hidden="true">✳</span>
            </div>

            <div className="time-readout" aria-live="off">
              <p className="readout-kicker"><span className="live-dot" /> LIVE / LOCAL</p>
              <p className="digital-time">
                <span>{pad(hour)}</span><i>:</i><span>{pad(minute)}</span><i>:</i><span className="seconds">{pad(second)}</span>
              </p>
              <p className="linear-date">{weekdays[weekday]}, {months[month]} {day}, {year}</p>
              <div className="readout-rule"><span /></div>
              <p className="readout-note">One tick, every second.<br />Always facing now.</p>
            </div>
          </div>
        </section>

        <footer className="footer"><span>REACT / CLASS COMPONENT</span><span>STATE · EVENTS · LIFECYCLE</span></footer>
      </main>
    )
  }
}
