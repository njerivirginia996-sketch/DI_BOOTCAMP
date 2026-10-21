import { useReducer } from 'react'

type FormState = { name: string; email: string; message: string }
type FormAction = { type: 'updateField'; field: keyof FormState; value: string } | { type: 'resetForm' }
const initialState: FormState = { name: '', email: '', message: '' }

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'updateField': return { ...state, [action.field]: action.value }
    case 'resetForm': return initialState
  }
}

export default function App() {
  const [form, dispatch] = useReducer(formReducer, initialState)
  const fields: { key: keyof FormState; label: string; type: string; autocomplete: string }[] = [
    { key: 'name', label: 'Name', type: 'text', autocomplete: 'name' },
    { key: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
  ]

  return <main className="page"><a className="back-link" href="../">← All Exercises</a><p className="eyebrow">EXERCISE 03 / useReducer</p><h1>Contact form state</h1><p className="lede">Update typed form fields through one reducer and reset them together.</p><section className="panel"><div className="layout"><form onSubmit={(event) => event.preventDefault()}>
    {fields.map((field) => <label key={field.key}>{field.label}<input autoComplete={field.autocomplete} onChange={(event) => dispatch({ type: 'updateField', field: field.key, value: event.target.value })} type={field.type} value={form[field.key]} /></label>)}
    <label>Message<textarea rows={4} placeholder="Write a few lines…" onChange={(event) => dispatch({ type: 'updateField', field: 'message', value: event.target.value })} value={form.message} /></label>
    <div className="actions"><button className="secondary" onClick={() => dispatch({ type: 'resetForm' })} type="button">Reset fields</button><small>{Object.values(form).filter(Boolean).length} / 3 FIELDS FILLED</small></div>
  </form><aside className="preview"><small>LIVE PREVIEW</small><h2>{form.name || 'Your name'}</h2><a href={form.email ? `mailto:${form.email}` : undefined}>{form.email || 'you@example.com'}</a><p>{form.message || 'Your message will appear here as you type.'}</p></aside></div></section></main>
}