import { useState } from 'react'
import './Poll.css'

function App() {
  const [languages, setLanguages] = useState([
    { name: 'Php', votes: 0 },
    { name: 'Python', votes: 0 },
    { name: 'JavaScript', votes: 0 },
    { name: 'Java', votes: 0 },
  ])

  const totalVotes = languages.reduce((total, language) => total + language.votes, 0)
  const leadingVotes = Math.max(...languages.map((language) => language.votes), 0)

  const voteForLanguage = (name) => {
    setLanguages((currentLanguages) => currentLanguages.map((language) => (
      language.name === name
        ? { ...language, votes: language.votes + 1 }
        : language
    )))
  }

  return (
    <main className="app-shell">
      <header className="masthead">
        <div className="masthead-inner">
          <p className="eyebrow">WEEK 07 / DAY 05 / DAILY CHALLENGE</p>
          <h1>Choose your language</h1>
          <p className="masthead-note">Cast a vote for the language you reach for first.</p>
        </div>
        <div className="total-votes" aria-live="polite">
          <span className="total-number">{totalVotes}</span>
          <span className="total-label">{totalVotes === 1 ? 'vote cast' : 'votes cast'}</span>
        </div>
      </header>

      <section className="poll" aria-labelledby="poll-title">
        <div className="poll-heading">
          <div>
            <p className="section-kicker">THE POLL</p>
            <h2 id="poll-title">Current results</h2>
          </div>
          <span className="poll-count">{languages.length} options</span>
        </div>

        <div className="language-list">
          {languages.map((language, index) => {
            const share = totalVotes === 0 ? 0 : (language.votes / totalVotes) * 100
            const isLeading = leadingVotes > 0 && language.votes === leadingVotes

            return (
              <article className={`language-row language-row-${index + 1}`} key={language.name}>
                <div className="language-topline">
                  <div className="language-name-wrap">
                    <span className="language-index">0{index + 1}</span>
                    <h3>{language.name}</h3>
                    {isLeading && <span className="leader-mark">LEADING</span>}
                  </div>
                  <div className="vote-total">
                    <strong>{language.votes}</strong>
                    <span>{language.votes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                </div>
                <div className="vote-track" aria-hidden="true">
                  <span className="vote-fill" style={{ width: `${share}%` }} />
                </div>
                <button
                  className="vote-button"
                  type="button"
                  onClick={() => voteForLanguage(language.name)}
                  aria-label={`Vote for ${language.name}`}
                >
                  Vote for {language.name}
                  <span aria-hidden="true">+</span>
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="page-footer">REACT STATE <span>VOTING / 01</span></footer>
    </main>
  )
}

export default App
