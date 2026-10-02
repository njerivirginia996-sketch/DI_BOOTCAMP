import Car from './Components/Car'
import Color from './Components/Color.jsx'
import Events from './Components/Events.jsx'
import Phone from './Components/Phone.jsx'
import './App.css'

const carinfo = { name: 'Ford', model: 'Mustang' }

function App() {
  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <p className="eyebrow">WEEK 07 / DAY 05</p>
          <h1>React practice lab</h1>
          <p className="masthead-note">Components, state &amp; events</p>
        </div>
        <span className="masthead-index" aria-hidden="true">XP / 04</span>
      </header>

      <div className="exercise-list">
        <section className="exercise" aria-labelledby="car-title">
          <div className="exercise-heading">
            <span className="exercise-number">01</span>
            <div>
              <p className="exercise-kicker">PROPS + STATE</p>
              <h2 id="car-title">Car and garage</h2>
            </div>
          </div>
          <Car carInfo={carinfo} />
        </section>

        <section className="exercise" aria-labelledby="events-title">
          <div className="exercise-heading">
            <span className="exercise-number">02</span>
            <div>
              <p className="exercise-kicker">EVENT HANDLERS</p>
              <h2 id="events-title">Events</h2>
            </div>
          </div>
          <Events />
        </section>

        <section className="exercise" aria-labelledby="phone-title">
          <div className="exercise-heading">
            <span className="exercise-number">03</span>
            <div>
              <p className="exercise-kicker">STATE + UPDATE</p>
              <h2 id="phone-title">Phone</h2>
            </div>
          </div>
          <Phone />
        </section>

        <section className="exercise" aria-labelledby="color-title">
          <div className="exercise-heading">
            <span className="exercise-number">04</span>
            <div>
              <p className="exercise-kicker">EFFECT + STATE</p>
              <h2 id="color-title">Favorite color</h2>
            </div>
          </div>
          <Color />
        </section>
      </div>
      <footer className="page-footer">EXERCISE XP <span>REACT / 2026</span></footer>
    </main>
  )
}

export default App
