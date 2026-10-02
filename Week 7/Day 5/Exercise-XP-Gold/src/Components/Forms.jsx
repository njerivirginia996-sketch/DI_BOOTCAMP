import { useState } from 'react'

function Forms() {
  const [username, setUsername] = useState('')
  const [age, setAge] = useState(null)
  const [errormessage, setErrormessage] = useState('')
  const [about, setAbout] = useState('I am learning React forms.')
  const [car, setCar] = useState('Volvo')

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'username') {
      setUsername(value)
    }

    if (name === 'age') {
      setAge(value)
      setErrormessage(value !== '' && !/^\d+$/.test(value) ? 'Age must be a number.' : '')
    }
  }

  const mySubmitHandler = (event) => {
    event.preventDefault()

    if (!errormessage) {
      window.alert(username)
    }
  }

  const header = username.trim()
    ? <h3>Welcome, {username}.</h3>
    : null

  const profileHeader = username.trim() && age && !errormessage
    ? <h3>{username} is {age} years old.</h3>
    : null

  return (
    <div className="form-workspace">
      <section className="profile-section" aria-labelledby="profile-title">
        <h2 id="profile-title">Profile</h2>
        {header}
        <form className="profile-form" onSubmit={mySubmitHandler}>
          <label className="field-label" htmlFor="username">
            Name
            <input
              className="field-control"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </label>
          <label className="field-label" htmlFor="age">
            Age
            <input
              className="field-control"
              id="age"
              name="age"
              type="text"
              inputMode="numeric"
              value={age ?? ''}
              onChange={handleChange}
              aria-invalid={Boolean(errormessage)}
              aria-describedby={errormessage ? 'age-error' : undefined}
              required
            />
          </label>
          {errormessage && <p className="error-message" id="age-error" role="alert">{errormessage}</p>}
          <button className="submit-button" type="submit">Submit</button>
        </form>
        {profileHeader && <div className="profile-preview">{profileHeader}</div>}
      </section>

      <div className="demo-fields">
        <section className="demo-section" aria-labelledby="note-title">
          <h2 id="note-title">Textarea</h2>
          <label className="field-label" htmlFor="about">
            About
            <textarea
              className="field-control"
              id="about"
              name="about"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
            />
          </label>
        </section>

        <section className="demo-section" aria-labelledby="car-title">
          <h2 id="car-title">Select a car</h2>
          <label className="field-label" htmlFor="car">
            Car brand
            <select
              className="field-control"
              id="car"
              name="car"
              value={car}
              onChange={(event) => setCar(event.target.value)}
            >
              <option value="Volvo">Volvo</option>
              <option value="Saab">Saab</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
            </select>
          </label>
        </section>
      </div>
    </div>
  )
}

export default Forms