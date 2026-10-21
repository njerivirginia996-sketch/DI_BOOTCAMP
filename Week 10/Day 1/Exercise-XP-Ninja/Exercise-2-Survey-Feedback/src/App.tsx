import { useReducer, useState, type FormEvent } from 'react'

type SurveyState = { status: 'initial' | 'submitting' | 'completed'; started: boolean; feedback: string }
type SurveyAction = { type: 'start' } | { type: 'submit'; feedback: string } | { type: 'complete' } | { type: 'reset' }
const initialState: SurveyState = { status: 'initial', started: false, feedback: '' }

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'start': return { ...initialState, started: true }
    case 'submit': return { ...state, status: 'submitting', feedback: action.feedback }
    case 'complete': return { ...state, status: 'completed' }
    case 'reset': return initialState
  }
}

export default function App() {
  const [state, dispatch] = useReducer(surveyReducer, initialState)
  const [draft, setDraft] = useState('')

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch({ type: 'submit', feedback: draft.trim() })
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    dispatch({ type: 'complete' })
  }

  function resetSurvey() {
    setDraft('')
    dispatch({ type: 'reset' })
  }

  return <main className="page"><a className="back-link" href="../">← All Exercises</a><p className="eyebrow">EXERCISE 02 / useReducer</p><h1>Survey feedback</h1><p className="lede">Start a survey, submit a response, and reset the flow with typed actions.</p><section className="panel">
    <div className="progress"><span className={state.started ? 'on' : ''} /><span className={state.status === 'completed' ? 'on' : ''} /><small>{state.status === 'completed' ? 'COMPLETE' : state.started ? 'YOUR RESPONSE' : 'NOT STARTED'}</small></div>
    {state.status === 'completed' ? <div className="complete"><span className="checkmark">✓</span><h2>Thanks for sharing.</h2><p>Your feedback has been recorded.</p><blockquote>“{state.feedback}”</blockquote><button className="secondary" onClick={resetSurvey} type="button">Start over</button></div> : !state.started ? <div><small className="step">01 / QUICK PULSE</small><h2>How was your<br />experience today?</h2><p className="copy">A short note helps us make the next visit better.</p><button onClick={() => dispatch({ type: 'start' })} type="button">Start survey <span>→</span></button></div> : <form onSubmit={submitFeedback}><label>Your feedback<textarea autoFocus required rows={5} placeholder="What worked well? What could be better?" value={draft} onChange={(event) => setDraft(event.target.value)} /></label><div className="actions"><button disabled={state.status === 'submitting'} type="submit">{state.status === 'submitting' ? 'Submitting…' : 'Submit feedback'} <span>↗</span></button><button className="text-button" onClick={resetSurvey} type="button">Reset</button><span className={`status ${state.status}`}><i />{state.status}</span></div></form>}
  </section></main>
}