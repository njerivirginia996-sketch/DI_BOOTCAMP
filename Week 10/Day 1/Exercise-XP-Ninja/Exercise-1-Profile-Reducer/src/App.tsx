import { useReducer, useState, type FormEvent } from 'react'

type Profile = { name: string; bio: string }
type ProfileState = { status: 'initial' | 'loading' | 'success' | 'error'; profile: Profile | null; error: string | null }
type ProfileAction = { type: 'load' } | { type: 'update'; profile: Profile } | { type: 'fail'; message: string }

const initialState: ProfileState = { status: 'initial', profile: null, error: null }

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'load': return { ...state, status: 'loading', error: null }
    case 'update': return { status: 'success', profile: action.profile, error: null }
    case 'fail': return { ...state, status: 'error', error: action.message }
  }
}

export default function App() {
  const [state, dispatch] = useReducer(profileReducer, initialState)
  const [name, setName] = useState('Alex Morgan')
  const [bio, setBio] = useState('Building thoughtful digital experiences.')
  const [shouldFail, setShouldFail] = useState(false)

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch({ type: 'load' })
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    if (shouldFail) {
      dispatch({ type: 'fail', message: 'The profile could not be saved. Try again.' })
      return
    }
    dispatch({ type: 'update', profile: { name: name.trim(), bio: bio.trim() } })
  }

  return <main className="page"><a className="back-link" href="../">← All Exercises</a><p className="eyebrow">EXERCISE 01 / useReducer</p><h1>Manage a user profile</h1><p className="lede">Track initial, loading, success, and error states with a typed reducer.</p>
    <section className="panel"><form onSubmit={saveProfile}>
      <label>Name<input required onChange={(event) => setName(event.target.value)} value={name} /></label>
      <label>Bio<textarea required rows={3} onChange={(event) => setBio(event.target.value)} value={bio} /></label>
      <label className="check"><input type="checkbox" checked={shouldFail} onChange={(event) => setShouldFail(event.target.checked)} /> Simulate a failed update</label>
      <div className="actions"><button disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Saving…' : 'Save profile'}</button><span className={`status ${state.status}`}><i />{state.status}</span></div>
    </form>
    <div className={`result ${state.status}`} aria-live="polite">{state.status === 'success' && state.profile ? <><small>SAVED PROFILE</small><strong>{state.profile.name}</strong><p>{state.profile.bio}</p></> : state.status === 'error' ? <p role="alert">{state.error}</p> : state.status === 'loading' ? <p role="status">Updating your profile…</p> : <p>Saved profile details will appear here.</p>}</div></section>
  </main>
}