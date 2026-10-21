import { useState } from 'react'
import { useForm } from './hooks/useForm'
import './exercise.css'

type RegistrationValues = { name: string; email: string; password: string }

function ExerciseApp() {
  const [createdFor, setCreatedFor] = useState('')
  const form = useForm<RegistrationValues>(
    { name: '', email: '', password: '' },
    (values) => {
      const errors: Partial<Record<keyof RegistrationValues, string>> = {}
      if (!values.name.trim()) errors.name = 'Enter your name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'
      if (values.password.length < 8 || !/[A-Z]/.test(values.password) || !/\d/.test(values.password)) {
        errors.password = 'Use 8+ characters, one uppercase letter, and one number.'
      }
      return errors
    },
    async (values) => {
      await new Promise((resolve) => window.setTimeout(resolve, 550))
      if (values.email.toLowerCase() === 'taken@example.com') {
        throw new Error('This email is already registered. Try another address.')
      }
      setCreatedFor(values.name.trim())
    },
  )

  return (
    <main className="form-app">
      <header className="form-topbar"><a className="form-wordmark" href="#home"><span>FORM</span> / LAB</a><span className="form-topnote">REACT + TYPESCRIPT <i /></span></header>
      <section className="form-intro" id="home">
        <p className="form-kicker">ADVANCED TYPESCRIPT <span>01 / 03</span></p>
        <h1>State that<br /><em>knows its shape.</em></h1>
        <p className="form-lede">A reusable form hook with typed values, field-level validation, and clear submission states.</p>
      </section>
      <div className="form-layout">
        <section className="form-panel" aria-labelledby="form-title">
          <div className="form-panel-heading"><div><span className="form-panel-index">EXERCISE 01</span><h2 id="form-title">Create your account</h2></div><span className="form-hook-label">useForm&lt;Values&gt;</span></div>
          <form noValidate onSubmit={(event) => void form.handleSubmit(event)}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" autoComplete="name" value={form.values.name} onChange={(event) => form.setFieldValue('name', event.target.value)} aria-invalid={Boolean(form.errors.name)} aria-describedby={form.errors.name ? 'name-error' : undefined} placeholder="Ada Lovelace" />
              {form.errors.name && <small className="form-field-error" id="name-error">{form.errors.name}</small>}
            </div>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" value={form.values.email} onChange={(event) => form.setFieldValue('email', event.target.value)} aria-invalid={Boolean(form.errors.email)} aria-describedby={form.errors.email ? 'email-error' : undefined} placeholder="ada@example.com" />
              {form.errors.email && <small className="form-field-error" id="email-error">{form.errors.email}</small>}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" autoComplete="new-password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.target.value)} aria-invalid={Boolean(form.errors.password)} aria-describedby={form.errors.password ? 'password-error' : 'password-help'} placeholder="At least 8 characters" />
              {form.errors.password
                ? <small className="form-field-error" id="password-error">{form.errors.password}</small>
                : <small className="form-field-help" id="password-help">Include one uppercase letter and one number.</small>}
            </div>
            {form.submitError && <p className="form-notice form-notice-error" role="alert">{form.submitError}</p>}
            {form.status === 'success' && <p className="form-notice form-notice-success" role="status">Welcome, {createdFor}. Your account is ready.</p>}
            <button className="form-submit" type="submit" disabled={form.status === 'submitting'}>
              {form.status === 'submitting' ? 'Creating account…' : 'Create account'}<span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="form-demo-note">For the error path, submit <code>taken@example.com</code> with a valid password.</p>
        </section>
        <aside className="form-aside">
          <span className="form-note-mark" aria-hidden="true">T</span>
          <p className="form-kicker">THE PATTERN</p>
          <h2>Types travel<br />with the data.</h2>
          <p><code>setFieldValue</code> only accepts a key from your value type, and the field value must match that key’s type.</p>
          <div className="form-code-note"><span>TYPE CONTRACT</span><code>setFieldValue('email', value)</code><small>Unknown fields fail at compile time.</small></div>
          <div className="form-step-count"><span>TIME</span><strong>20 <small>MIN</small></strong></div>
        </aside>
      </div>
      <footer className="form-footer"><span>FORM / LAB</span><span>ADVANCED TYPESCRIPT <b>·</b> USING TYPESCRIPT WITH REACT</span></footer>
    </main>
  )
}

export default ExerciseApp
