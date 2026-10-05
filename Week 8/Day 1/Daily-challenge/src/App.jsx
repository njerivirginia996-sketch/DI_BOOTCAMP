import React from 'react'

const emptyForm = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  destination: '',
  nutsFree: '',
  lactoseFree: '',
  vegan: '',
}

function FormComponent({ formData, handleChange }) {
  return (
    <form className="traveler-form" method="get" action="/">
      <div className="form-section">
        <div className="form-section-heading">
          <span className="section-number">01</span>
          <h2>About you</h2>
        </div>
        <div className="field-row">
          <label className="field">
            <span>First name</span>
            <input autoComplete="given-name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" required />
          </label>
          <label className="field">
            <span>Last name</span>
            <input autoComplete="family-name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" required />
          </label>
        </div>
        <div className="field-row field-row-bottom">
          <label className="field age-field">
            <span>Age</span>
            <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} placeholder="25" required />
          </label>
          <fieldset className="choice-field">
            <legend>Gender</legend>
            <div className="choice-options">
              <label className="radio-option"><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required /><span>Male</span></label>
              <label className="radio-option"><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /><span>Female</span></label>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="form-section form-section-last">
        <div className="form-section-heading">
          <span className="section-number">02</span>
          <h2>Your trip</h2>
        </div>
        <label className="field destination-field">
          <span>Destination</span>
          <select name="destination" value={formData.destination} onChange={handleChange} required>
            <option value="" disabled>Select a destination</option>
            <option value="Japan">Japan</option>
            <option value="Thailand">Thailand</option>
            <option value="Brazil">Brazil</option>
            <option value="New Zealand">New Zealand</option>
          </select>
        </label>
        <fieldset className="choice-field dietary-field">
          <legend>Dietary requirements <span>optional</span></legend>
          <div className="diet-options">
            <label className="check-option"><input type="checkbox" name="nutsFree" checked={formData.nutsFree === 'on'} onChange={handleChange} /><span className="checkmark" aria-hidden="true">✓</span><span>Nut-free</span></label>
            <label className="check-option"><input type="checkbox" name="lactoseFree" checked={formData.lactoseFree === 'on'} onChange={handleChange} /><span className="checkmark" aria-hidden="true">✓</span><span>Lactose-free</span></label>
            <label className="check-option"><input type="checkbox" name="vegan" checked={formData.vegan === 'on'} onChange={handleChange} /><span className="checkmark" aria-hidden="true">✓</span><span>Vegan</span></label>
          </div>
        </fieldset>
      </div>

      <button className="submit-button" type="submit"><span>Send traveler details</span><span className="submit-arrow" aria-hidden="true">↗</span></button>
    </form>
  )
}

function ValuePreview({ formData }) {
  const details = [
    ['First name', formData.firstName],
    ['Last name', formData.lastName],
    ['Age', formData.age],
    ['Gender', formData.gender],
    ['Destination', formData.destination],
  ]
  const dietary = [
    ['Nut-free', formData.nutsFree],
    ['Lactose-free', formData.lactoseFree],
    ['Vegan', formData.vegan],
  ]

  return (
    <aside className="preview-panel" aria-live="polite">
      <div className="preview-heading"><span className="preview-icon" aria-hidden="true">↳</span><div><p className="eyebrow">LIVE FORM STATE</p><h2>Your details</h2></div></div>
      <p className="preview-note">Values update as you fill in the form.</p>
      <dl className="preview-list">
        {details.map(([label, value]) => (
          <div className="preview-row" key={label}><dt>{label}</dt><dd className={value ? '' : 'value-empty'}>{value || '—'}</dd></div>
        ))}
      </dl>
      <div className="preview-diet">
        <p className="eyebrow">DIETARY</p>
        <div className="diet-status">
          {dietary.map(([label, value]) => <span className={value ? 'diet-chip diet-chip-active' : 'diet-chip'} key={label}>{value ? '✓' : '–'} {label}</span>)}
        </div>
      </div>
      <div className="url-hint"><span className="url-dot" />SUBMIT OPENS A GET URL</div>
    </aside>
  )
}

export default class App extends React.Component {
  state = { formData: { ...emptyForm } }

  handleChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? (checked ? 'on' : '') : value

    this.setState((currentState) => ({
      formData: { ...currentState.formData, [name]: nextValue },
    }))
  }

  render() {
    return (
      <main className="page-shell">
        <header className="topbar">
          <a className="wordmark" href="#top"><span className="wordmark-symbol">N</span><span>NORTHBOUND <b>TRAVEL CO.</b></span></a>
          <span className="topbar-label">TRAVELER INTAKE <i /> FORM 01</span>
        </header>

        <section className="page-heading" id="top">
          <div>
            <p className="eyebrow"><span className="eyebrow-rule" />A BETTER TRIP STARTS HERE</p>
            <h1>Let’s get<br /><em>to know you.</em></h1>
            <p className="intro-copy">A few details help us shape a journey around you. Tell us who’s going and where you’d like to land.</p>
          </div>
          <div className="heading-aside" aria-hidden="true"><span>FIELD</span><strong>NOTES</strong><i>08 / 01</i></div>
        </section>

        <div className="content-layout">
          <section className="form-column" aria-label="Traveler details form">
            <div className="column-heading"><h2>Traveler details</h2><span><b>*</b> REQUIRED</span></div>
            <FormComponent formData={this.state.formData} handleChange={this.handleChange} />
          </section>
          <ValuePreview formData={this.state.formData} />
        </div>

        <footer className="page-footer"><span>DESIGNED FOR THE WAY YOU TRAVEL</span><span>EST. 1998 <i /> EVERYWHERE, THOUGHTFULLY</span></footer>
      </main>
    )
  }
}