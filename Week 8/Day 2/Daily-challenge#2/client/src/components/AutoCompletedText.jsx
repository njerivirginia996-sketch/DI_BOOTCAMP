import { Component } from 'react'
import countries from '../data/countries.js'

const MAX_SUGGESTIONS = 8

export default class AutoCompletedText extends Component {
  state = {
    suggestions: [],
    text: '',
    activeIndex: -1,
  }

  handleChange = (event) => {
    const text = event.target.value
    const query = text.trim().toLowerCase()
    const suggestions = query
      ? countries.filter((country) => country.toLowerCase().includes(query)).slice(0, MAX_SUGGESTIONS)
      : []

    this.setState({ text, suggestions, activeIndex: -1 })
  }

  selectCountry = (country) => {
    this.setState({ text: country, suggestions: [], activeIndex: -1 })
  }

  handleKeyDown = (event) => {
    const { suggestions, activeIndex } = this.state
    if (!suggestions.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.setState({ activeIndex: (activeIndex + 1) % suggestions.length })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.setState({ activeIndex: activeIndex <= 0 ? suggestions.length - 1 : activeIndex - 1 })
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      this.selectCountry(suggestions[activeIndex])
    } else if (event.key === 'Escape') {
      this.setState({ suggestions: [], activeIndex: -1 })
    }
  }

  render() {
    const { suggestions, text, activeIndex } = this.state

    return (
      <section className="finder" aria-labelledby="finder-title">
        <div className="finder-heading">
          <div><p className="section-kicker">COUNTRY INDEX / {countries.length} ENTRIES</p><h2 id="finder-title">Where to?</h2></div>
          <span className="finder-index">01 / SEARCH</span>
        </div>

        <label className="search-label" htmlFor="country-search">Country name</label>
        <div className="search-wrap">
          <span className="search-mark" aria-hidden="true">⌕</span>
          <input
            id="country-search"
            type="search"
            value={text}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Start typing a country…"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            aria-controls="country-suggestions"
            aria-activedescendant={activeIndex >= 0 ? `country-option-${activeIndex}` : undefined}
          />
          {text && <button className="clear-button" type="button" onClick={() => this.setState({ text: '', suggestions: [], activeIndex: -1 })} aria-label="Clear search">×</button>}
        </div>

        {suggestions.length > 0 && (
          <ul className="suggestions" id="country-suggestions" role="listbox" aria-label="Country suggestions">
            {suggestions.map((country, index) => (
              <li key={country} id={`country-option-${index}`} role="option" aria-selected={index === activeIndex}>
                <button className={index === activeIndex ? 'suggestion active' : 'suggestion'} type="button" onClick={() => this.selectCountry(country)}>
                  <span className="suggestion-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{country}</span>
                  <span className="suggestion-arrow" aria-hidden="true">↗</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {text && suggestions.length === 0 && !countries.some((country) => country.toLowerCase() === text.trim().toLowerCase()) && (
          <p className="empty-state" role="status">No countries match “{text}”.</p>
        )}

        <div className="selection-line" aria-live="polite">
          <span className="selection-indicator" />
          <span>{countries.some((country) => country === text) ? 'SELECTED' : 'YOUR SELECTION'}</span>
          <strong>{text || 'Nothing selected yet'}</strong>
        </div>
      </section>
    )
  }
}